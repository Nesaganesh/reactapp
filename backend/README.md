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

### Student Progress Reports

- **POST** `/api/student-reports/teacher/login` - Teacher code sign-in; returns a short-lived signed token
- **GET** `/api/student-reports/teacher/students?branch=Ipswich&group=LittleLegends` - Load the class roster (teacher token required)
- **POST** `/api/student-reports/teacher/students` - Add a student to a branch and group in DynamoDB (teacher token required)
- **POST** `/api/student-reports/teacher/reports` - Save an assessment (teacher token required)
- **POST** `/api/student-reports/teacher/reports/bulk` - Save shared scores and feedback for 1–50 selected students (teacher token required)
- **POST** `/api/student-reports/teacher/students/:studentId/parent-code/reset` - Generate or reset a student's six-digit parent code (teacher token required; only its keyed HMAC hash is stored)
- **POST** `/api/student-reports/parent/register` - Register a parent once by branch and the student's full roster name; returns the six-digit code once
- **POST** `/api/student-reports/parent/authorize` - Verify branch, first name and parent access code; returns only that student's reports

After deploying frontend changes, deploy/restart the backend too so it includes `/api/student-reports/teacher/reports/bulk`. A `404` for that route means the running backend is outdated; HTML returned from an API request usually means the frontend API URL points to a web frontend rather than the backend service.

Set `STUDENT_REPORT_TEACHER_CODE` and `STUDENT_REPORT_SESSION_SECRET` in the backend environment before enabling teacher sign-in and parent code generation. The teacher code is shared by the instructors and is protected by a temporary failed-attempt lockout; because it is a shared credential, use it only in a controlled environment and prefer individual teacher accounts for production. Parent registration is limited to one code per roster student; the code is only displayed when first generated and cannot be retrieved later. A teacher must sign in to reset it, which invalidates the previous code. Never put these secrets in frontend environment variables.

Student roster profiles, reports, and parent-code hashes are stored in the dedicated `FlytoezStudentReports` DynamoDB table. Costume measurements continue to use the existing `CostumeMeasurements` table. The report roster is sourced from `CostumeMeasurements`; no JSON roster is used.

### Reports roster source

The single-table design stores student profiles, reports, parent-code hashes, and report metadata under composite `PK` and `SK` keys. `ClassIndex` loads a class roster, while `NameIndex` resolves a child's full roster name during parent registration. The table definition is in `dynamodb/student-reports-table.json`.

The teacher report roster now comes only from `CostumeMeasurements`. New costume-form submissions must include branch and group. Existing measurement entries without a group appear in the teacher page for explicit group assignment; after assignment, they are eligible for report creation. Student profiles and reports are retained in `FlytoezStudentReports` so historical reports remain linked to matching CostumeMeasurements students.

Report terms are free-form names entered by the teacher. Manual report-only student creation is disabled.

1. Make sure your AWS CLI is authenticated to the intended AWS account and region (`us-east-1`). For local development, use `AWS_PROFILE` or the standard AWS credential chain; do not put production credentials in source files.
2. Set `STUDENT_REPORTS_TABLE=FlytoezStudentReports` in `backend/.env` and ensure `AWS_REGION=us-east-1`.
3. If the reports table needs to be created, use the existing table migration:

  ```sh
  aws dynamodb create-table --cli-input-json file://dynamodb/student-reports-table.json --region us-east-1
  npm run migrate:student-reports
  ```

  Alternatively, let the migration create the table and its indexes: `npm run migrate:student-reports -- --create-table`. The command provisions/checks the table only; it does not import test roster data.
4. Verify in DynamoDB Console → Tables → `FlytoezStudentReports` → Explore items.
5. Grant the backend/App Runner instance role DynamoDB access to this table and its two indexes. The least-privilege policy template is `dynamodb/student-reports-app-runner-policy.json`; replace `ACCOUNT_ID` with the AWS account ID before attaching it. The existing DynamoDB initialization also needs `DescribeTable`/`CreateTable` only if you intend it to create the separate costume table at runtime.
6. Deploy the backend with `STUDENT_REPORTS_TABLE=FlytoezStudentReports` and restart it. App Runner should use its instance role. Keep `STUDENT_REPORT_SESSION_SECRET` stable across deploys because it signs teacher sessions and keys new parent-code hashes.

The AWS SDK document client and DynamoDB table-definition JSON are included in this repository. Student names, branches, and groups are read from CostumeMeasurements.

When loading a teacher roster, only students present in the selected CostumeMeasurements branch and group are returned. Existing report-only or archived JSON profiles are not shown unless they match a CostumeMeasurements record.

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


