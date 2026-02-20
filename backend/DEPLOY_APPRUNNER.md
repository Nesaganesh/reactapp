# Deploy Backend to AWS App Runner - Step by Step Guide

AWS App Runner is a fully managed container service that makes it easy to deploy your Express backend without managing infrastructure.

## Prerequisites

✅ AWS Account (create at https://aws.amazon.com)
✅ MongoDB Atlas account and connection string (see backend/README.md)
✅ Git repository (GitHub recommended)

---

## Step 1: Prepare Your Backend Code

### 1.1 Verify Files Exist

Your backend folder should have:
- ✅ `Dockerfile` (already created)
- ✅ `server.js`
- ✅ `package.json`
- ✅ `.dockerignore`

### 1.2 Test Docker Build Locally (Optional but Recommended)

```bash
cd backend

# Build the Docker image
docker build -t flytoez-backend .

# Run it locally to test
docker run -p 8080:8080 \
  -e MONGODB_URI="your-mongodb-connection-string" \
  -e PORT=8080 \
  flytoez-backend

# Test in browser: http://localhost:8080/api/health
# If works, press Ctrl+C to stop
```

### 1.3 Push Code to Git Repository

```bash
# From your reactapp directory
git add .
git commit -m "Prepare backend for AWS App Runner deployment"
git push origin main
```

---

## Step 2: Deploy to AWS App Runner

### Option A: Using AWS Console (Easiest - Recommended)

#### 2.1 Go to AWS App Runner Console

Open: https://console.aws.amazon.com/apprunner/

#### 2.2 Create a New Service

1. Click **"Create service"**

#### 2.3 Configure Source

**Repository type:** Select **"Source code repository"**

1. Click **"Add new"** to connect your GitHub account
2. Follow the OAuth flow to authorize AWS App Runner
3. Select your **repository** and **branch** (e.g., `main`)
4. **Deployment trigger:** Select **"Automatic"** (deploys on every push)

#### 2.4 Configure Build Settings

1. **Configuration:** Select **"Use a configuration file"** or **"Configure all settings here"**

2. If **"Configure all settings here"**:
   - **Runtime:** Select **"Nodejs 18"** or **"Nodejs 20"**
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Port:** `8080`

3. If **"Use a configuration file"**, App Runner will use `apprunner.yaml` (see Step 3)

#### 2.5 Configure Service

1. **Service name:** `flytoez-backend`
2. **Port:** `8080`
3. **Environment variables:** Click **"Add environment variable"**
   
   Add these:
   ```
   Key: MONGODB_URI
   Value: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/flytoez_dance?retryWrites=true&w=majority
   
   Key: PORT
   Value: 8080
   
   Key: NODE_ENV
   Value: production
   ```

#### 2.6 Configure Service Settings

1. **CPU & Memory:** 
   - CPU: **1 vCPU** (default)
   - Memory: **2 GB** (default)
   - Leave auto scaling as default (1-25 instances)

2. **Health check:** 
   - Protocol: **HTTP**
   - Path: `/api/health`
   - Interval: **10 seconds**
   - Timeout: **5 seconds**
   - Healthy threshold: **1**
   - Unhealthy threshold: **5**

#### 2.7 Configure Security (Optional)

- **Instance role:** Leave default or create custom if needed
- **VPC connector:** Not needed for MongoDB Atlas

#### 2.8 Review and Create

1. Review all settings
2. Click **"Create & deploy"**
3. Wait 5-10 minutes for deployment

#### 2.9 Get Your Backend URL

Once deployed, you'll see:
- **Status:** Running ✅
- **Default domain:** `https://xxxxx.us-east-1.awsapprunner.com`

**Copy this URL** - you'll need it for frontend configuration.

#### 2.10 Test Your Backend

```bash
# Replace with your App Runner URL
curl https://xxxxx.us-east-1.awsapprunner.com/api/health

# Should return:
# {"status":"Server is running","timestamp":"..."}
```

---

### Option B: Using AWS CLI (Advanced)

#### 2.1 Install AWS CLI

```bash
# macOS
brew install awscli

# Configure credentials
aws configure
# Enter: Access Key ID, Secret Access Key, Region (e.g., us-east-1)
```

#### 2.2 Create App Runner Service

```bash
cd backend

# Create service configuration file
cat > apprunner-config.json << 'EOF'
{
  "ServiceName": "flytoez-backend",
  "SourceConfiguration": {
    "ImageRepository": {
      "ImageIdentifier": "flytoez-backend",
      "ImageRepositoryType": "ECR_PUBLIC",
      "ImageConfiguration": {
        "Port": "8080",
        "RuntimeEnvironmentVariables": {
          "PORT": "8080",
          "NODE_ENV": "production",
          "MONGODB_URI": "YOUR_MONGODB_CONNECTION_STRING"
        }
      }
    },
    "AutoDeploymentsEnabled": true
  },
  "InstanceConfiguration": {
    "Cpu": "1 vCPU",
    "Memory": "2 GB"
  },
  "HealthCheckConfiguration": {
    "Protocol": "HTTP",
    "Path": "/api/health",
    "Interval": 10,
    "Timeout": 5,
    "HealthyThreshold": 1,
    "UnhealthyThreshold": 5
  }
}
EOF

# Deploy
aws apprunner create-service --cli-input-json file://apprunner-config.json
```

---

## Step 3: Create Configuration File (Optional)

Create `apprunner.yaml` in your **backend** folder for version-controlled configuration:

```yaml
version: 1.0
runtime: nodejs18
build:
  commands:
    build:
      - npm install
run:
  command: npm start
  network:
    port: 8080
    env:
      - name: NODE_ENV
        value: production
```

Then select **"Use a configuration file"** in console setup.

---

## Step 4: Configure CORS for Frontend

Your backend is already configured with CORS. After deployment:

1. **Get your App Runner URL** (e.g., `https://xxxxx.us-east-1.awsapprunner.com`)

2. You'll add your Amplify frontend URL to CORS after deploying frontend in Step 5

---

## Step 5: Deploy Frontend to AWS Amplify

### 5.1 Go to AWS Amplify Console

Open: https://console.aws.amazon.com/amplify/

### 5.2 Create New App

1. Click **"New app"** → **"Host web app"**
2. Select **"GitHub"** (or your Git provider)
3. Authorize AWS Amplify to access your repository
4. Select your repository and branch

### 5.3 Configure Build Settings

Amplify will auto-detect `amplify.yml`. Review and confirm:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### 5.4 Add Environment Variables

In **"Environment variables"** section, add:

```
Key: REACT_APP_API_URL
Value: https://xxxxx.us-east-1.awsapprunner.com
(Use your App Runner URL from Step 2.9)
```

### 5.5 Save and Deploy

1. Click **"Save and deploy"**
2. Wait 5-10 minutes for build
3. Once complete, you'll get your Amplify URL (e.g., `https://main.d123abc456.amplifyapp.com`)

### 5.6 Update CORS in Backend

1. Copy your Amplify URL
2. Update `backend/server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://main.d123abc456.amplifyapp.com', // Add your Amplify URL
  'https://your-custom-domain.com' // If you have custom domain
];
```

3. Commit and push:

```bash
git add backend/server.js
git commit -m "Update CORS with Amplify URL"
git push origin main
```

4. App Runner will **automatically redeploy** (if you enabled auto-deploy)

---

## Step 6: Update React App to Use Environment Variables

Make sure your React components use the environment variable:

**Example in your components:**

```javascript
// This will use your .env.production value in production
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Example: Fetch costume measurements
fetch(`${API_URL}/api/costume-measurements`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

## Step 7: Test Everything

### 7.1 Test Backend Health

```bash
curl https://your-apprunner-url.awsapprunner.com/api/health
```

### 7.2 Test Frontend

1. Open your Amplify URL in browser
2. Open browser DevTools (F12) → Console
3. Perform actions that call your API
4. Verify no CORS errors
5. Check Network tab to see API calls succeeding

### 7.3 Test API Endpoints

```bash
# Test POST endpoint (example)
curl -X POST https://your-apprunner-url.awsapprunner.com/api/costume-measurements \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "Test Student",
    "height": "5.6",
    "chest": "34",
    "waist": "28"
  }'

# Test GET endpoint
curl https://your-apprunner-url.awsapprunner.com/api/costume-measurements
```

---

## Step 8: Manage Your Deployment

### View Logs

1. Go to App Runner Console
2. Select your service
3. Click **"Logs"** tab
4. View **application logs** and **deployment logs**

### Update Environment Variables

1. Go to App Runner Console
2. Select your service
3. Click **"Configuration"** tab
4. Edit environment variables
5. Click **"Deploy"** to apply changes

### Manual Redeploy

1. Go to App Runner Console
2. Select your service
3. Click **"Deploy"** button
4. Select **"Start deployment"**

### Monitor Performance

1. Click **"Metrics"** tab
2. View:
   - Requests
   - Response time
   - 2xx, 4xx, 5xx responses
   - CPU and memory usage
   - Active instances

### Pause/Resume Service

```bash
# Pause (stops charging)
aws apprunner pause-service --service-arn "your-service-arn"

# Resume
aws apprunner resume-service --service-arn "your-service-arn"
```

### Delete Service

```bash
aws apprunner delete-service --service-arn "your-service-arn"
```

---

## Pricing

### AWS App Runner Costs

**Compute:**
- $0.064/vCPU-hour + $0.007/GB-hour
- Example: 1 vCPU + 2GB running 24/7 = ~$48/month

**With auto-scaling (minimal traffic):**
- When no traffic → scales to 0 instances (after cooldown)
- Pay only for active time
- Estimated: $10-30/month for low traffic

**Provisioned instances (always-on):**
- Set min instances = 1 for faster response
- ~$48-60/month

**Requests:**
- $0.064 per million requests
- First 1M requests free (for low traffic sites)

### AWS Amplify Hosting Costs

- **Free tier:** 1,000 build minutes, 15GB served/month
- **After:** $0.01/build minute, $0.15/GB served
- **Typical:** $0-10/month for small apps

### MongoDB Atlas

- **Free tier:** M0 cluster (512MB)
- **Paid:** Starting at $9/month (M10)

### Total Estimated Cost

- **Development/Low Traffic:** $10-20/month
- **Production/Active User Base:** $50-80/month

---

## Troubleshooting

### Deployment Failed

**Check logs:**
1. Go to App Runner console
2. Click **"Logs"** → **"Deployment logs"**
3. Look for build errors

**Common issues:**
- Missing dependencies in package.json
- Wrong Node version
- Port not set to 8080

### App Not Starting

**Check application logs:**
1. Look for MongoDB connection errors
2. Verify `MONGODB_URI` is correct
3. Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)

### CORS Errors

1. Verify Amplify URL is in `allowedOrigins` array
2. Redeploy backend after updating CORS
3. Clear browser cache

### Health Check Failing

1. Verify `/api/health` endpoint works:
   ```bash
   curl https://your-url.awsapprunner.com/api/health
   ```
2. Check health check configuration in App Runner
3. Ensure port 8080 is correct

### High Response Time

1. Check MongoDB Atlas performance
2. Verify database queries are optimized
3. Consider increasing CPU/memory in App Runner
4. Enable performance monitoring

---

## Quick Commands Reference

```bash
# Test backend locally with Docker
docker build -t flytoez-backend backend/
docker run -p 8080:8080 -e MONGODB_URI="connection-string" flytoez-backend

# View App Runner services
aws apprunner list-services

# Describe service
aws apprunner describe-service --service-arn "arn:..."

# Start deployment
aws apprunner start-deployment --service-arn "arn:..."

# View logs (use CloudWatch)
aws logs tail "/aws/apprunner/flytoez-backend/application" --follow

# Update environment variables
aws apprunner update-service --service-arn "arn:..." \
  --source-configuration "RuntimeEnvironmentVariables={MONGODB_URI=new-value}"
```

---

## Next Steps After Deployment

- ✅ Set up custom domain (optional)
- ✅ Configure SSL certificate (automatic with App Runner)
- ✅ Set up CloudWatch alarms
- ✅ Create backup strategy for MongoDB
- ✅ Set up CI/CD pipeline
- ✅ Monitor application performance
- ✅ Configure auto-scaling rules

---

## Support Resources

- **AWS App Runner Docs:** https://docs.aws.amazon.com/apprunner/
- **AWS Amplify Docs:** https://docs.amplify.aws/
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
- **AWS Support:** https://console.aws.amazon.com/support/

---

## Summary

✅ Backend (Express) → **AWS App Runner** (containerized, auto-scaling)
✅ Frontend (React) → **AWS Amplify** (Git-based, auto-deploy)
✅ Database (MongoDB) → **MongoDB Atlas** (cloud-hosted)

**Estimated setup time:** 30-45 minutes
**Monthly cost (low traffic):** $10-30
**Deployment method:** Push to git = automatic deployment 🚀
