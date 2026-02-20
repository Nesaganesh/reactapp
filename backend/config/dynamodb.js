const { DynamoDBClient, CreateTableCommand, DescribeTableCommand, waitUntilTableExists } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Configure AWS region from environment variable
const REGION = process.env.AWS_REGION || 'us-east-1';
const TABLE_NAME = process.env.DYNAMODB_TABLE || 'CostumeMeasurements';

// Create DynamoDB client
const client = new DynamoDBClient({
  region: REGION,
  // In production (App Runner), AWS credentials are automatically provided via IAM role
  // In local development, credentials are read from environment variables or AWS config
});

// Create Document Client for easier data manipulation
const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true, // Remove undefined values
    convertEmptyValues: false,   // Don't convert empty strings/sets
  },
  unmarshallOptions: {
    wrapNumbers: false, // Don't wrap numbers in objects
  },
});

console.log(`✅ DynamoDB client configured for region: ${REGION}`);

/**
 * Initialize DynamoDB table - creates table if it doesn't exist
 */
async function initializeTable() {
  try {
    // Check if table exists
    const describeCommand = new DescribeTableCommand({ TableName: TABLE_NAME });
    await client.send(describeCommand);
    console.log(`✅ DynamoDB table '${TABLE_NAME}' already exists`);
    return true;
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      // Table doesn't exist, create it
      console.log(`📊 Creating DynamoDB table '${TABLE_NAME}'...`);
      
      try {
        const createCommand = new CreateTableCommand({
          TableName: TABLE_NAME,
          KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' } // Partition key
          ],
          AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' } // String type
          ],
          BillingMode: 'PAY_PER_REQUEST', // On-demand billing
          Tags: [
            { Key: 'Application', Value: 'FlytoezDanceCompany' },
            { Key: 'Environment', Value: process.env.NODE_ENV || 'development' }
          ]
        });
        
        await client.send(createCommand);
        
        // Wait for table to be active
        console.log(`⏳ Waiting for table '${TABLE_NAME}' to become active...`);
        await waitUntilTableExists(
          { client, maxWaitTime: 60 },
          { TableName: TABLE_NAME }
        );
        
        console.log(`✅ DynamoDB table '${TABLE_NAME}' created successfully!`);
        return true;
      } catch (createError) {
        console.error(`❌ Error creating table '${TABLE_NAME}':`, createError.message);
        throw createError;
      }
    } else {
      // Some other error occurred
      console.error(`❌ Error checking table '${TABLE_NAME}':`, error.message);
      throw error;
    }
  }
}

module.exports = { docClient, client, REGION, TABLE_NAME, initializeTable };
