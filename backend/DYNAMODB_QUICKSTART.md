# DynamoDB Quick Start Checklist

## ✅ Prerequisites
- [ ] AWS Account created
- [ ] AWS CLI installed and configured (for local dev)

---

## 📋 Step 1: Create DynamoDB Table

1. **Go to DynamoDB Console**  
   👉 https://console.aws.amazon.com/dynamodbv2/

2. **Create Table:**
   - Click **"Create table"**
   - **Table name:** `CostumeMeasurements`
   - **Partition key:** `id` (String)
   - **Table settings:** Default settings
   - Click **"Create table"**
   - ⏳ Wait 30 seconds
   - ✅ Status: Active

---

## 🔑 Step 2: Get AWS Credentials (Local Development)

### Option A: Use AWS CLI

```bash
# Install AWS CLI
brew install awscli

# Configure credentials
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)
```

### Option B: Create IAM User

1. Go to IAM Console: https://console.aws.amazon.com/iam/
2. Create user: `flytoez-backend-dev`
3. Attach policy: **AmazonDynamoDBFullAccess**
4. Create access key
5. **⚠️ Save credentials!**

---

## 🔧 Step 3: Switch Backend to DynamoDB

### Update Files:

```bash
cd backend

# Backup current server.js (MongoDB version)
cp server.js server.mongodb.js

# Use DynamoDB version
cp server.dynamodb.js server.js
```

### Or manually update server.js:
- Replace MongoDB connection with DynamoDB config
- Use `routes/costumeMeasurements.dynamodb.js`

---

## ⚙️ Step 4: Configure Environment

Create `backend/.env`:

```bash
cd backend

cat > .env << 'EOF'
# AWS Credentials (get from Step 2)
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1

# DynamoDB Table
DYNAMODB_TABLE=CostumeMeasurements

# Server Config
PORT=5000
NODE_ENV=development
EOF
```

**⚠️ Replace with your actual AWS credentials!**

---

## 📦 Step 5: Install Dependencies

```bash
cd backend
npm install
```

This installs:
- `@aws-sdk/client-dynamodb`
- `@aws-sdk/lib-dynamodb`
- `uuid`

---

## 🚀 Step 6: Test Locally

```bash
cd backend
npm start
```

**Expected output:**
```
✅ DynamoDB client configured for region: us-east-1
📊 Using DynamoDB in region: us-east-1
📋 Table name: CostumeMeasurements
🚀 Server is running on port 5000
🌍 Environment: development
📊 Database: DynamoDB
```

### Test Endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Create measurement
curl -X POST http://localhost:5000/api/costume-measurements \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "Test Student",
    "height": "5.6",
    "chest": "34",
    "waist": "28"
  }'

# Get all measurements
curl http://localhost:5000/api/costume-measurements
```

---

## ☁️ Step 7: Create IAM Policy for App Runner

1. Go to IAM Console → Policies
2. Click **"Create policy"**
3. JSON tab, paste:

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
                "dynamodb:Query"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/CostumeMeasurements"
        }
    ]
}
```

4. Name: `FlytoesDynamoDBAccess`
5. Click **"Create policy"**

---

## 🚀 Step 8: Deploy to App Runner

1. **Go to App Runner:**  
   👉 https://console.aws.amazon.com/apprunner/

2. **Create Service:**
   - Source: GitHub repository
   - Select repo and branch

3. **Build:**
   - Runtime: Node.js 18
   - Build: `npm install`
   - Start: `npm start`
   - Port: `8080`

4. **Environment Variables:**
   ```
   AWS_REGION = us-east-1
   DYNAMODB_TABLE = CostumeMeasurements
   PORT = 8080
   NODE_ENV = production
   ```
   
   **⚠️ Do NOT add AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY!**

5. **Health check:** `/api/health`

6. Click **"Create & deploy"**

7. ⏳ Wait 5-10 minutes

---

## 🔐 Step 9: Attach IAM Policy

1. Go to App Runner service → Configuration tab
2. Note **Instance role** name
3. Go to IAM Console → Roles
4. Find the role (e.g., `AppRunnerInstanceRole-abc123`)
5. Click **"Attach policies"**
6. Search: `FlytoesDynamoDBAccess`
7. Attach it
8. **Go back to App Runner**
9. Click **"Deploy"** → **"Start deployment"**
10. ⏳ Wait 2-3 minutes

---

## ✅ Step 10: Test Production

```bash
# Replace with your App Runner URL
APP_URL="https://xxxxx.us-east-1.awsapprunner.com"

# Health check
curl $APP_URL/api/health

# Create measurement
curl -X POST $APP_URL/api/costume-measurements \
  -H "Content-Type: application/json" \
  -d '{"studentName": "Production Test", "height": "5.8"}'

# Get all measurements
curl $APP_URL/api/costume-measurements
```

---

## 🎨 Step 11: Deploy Frontend (Same as Before)

1. Go to Amplify Console
2. Connect GitHub
3. Add environment variable:
   ```
   REACT_APP_API_URL = https://your-apprunner-url.awsapprunner.com
   ```
4. Deploy
5. Update CORS in backend with Amplify URL
6. Push to GitHub

---

## 🔍 View Data in DynamoDB

1. Go to DynamoDB Console
2. Tables → **CostumeMeasurements**
3. **"Explore table items"**
4. See your data!

---

## 🐛 Troubleshooting

### ResourceNotFoundException
- ✅ Verify table name: `CostumeMeasurements`
- ✅ Check region matches
- ✅ Confirm table exists in console

### AccessDeniedException
- ✅ Local: Check AWS credentials in `.env`
- ✅ App Runner: Verify IAM policy attached
- ✅ Redeploy after attaching policy

### Cannot find module '@aws-sdk/...'
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

## 💰 Cost (Free Tier)

- **DynamoDB:** 25GB + 200M requests/month FREE
- **App Runner:** ~$10-30/month
- **Amplify:** ~$0-5/month
- **Total:** ~$10-35/month

---

## 📊 Files Changed

- ✅ `package.json` - Added AWS SDK
- ✅ `config/dynamodb.js` - DynamoDB client
- ✅ `models/CostumeMeasurement.dynamodb.js` - DynamoDB model
- ✅ `routes/costumeMeasurements.dynamodb.js` - DynamoDB routes
- ✅ `server.dynamodb.js` - DynamoDB server
- ✅ `.env.example` - Updated for AWS

---

## 🎉 Success Checklist

- [ ] DynamoDB table created
- [ ] IAM policy created
- [ ] Local testing works
- [ ] App Runner deployed
- [ ] IAM policy attached
- [ ] App Runner redeployed
- [ ] Production API works
- [ ] Frontend deployed
- [ ] CORS updated
- [ ] End-to-end testing complete

---

**📚 Need more details?** See [DYNAMODB_SETUP.md](./DYNAMODB_SETUP.md)

**🆘 Issues?** Check troubleshooting section above or AWS documentation
