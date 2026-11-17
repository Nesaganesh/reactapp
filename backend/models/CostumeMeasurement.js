const { PutCommand, GetCommand, ScanCommand, DeleteCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'CostumeMeasurements';

class CostumeMeasurement {
  /**
   * Create a new costume measurement
   */
  static async create(data) {
    const item = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    });

    await docClient.send(command);
    return item;
  }

  /**
   * Get all costume measurements
   */
  static async findAll() {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });

    const response = await docClient.send(command);
    return response.Items || [];
  }

  /**
   * Find report-roster details without loading parent or measurement information.
   */
  static async findReportRosterByBranch(branch, group) {
    const students = [];
    const unassignedGroupStudents = [];
    let ExclusiveStartKey;

    do {
      const response = await docClient.send(new ScanCommand({
        TableName: TABLE_NAME,
        ProjectionExpression: 'id, #studentName, #branch, #group',
        FilterExpression: '#branch = :branch',
        ExpressionAttributeNames: {
          '#studentName': 'studentName',
          '#branch': 'branch',
          '#group': 'group'
        },
        ExpressionAttributeValues: { ':branch': branch },
        ExclusiveStartKey
      }));

      for (const item of response.Items || []) {
        const name = String(item.studentName || '').trim().replace(/\\s+/g, ' ');
        if (!name) continue;
        if (!item.group) {
          unassignedGroupStudents.push({ id: item.id, name });
        } else if (item.group === group) {
          students.push({ id: item.id, name, branch: item.branch, group: item.group });
        }
      }

      ExclusiveStartKey = response.LastEvaluatedKey;
    } while (ExclusiveStartKey);

    return { students, unassignedGroupStudents };
  }

  static async hasStudentInBranch(branch, studentName) {
    return this.hasStudentInBranchAndGroup(branch, null, studentName);
  }

  static async hasStudentInBranchAndGroup(branch, group, studentName) {
    const expectedName = String(studentName || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
    let ExclusiveStartKey;

    do {
      const response = await docClient.send(new ScanCommand({
        TableName: TABLE_NAME,
        ProjectionExpression: '#studentName, #branch, #group',
        FilterExpression: '#branch = :branch',
        ExpressionAttributeNames: { '#studentName': 'studentName', '#branch': 'branch', '#group': 'group' },
        ExpressionAttributeValues: { ':branch': branch },
        ExclusiveStartKey
      }));

      if ((response.Items || []).some(item =>
        String(item.studentName || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase() === expectedName &&
        (group === null || item.group === group)
      )) {
        return true;
      }
      ExclusiveStartKey = response.LastEvaluatedKey;
    } while (ExclusiveStartKey);

    return false;
  }

  static async assignReportGroup(id, branch, group) {
    const response = await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: 'SET #group = :group, #updatedAt = :updatedAt',
      ConditionExpression: 'attribute_exists(#id) AND #branch = :branch AND attribute_not_exists(#group)',
      ExpressionAttributeNames: {
        '#id': 'id',
        '#branch': 'branch',
        '#group': 'group',
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':branch': branch,
        ':group': group,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    }));
    return response.Attributes;
  }

  /**
   * Get a single costume measurement by ID
   */
  static async findById(id) {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });

    const response = await docClient.send(command);
    return response.Item;
  }

  /**
   * Update a costume measurement
   */
  static async update(id, data) {
    // Build update expression dynamically
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(data).forEach((key, index) => {
      updateExpressions.push(`#field${index} = :value${index}`);
      expressionAttributeNames[`#field${index}`] = key;
      expressionAttributeValues[`:value${index}`] = data[key];
    });

    // Always update the updatedAt timestamp
    updateExpressions.push(`#updatedAt = :updatedAt`);
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });

    const response = await docClient.send(command);
    return response.Attributes;
  }

  /**
   * Delete a costume measurement
   */
  static async delete(id) {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });

    await docClient.send(command);
    return { id };
  }

  /**
   * Search measurements by student name
   */
  static async searchByName(studentName) {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'contains(#name, :name)',
      ExpressionAttributeNames: {
        '#name': 'studentName',
      },
      ExpressionAttributeValues: {
        ':name': studentName,
      },
    });

    const response = await docClient.send(command);
    return response.Items || [];
  }
}

module.exports = CostumeMeasurement;
