const {
  GetCommand,
  PutCommand,
  QueryCommand,
  TransactWriteCommand
} = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../config/dynamodb');

const TABLE_NAME = process.env.STUDENT_REPORTS_TABLE || 'FlytoezStudentReports';

const studentKey = studentId => ({ PK: `STUDENT#${studentId}`, SK: 'PROFILE' });
const parentCodeKey = studentId => ({ PK: `STUDENT#${studentId}`, SK: 'PARENT_CODE' });
const codeLookupKey = codeHash => ({ PK: `CODE#${codeHash}`, SK: 'AUTH' });
const normalizedName = name => String(name || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
const classPartition = (branch, group) => `CLASS#${branch || 'UNASSIGNED'}#${group}`;

function studentItem(student) {
  const item = {
    ...student,
    ...studentKey(student.id),
    entityType: 'STUDENT'
  };
  const group = student.group;
  if (group) {
    item.GSI1PK = classPartition(student.branch, group);
    item.GSI1SK = `NAME#${normalizedName(student.name)}#${student.id}`;
  } else {
    delete item.GSI1PK;
    delete item.GSI1SK;
  }
  item.GSI2PK = `NAME#${normalizedName(student.name)}`;
  item.GSI2SK = `STUDENT#${student.id}`;
  return item;
}

async function getStudent(studentId) {
  const result = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: studentKey(studentId),
    ConsistentRead: true
  }));
  return result.Item || null;
}

async function createStudent(student) {
  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: studentItem(student),
    ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)'
  }));
  return student;
}

async function listStudents(branch, group) {
  const partitions = [classPartition(branch, group), classPartition(null, group)];
  const results = await Promise.all(partitions.map(PK => docClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: 'ClassIndex',
    KeyConditionExpression: 'GSI1PK = :partition',
    ExpressionAttributeValues: { ':partition': PK }
  }))));
  const byId = new Map();
  results.flatMap(result => result.Items || []).forEach(item => byId.set(item.id, item));
  return [...byId.values()];
}

async function findStudentsByName(name) {
  const result = await docClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: 'NameIndex',
    KeyConditionExpression: 'GSI2PK = :name',
    ExpressionAttributeValues: { ':name': `NAME#${normalizedName(name)}` }
  }));
  return result.Items || [];
}

async function getReports(studentId, branch) {
  const reports = [];
  let ExclusiveStartKey;
  do {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :student AND begins_with(SK, :report)',
      ExpressionAttributeValues: {
        ':student': `STUDENT#${studentId}`,
        ':report': 'REPORT#'
      },
      ExclusiveStartKey
    }));
    reports.push(...(result.Items || []));
    ExclusiveStartKey = result.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return reports.filter(report => !branch || report.branch === branch);
}

async function getParentCode(studentId) {
  const result = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: parentCodeKey(studentId),
    ConsistentRead: true
  }));
  return result.Item || null;
}

async function findParentCodeByHash(codeHash) {
  const result = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: codeLookupKey(codeHash),
    ConsistentRead: true
  }));
  return result.Item || null;
}

async function saveReports(entries) {
  const TransactItems = [];
  for (const { student, report } of entries) {
    TransactItems.push({
      Put: {
        TableName: TABLE_NAME,
        Item: studentItem({ ...student, branch: report.branch, group: report.group })
      }
    });
    TransactItems.push({
      Put: {
        TableName: TABLE_NAME,
        Item: {
          ...report,
          PK: `STUDENT#${report.studentId}`,
          SK: `REPORT#${report.createdAt}#${report.id}`,
          entityType: 'REPORT'
        },
        ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)'
      }
    });
  }
  await docClient.send(new TransactWriteCommand({ TransactItems }));
}

async function saveParentCode({ student, codeHash, hashVersion, branch, replace }) {
  const previous = await getParentCode(student.id);
  const codeItem = {
    ...codeLookupKey(codeHash),
    entityType: 'PARENT_CODE_LOOKUP',
    studentId: student.id,
    codeHash,
    hashVersion,
    branch: branch || student.branch || null,
    createdAt: new Date().toISOString()
  };
  const parentCodeItem = {
    ...parentCodeKey(student.id),
    entityType: 'PARENT_CODE',
    codeHash,
    hashVersion,
    createdAt: codeItem.createdAt
  };
  const TransactItems = [];
  if (branch && !student.branch) {
    TransactItems.push({
      Put: {
        TableName: TABLE_NAME,
        Item: studentItem({ ...student, branch }),
        ConditionExpression: 'attribute_not_exists(branch) OR attribute_type(branch, :nullType)',
        ExpressionAttributeValues: { ':nullType': 'NULL' }
      }
    });
  }
  if (previous?.codeHash) {
    TransactItems.push({ Delete: { TableName: TABLE_NAME, Key: codeLookupKey(previous.codeHash) } });
  }
  TransactItems.push({
    Put: {
      TableName: TABLE_NAME,
      Item: codeItem,
      ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)'
    }
  });
  TransactItems.push({
    Put: {
      TableName: TABLE_NAME,
      Item: parentCodeItem,
      ...(replace ? {} : { ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)' })
    }
  });
  await docClient.send(new TransactWriteCommand({ TransactItems }));
}

async function saveLegacyParentCode({ studentId, codeHash, hashVersion, branch }) {
  const TransactItems = [
    {
      Put: {
        TableName: TABLE_NAME,
        Item: {
          ...codeLookupKey(codeHash),
          entityType: 'PARENT_CODE_LOOKUP',
          studentId,
          codeHash,
          hashVersion,
          branch: branch || null,
          createdAt: new Date().toISOString()
        },
        ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)'
      }
    },
    {
      Put: {
        TableName: TABLE_NAME,
        Item: {
          ...parentCodeKey(studentId),
          entityType: 'PARENT_CODE',
          codeHash,
          hashVersion,
          createdAt: new Date().toISOString()
        },
        ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)'
      }
    }
  ];
  await docClient.send(new TransactWriteCommand({ TransactItems }));
}

async function getMetadata() {
  const result = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { PK: 'META', SK: 'ROSTER' }
  }));
  return result.Item || null;
}

module.exports = {
  TABLE_NAME,
  studentItem,
  studentKey,
  parentCodeKey,
  codeLookupKey,
  getStudent,
  createStudent,
  listStudents,
  findStudentsByName,
  getReports,
  getParentCode,
  findParentCodeByHash,
  saveReports,
  saveParentCode,
  saveLegacyParentCode,
  getMetadata
};
