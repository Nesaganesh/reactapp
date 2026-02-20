const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Configure AWS region from environment variable
const REGION = process.env.AWS_REGION || 'us-east-1';

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

module.exports = { docClient, REGION };
