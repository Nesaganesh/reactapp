const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const {
  CreateTableCommand,
  DescribeTableCommand,
  waitUntilTableExists
} = require('@aws-sdk/client-dynamodb');
const { GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { client, docClient, REGION } = require('../config/dynamodb');
const store = require('../services/studentReportsStore');

const rosterPath = path.join(__dirname, '..', 'data', 'student-roster.json');
const tableSchemaPath = path.join(__dirname, '..', 'dynamodb', 'student-reports-table.json');
const createTable = process.argv.includes('--create-table');

async function ensureTable() {
  try {
    await client.send(new DescribeTableCommand({ TableName: store.TABLE_NAME }));
    console.log(`DynamoDB table ${store.TABLE_NAME} already exists in ${REGION}.`);
  } catch (error) {
    if (error.name !== 'ResourceNotFoundException' || !createTable) throw error;
    const schema = JSON.parse(fs.readFileSync(tableSchemaPath, 'utf8'));
    schema.TableName = store.TABLE_NAME;
    console.log(`Creating ${store.TABLE_NAME} in ${REGION}...`);
    await client.send(new CreateTableCommand(schema));
    await waitUntilTableExists({ client, maxWaitTime: 180 }, { TableName: store.TABLE_NAME });
    console.log('Table is active.');
  }
}

async function putIfMissing(item) {
  const key = { PK: item.PK, SK: item.SK };
  const existing = await docClient.send(new GetCommand({
    TableName: store.TABLE_NAME,
    Key: key,
    ConsistentRead: true
  }));
  if (existing.Item) return false;

  try {
    await docClient.send(new PutCommand({
      TableName: store.TABLE_NAME,
      Item: item,
      ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)'
    }));
    return true;
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') return false;
    throw error;
  }
}

async function migrate() {
  await ensureTable();
  const roster = JSON.parse(fs.readFileSync(rosterPath, 'utf8'));
  const sourceToGroup = roster.sourceSectionToGroup || {};
  const summary = { students: 0, reports: 0, parentCodes: 0, metadata: 0, alreadyPresent: 0 };

  const metadata = Object.fromEntries(Object.entries(roster).filter(([key]) =>
    !['students', 'reports', 'parentAccessCodes'].includes(key)
  ));
  if (await putIfMissing({
    PK: 'META',
    SK: 'ROSTER',
    entityType: 'ROSTER_METADATA',
    ...metadata,
    migratedAt: new Date().toISOString()
  })) summary.metadata += 1;
  else summary.alreadyPresent += 1;

  for (const originalStudent of roster.students || []) {
    const student = {
      ...originalStudent,
      group: originalStudent.group || sourceToGroup[originalStudent.section] || null
    };
    const item = store.studentItem(student);
    if (await putIfMissing(item)) summary.students += 1;
    else summary.alreadyPresent += 1;
  }

  for (const report of roster.reports || []) {
    const item = {
      ...report,
      PK: `STUDENT#${report.studentId}`,
      SK: `REPORT#${report.createdAt}#${report.id}`,
      entityType: 'REPORT'
    };
    if (await putIfMissing(item)) summary.reports += 1;
    else summary.alreadyPresent += 1;
  }

  for (const credential of roster.parentAccessCodes || []) {
    try {
      await store.saveLegacyParentCode({
        studentId: credential.studentId,
        codeHash: credential.codeHash,
        hashVersion: credential.hashVersion || 'legacy-sha256',
        branch: (roster.students || []).find(student => student.id === credential.studentId)?.branch
      });
      summary.parentCodes += 1;
    } catch (error) {
      if (error.name === 'TransactionCanceledException') summary.alreadyPresent += 1;
      else throw error;
    }
  }

  console.log('Migration finished:', JSON.stringify(summary, null, 2));
  console.log('The original JSON file was not modified or deleted.');
}

migrate().catch(error => {
  console.error('Migration failed:', error);
  process.exitCode = 1;
});
