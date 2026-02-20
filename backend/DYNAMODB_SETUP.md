# AWS DynamoDB Setup Guide - Step by Step

DynamoDB is AWS's fully managed NoSQL database service. It's serverless, scalable, and integrates perfectly with AWS App Runner.

---

## Benefits of Using DynamoDB

- ✅ **Serverless:** No servers to manage
- ✅ **AWS Native:** Perfect integration with App Runner, Amplify
- ✅ **Free Tier:** 25GB storage + 25 read/write capacity units
- ✅ **Fast:** Single-digit millisecond latency
- ✅ **Auto-scaling:** Scales automatically with traffic
- ✅ **No Connection Strings:** Uses IAM roles (more secure)

---

## Step 1: Create DynamoDB Table via AWS Console

### 1.1 Go to DynamoDB Console
👉 https://console.aws.amazon.com/dynamodbv2/

### 1.2 Create Table

1. Click **"Create table"** button

2. **Table name:** `CostumeMeasurements`

3. **Partition key (Primary key):**
   - Name: `id`
   - Type: **String**

4. **Table settings:** 
   - Choose **"Default settings"** (recommended)
   - This enables auto-scaling and uses on-demand billing

5. Click **"Create table"**

6. ⏳ Wait 30 seconds for table to be created

7. ✅ Table status should show **"Active"**

---

## Step 2: Get AWS Credentials

You have **two options** for authentication:

### Option A: IAM Role (Recommended for App Runner) ✅

**Best for production** - No credentials needed, uses App Runner's IAM role.

When deploying to App Runner, it will automatically use its IAM role to access DynamoDB.

**Setup (during App Runner deployment):**
1. App Runner creates a service role automatically
2. We'll attach DynamoDB permissions to it
3. No credentials in code!

### Option B: Access Keys (For Local Development)

**For testing locally** - Get AWS credentials:

1. Go to **IAM Console:** https://console.aws.amazon.com/iam/

2. Click **"Users"** in left sidebar

3. Click your username (or create a new user):
   - Click **"Create user"**
   - Username: `flytoez-backend-dev`
   - Click **"Next"**

4. **Set permissions:**
   - Click **"Attach policies directly"**
   - Search and select: **"AmazonDynamoDBFullAccess"**
   - Click **"Next"** then **"Create user"**

5. **Create access key:**
   - Click on the user you just created
   - Go to **"Security credentials"** tab
   - Click **"Create access key"**
   - Choose **"Application running outside AWS"**
   - Click **"Next"** → **"Create access key"**

6. **⚠️ SAVE THESE CREDENTIALS:**
   ```
   Access Key ID: AKIAIOSFODNN7EXAMPLE
   Secret Access Key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   ```

7. **⚠️ Download CSV** or copy them immediately (you won't see them again)

---

## Step 3: Configure IAM Permissions for App Runner

### 3.1 Create IAM Policy for DynamoDB Access

1. Go to **IAM Console:** https://console.aws.amazon.com/iam/

2. Click **"Policies"** in left sidebar

3. Click **"Create policy"**

4. Click **"JSON"** tab and paste:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:Scan",
                "dynamodb:Query",
                "dynamodb:BatchGetItem",
                "dynamodb:BatchWriteItem"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/CostumeMeasurements"
        }
    ]
}
```

5. Click **"Next"**

6. **Policy name:** `FlytoesDynamoDBAccess`

7. **Description:** `Allows access to CostumeMeasurements DynamoDB table`

8. Click **"Create policy"**

### 3.2 Attach Policy to App Runner Role (After Deployment)

**After creating your App Runner service** (Step 4), you'll attach this policy:

1. Go to **IAM Console** → **Roles**

2. Find role named: `AppRunnerInstanceRole-[random-string]`
   - Or search: `AppRunner`

3. Click on the role

4. Click **"Add permissions"** → **"Attach policies"**

5. Search for: `FlytoesDynamoDBAccess`

6. Check the box and click **"Attach policies"**

---

## Step 4: Update Backend Code for DynamoDB

All the code changes have been prepared for you! The backend now uses AWS SDK for DynamoDB instead of MongoDB.

### Updated Files:
- ✅ `backend/package.json` - Added AWS SDK
- ✅ `backend/server.js` - Updated for DynamoDB
- ✅ `backend/config/dynamodb.js` - DynamoDB client setup
- ✅ `backend/models/CostumeMeasurement.dynamodb.js` - DynamoDB model
- ✅ `backend/routes/costumeMeasurements.dynamodb.js` - DynamoDB routes
- ✅ `backend/.env.example` - Updated for AWS credentials

---

## Step 5: Local Development Setup

### 5.1 Install Dependencies

```bash
cd backend
npm install
```

This installs the AWS SDK v3 packages.

### 5.2 Configure Environment Variables

Create `backend/.env`:

```bash
# AWS Credentials (for local development only)
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-1

# DynamoDB Table Name
DYNAMODB_TABLE=CostumeMeasurements

# Server Configuration
PORT=5000
NODE_ENV=development
```

**⚠️ Replace with your actual AWS credentials from Step 2**

### 5.3 Test Locally

```bash
cd backend
npm start
```

You should see:
```
✅ DynamoDB client configured for region: us-east-1
🚀 Server is running on port 5000
```

### 5.4 Test API Endpoint

```bash
# Health check
curl http://localhost:5000/api/health

# Test POST (create measurement)
curl -X POST http://localhost:5000/api/costume-measurements \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "Test Student",
    "height": "5.6",
    "chest": "34",
    "waist": "28",
    "hip": "36"
  }'

# Test GET (retrieve all measurements)
curl http://localhost:5000/api/costume-measurements
```

---

## Step 6: Deploy to AWS App Runner

### 6.1 Create App Runner Service

1. Go to **App Runner Console:** https://console.aws.amazon.com/apprunner/

2. Click **"Create service"**

3. **Source:**
   - Repository type: **Source code repository**
   - Connect GitHub
   - Select your repository and branch

4. **Build configuration:**
   - Runtime: **Node.js 18**
   - Build command: `npm install`
   - Start command: `npm start`
   - Port: `8080`

5. **Service settings:**
   - Service name: `flytoez-backend`
   - Port: `8080`

6. **Environment variables:**
   
   **Important:** Only add these (NO AWS credentials needed!):
   
   ```
   AWS_REGION = us-east-1
   DYNAMODB_TABLE = CostumeMeasurements
   PORT = 8080
   NODE_ENV = production
   ```
   
   **Do NOT add AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY** in App Runner!
   App Runner uses IAM roles automatically.

7. **Instance configuration:**
   - CPU: 1 vCPU
   - Memory: 2 GB

8. **Health check:**
   - Protocol: HTTP
   - Path: `/api/health`

9. Click **"Next"** → **"Create & deploy"**

10. ⏳ Wait 5-10 minutes

### 6.2 Configure IAM Role

**After deployment completes:**

1. Go to your App Runner service page

2. Click **"Configuration"** tab

3. Under **"Security"**, note the **Instance role** name
   - Example: `AppRunnerInstanceRole-abc123`

4. Click on the role name (opens IAM console)

5. Click **"Add permissions"** → **"Attach policies"**

6. Search for: `FlytoesDynamoDBAccess` (created in Step 3)

7. Check the box and click **"Attach policies"**

8. **Redeploy App Runner:**
   - Go back to App Runner console
   - Click **"Deploy"** → **"Start deployment"**
   - Wait 2-3 minutes

### 6.3 Get App Runner URL

Copy your App Runner URL:
```
https://xxxxx.us-east-1.awsapprunner.com
```

### 6.4 Test Production API

```bash
# Replace with your App Runner URL
curl https://xxxxx.us-east-1.awsapprunner.com/api/health

# Test creating a measurement
curl -X POST https://xxxxx.us-east-1.awsapprunner.com/api/costume-measurements \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "Production Test",
    "height": "5.8",
    "chest": "36",
    "waist": "30"
  }'
```

---

## Step 7: View Data in DynamoDB Console

1. Go to **DynamoDB Console:** https://console.aws.amazon.com/dynamodbv2/

2. Click **"Tables"** → **"CostumeMeasurements"**

3. Click **"Explore table items"**

4. You should see your data!

5. You can:
   - View items
   - Search/filter
   - Edit items manually
   - Delete items
   - Export data

---

## Step 8: Deploy Frontend to Amplify

Same as before, but with your App Runner URL:

1. Go to **Amplify Console:** https://console.aws.amazon.com/amplify/

2. **Create app** → Connect GitHub

3. **Environment variable:**
   ```
   REACT_APP_API_URL = https://your-apprunner-url.awsapprunner.com
   ```

4. **Deploy**

5. **Update CORS** in `backend/server.js` with Amplify URL

6. Push to GitHub (auto-deploys)

---

## DynamoDB vs MongoDB - Key Differences

### Data Structure

**MongoDB (Document):**
```javascript
{
  _id: ObjectId("..."),
  studentName: "John",
  height: "5.8"
}
```

**DynamoDB (Key-Value):**
```javascript
{
  id: "uuid-string",
  studentName: "John",
  height: "5.8",
  createdAt: "2026-02-20T10:30:00Z"
}
```

### Queries

**MongoDB:**
```javascript
await Model.find({ studentName: "John" })
```

**DynamoDB:**
```javascript
await docClient.scan({
  TableName: 'CostumeMeasurements',
  FilterExpression: 'studentName = :name',
  ExpressionAttributeValues: { ':name': 'John' }
})
```

### No Schema Required

Both are NoSQL, but DynamoDB is even more flexible - no need to define schemas.

---

## Pricing

### DynamoDB Free Tier (Permanent)

- ✅ **25 GB** of storage
- ✅ **25 read capacity units** (RCU)
- ✅ **25 write capacity units** (WCU)
- ✅ **2.5 million stream read requests** per month

**What this means:**
- ~200 million requests per month (FREE!)
- Perfect for small to medium apps
- Free tier never expires

### Beyond Free Tier (On-Demand Pricing)

- **Reads:** $0.25 per million requests
- **Writes:** $1.25 per million requests
- **Storage:** $0.25 per GB per month

**Example costs:**
- 1 million reads + 500k writes = ~$0.88/month
- Much cheaper than MongoDB Atlas paid tier ($9/month)

---

## Monitoring & Management

### CloudWatch Metrics (Automatic)

1. Go to DynamoDB Console → Your table
2. Click **"Metrics"** tab
3. View:
   - Read/Write capacity
   - Throttled requests
   - System errors
   - Item count
   - Table size

### CloudWatch Alarms

Set up alerts for:
- High read/write usage
- Throttled requests
- Error rates

### Backup

**Enable Point-in-Time Recovery (PITR):**

1. Go to your DynamoDB table
2. Click **"Backups"** tab
3. Enable **"Point-in-time recovery"**
4. Allows restore to any point in last 35 days
5. Cost: Storage snapshot cost (~$0.20/GB/month)

**On-Demand Backups (Free):**

1. Click **"Backups"** tab
2. Click **"Create backup"**
3. Name it and create
4. Free (pay only for storage)

---

## Advanced Features

### Global Tables (Multi-Region)

Deploy your table to multiple regions for global access:
- Automatic replication
- Local read/write in each region
- 99.999% availability SLA

### DynamoDB Streams

Capture changes to your table:
- Trigger Lambda functions
- Real-time data processing
- Audit logs

### Secondary Indexes

Query data by different attributes:
- Global Secondary Index (GSI)
- Local Secondary Index (LSI)
- Improve query performance

---

## Troubleshooting

### Error: ResourceNotFoundException

**Issue:** Table doesn't exist

**Solution:**
- Verify table name is correct: `CostumeMeasurements`
- Check region matches (e.g., `us-east-1`)
- Ensure table is created in AWS Console

### Error: AccessDeniedException

**Issue:** No permission to access DynamoDB

**Solution:**
- **Local:** Check AWS credentials in `.env`
- **App Runner:** Verify IAM policy is attached to instance role
- Confirm policy has correct table ARN

### Error: ValidationException

**Issue:** Missing required fields

**Solution:**
- Ensure `id` is provided (auto-generated in code)
- Check data types match schema
- Verify request body format

### Slow Queries

**Solution:**
- Use `query` instead of `scan` when possible
- Create secondary indexes
- Enable DynamoDB Accelerator (DAX) for caching

---

## Best Practices

### 1. Use UUID for Primary Keys

```javascript
const { v4: uuidv4 } = require('uuid');
const id = uuidv4(); // Guaranteed unique
```

### 2. Add Timestamps

Always include:
```javascript
{
  id: "uuid",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}
```

### 3. Use Batch Operations

For multiple items:
```javascript
// Instead of multiple PutItem calls
docClient.batchWrite({
  RequestItems: {
    'CostumeMeasurements': [
      { PutRequest: { Item: item1 } },
      { PutRequest: { Item: item2 } }
    ]
  }
})
```

### 4. Implement Pagination

For large result sets:
```javascript
let lastEvaluatedKey = null;
do {
  const result = await docClient.scan({
    TableName: 'CostumeMeasurements',
    ExclusiveStartKey: lastEvaluatedKey
  });
  lastEvaluatedKey = result.LastEvaluatedKey;
} while (lastEvaluatedKey);
```

### 5. Use IAM Roles (Not Access Keys)

In production:
- ✅ App Runner IAM role
- ✅ Lambda execution role
- ❌ Never hardcode credentials

---

## Migration from MongoDB

If you have existing MongoDB data:

### Export from MongoDB

```bash
mongoexport --uri="mongodb+srv://..." --collection=measurements --out=data.json
```

### Import to DynamoDB

Use AWS CLI or a script to import JSON data:

```bash
aws dynamodb batch-write-item --request-items file://import.json
```

Or use AWS Data Pipeline for large datasets.

---

## Quick Commands Reference

### AWS CLI - DynamoDB Commands

```bash
# List tables
aws dynamodb list-tables

# Describe table
aws dynamodb describe-table --table-name CostumeMeasurements

# Scan all items
aws dynamodb scan --table-name CostumeMeasurements

# Put item
aws dynamodb put-item \
  --table-name CostumeMeasurements \
  --item '{"id": {"S": "test-123"}, "studentName": {"S": "Test"}}'

# Get item
aws dynamodb get-item \
  --table-name CostumeMeasurements \
  --key '{"id": {"S": "test-123"}}'

# Delete item
aws dynamodb delete-item \
  --table-name CostumeMeasurements \
  --key '{"id": {"S": "test-123"}}'
```

---

## Resources

- **DynamoDB Documentation:** https://docs.aws.amazon.com/dynamodb/
- **AWS SDK for JavaScript v3:** https://docs.aws.amazon.com/sdk-for-javascript/v3/
- **DynamoDB Best Practices:** https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html
- **Pricing Calculator:** https://calculator.aws/

---

## Summary Checklist

- [ ] AWS account created
- [ ] DynamoDB table `CostumeMeasurements` created
- [ ] IAM policy `FlytoesDynamoDBAccess` created
- [ ] AWS credentials obtained (for local dev)
- [ ] Backend code updated for DynamoDB
- [ ] Local testing successful
- [ ] App Runner service deployed
- [ ] IAM role attached to App Runner
- [ ] App Runner redeployed
- [ ] Production API tested
- [ ] Frontend deployed to Amplify
- [ ] CORS updated with Amplify URL

---

**🎉 Congratulations!** Your app now uses DynamoDB with AWS App Runner!

**Benefits:**
- ✅ No connection strings to manage
- ✅ Better AWS integration
- ✅ Generous free tier
- ✅ Auto-scaling
- ✅ Serverless (no server management)
