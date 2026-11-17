const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const {
  CreateTableCommand,
  DescribeTableCommand,
  waitUntilTableExists
} = require('@aws-sdk/client-dynamodb');
const { client, REGION } = require('../config/dynamodb');
const store = require('../services/studentReportsStore');

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

async function migrate() {
  await ensureTable();
  console.log(`Student reports table ${store.TABLE_NAME} is ready. Student roster data is sourced from CostumeMeasurements.`);
}

migrate().catch(error => {
  console.error('Migration failed:', error);
  process.exitCode = 1;
});
