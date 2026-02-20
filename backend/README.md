# Flytoez Dance Company - Backend Setup (DynamoDB)

## Overview

This backend uses **AWS DynamoDB** as the database. DynamoDB is a fully managed NoSQL database service that's serverless, scalable, and integrates perfectly with AWS services.

### Benefits
- ✅ **Serverless:** No servers to manage
- ✅ **AWS Native:** Perfect integration with App Runner, Amplify
- ✅ **Free Tier:** 25GB storage + 25 read/write capacity units
- ✅ **Fast:** Single-digit millisecond latency
- ✅ **Auto-scaling:** Scales automatically with traffic

---

## Quick Start

### 1. Create DynamoDB Table

Go to AWS DynamoDB Console: https://console.aws.amazon.com/dynamodbv2/

1. Click **"Create table"**
2. **Table name:** `CostumeMeasurements`
3. **Partition key:** `id` (String)
4. Use **"Default settings"**
5. Click **"Create table"**

### 2. Get AWS Credentials (for local development)

#### Option A: Use Existing AWS User
If you have AWS credentials already, skip to Step 3.

#### Option B: Create New IAM User

1. Go to IAM Console: https://console.aws.amazon.com/iam/
2. Click **"Users"** → **"Create user"**
3. Username: `flytoez-backend-dev`
4. **Set permissions:** Attach **"AmazonDynamoDBFullAccess"**
5. Click **"Security credentials"** → **"Create access key"**
6. Choose **"Application running outside AWS"**
7. **Save your credentials:**
   - Access Key ID
   - Secret Access Key

### 3. Configure Environment Variables

Create `backend/.env` file:

```bash
# AWS Credentials
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-1

# DynamoDB Table Name
DYNAMODB_TABLE=CostumeMeasurements

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 4. Install Dependencies

```bash
cd backend
npm install
```

### 5. Start the Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

The backend server will run on http://localhost:5000

---

## API Endpoints

### Costume Measurements

- **POST** `/api/costume-measurements` - Create new measurement
- **GET** `/api/costume-measurements` - Get all measurements
- **GET** `/api/costume-measurements/:id` - Get single measurement by ID
- **PUT** `/api/costume-measurements/:id` - Update measurement
- **DELETE** `/api/costume-measurements/:id` - Delete measurement
- **GET** `/api/costume-measurements/search/:name` - Search by student name

### Health Check

- **GET** `/api/health` - Check server status and database connection

---

## Testing the API

### Using Browser
Visit http://localhost:5000/api/health

### Using curl
```bash
# Health check
curl http://localhost:5000/api/health

# Get all measurements
curl http://localhost:5000/api/costume-measurements

# Create new measurement
curl -X POST http://localhost:5000/api/costume-measurements \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "John Doe",
    "age": 12,
    "height": 60,
    "weight": 100,
    "chest": 32,
    "waist": 28,
    "hip": 34,
    "shoulder": 16,
    "sleeveLength": 22,
    "inseam": 28,
    "notes": "Prefers loose fit"
  }'
```

---

## Viewing Data in DynamoDB

### Using AWS Console
1. Go to: https://console.aws.amazon.com/dynamodbv2/
2. Click **"Tables"** → **"CostumeMeasurements"**
3. Click **"Explore table items"**
4. View, edit, or delete items

### Using AWS CLI (Optional)
```bash
# Install AWS CLI first
brew install awscli

# Configure credentials
aws configure

# Scan all items
aws dynamodb scan --table-name CostumeMeasurements

# Get specific item
aws dynamodb get-item --table-name CostumeMeasurements --key '{"id":{"S":"your-id-here"}}'
```

---

## Deployment to AWS App Runner

For production deployment instructions, see:
- [DEPLOY_APPRUNNER.md](DEPLOY_APPRUNNER.md) - App Runner deployment guide
- [DYNAMODB_SETUP.md](DYNAMODB_SETUP.md) - Detailed DynamoDB setup

---

## Troubleshooting

### Backend won't start
- Verify AWS credentials in `.env` file
- Check if port 5000 is available: `lsof -i :5000`
- Ensure DynamoDB table exists in your AWS region

### AWS Credentials Errors
- Verify `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are correct
- Check IAM user has DynamoDB permissions
- Ensure `AWS_REGION` matches your DynamoDB table region

### DynamoDB Connection Errors
- Check your internet connection
- Verify table name matches: `CostumeMeasurements`
- Ensure IAM user has necessary DynamoDB permissions
- Check AWS region is correct in `.env`

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings in `server.js`
- Verify `REACT_APP_API_URL` in frontend `.env`

---

## Project Structure

```
backend/
├── server.js                 # Main server file
├── package.json              # Dependencies
├── .env                      # Environment variables (create this)
├── config/
│   └── dynamodb.js          # DynamoDB client configuration
├── models/
│   └── CostumeMeasurement.js # DynamoDB model
└── routes/
    └── costumeMeasurements.js # API routes
```

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | AWS access key | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | `wJalrXUtn...` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `DYNAMODB_TABLE` | DynamoDB table name | `CostumeMeasurements` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |

---

## Additional Resources

- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/)
- [Express.js Documentation](https://expressjs.com/)
