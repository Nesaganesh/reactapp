# AWS Deployment Guide for Flytoez Dance Company

## Architecture Overview

- **Frontend (React)**: AWS Amplify Hosting
- **Backend (Express)**: AWS Elastic Beanstalk
- **Database**: MongoDB Atlas (Cloud)

---

## Part 1: Deploy Backend to AWS Elastic Beanstalk

### Prerequisites

1. **AWS Account**: Create one at https://aws.amazon.com
2. **AWS CLI**: Install the AWS CLI
   ```bash
   # macOS
   brew install awscli
   
   # Configure AWS credentials
   aws configure
   ```

3. **EB CLI**: Install Elastic Beanstalk CLI
   ```bash
   pip install awsebcli --upgrade --user
   ```

### Step 1: Prepare Backend for Deployment

1. **Create `.ebignore` file in backend folder:**
   ```
   node_modules/
   .env
   .DS_Store
   *.log
   ```

2. **Create `.npmrc` file (optional, for faster installs):**
   ```
   production=false
   ```

3. **Update package.json** (already correct):
   ```json
   {
     "scripts": {
       "start": "node server.js"
     }
   }
   ```

### Step 2: Initialize Elastic Beanstalk

```bash
cd backend

# Initialize EB application
eb init

# Follow the prompts:
# 1. Select your region (e.g., us-east-1)
# 2. Create new application: flytoez-backend
# 3. Select platform: Node.js
# 4. Select platform version: Node.js 18 (or latest)
# 5. Setup SSH: Yes (recommended)
```

### Step 3: Create Environment and Deploy

```bash
# Create environment and deploy
eb create flytoez-backend-prod --single

# This will:
# - Create an EC2 instance
# - Install Node.js
# - Deploy your application
# - Provide a URL (e.g., flytoez-backend-prod.us-east-1.elasticbeanstalk.com)
```

### Step 4: Configure Environment Variables

```bash
# Set environment variables
eb setenv MONGODB_URI="your-mongodb-atlas-connection-string" PORT=8080

# OR use AWS Console:
# 1. Go to Elastic Beanstalk console
# 2. Select your application
# 3. Configuration -> Software -> Environment properties
# 4. Add: MONGODB_URI, PORT
```

### Step 5: Deploy Updates

```bash
# After making code changes
eb deploy

# Check application status
eb status

# Open application in browser
eb open

# View logs
eb logs
```

### Step 6: Configure CORS for Frontend

Update your `server.js` to allow your Amplify frontend:

```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'https://your-amplify-app.amplifyapp.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

---

## Part 2: Deploy Frontend to AWS Amplify

### Option A: Deploy via AWS Amplify Console (Easiest)

1. **Go to AWS Amplify Console**: https://console.aws.amazon.com/amplify/

2. **Connect Repository:**
   - Click "New app" -> "Host web app"
   - Connect your GitHub/GitLab/Bitbucket repository
   - Select branch (e.g., main)

3. **Configure Build Settings:**
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

4. **Add Environment Variables** (in Amplify Console):
   - `REACT_APP_API_URL`: Your EB backend URL
   - Example: `https://flytoez-backend-prod.us-east-1.elasticbeanstalk.com`

5. **Deploy:** Click "Save and deploy"

### Option B: Deploy via Amplify CLI

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Initialize Amplify in your project root
cd /path/to/reactapp
amplify init

# Add hosting
amplify add hosting
# Choose: Hosting with Amplify Console (Managed hosting)

# Publish
amplify publish
```

### Update API Calls in React App

In your React components, use environment variables:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Example API call
fetch(`${API_URL}/api/costume-measurements`)
  .then(response => response.json())
  .then(data => console.log(data));
```

---

## Part 3: MongoDB Atlas Setup (Production)

1. **Create MongoDB Atlas Account**: https://www.mongodb.com/cloud/atlas

2. **Create Cluster:**
   - Free tier (M0) available
   - Select region close to your AWS region

3. **Network Access:**
   - Add IP: 0.0.0.0/0 (allow anywhere)
   - Or add specific Elastic Beanstalk IP ranges

4. **Database Access:**
   - Create database user with username/password
   - Grant read/write permissions

5. **Get Connection String:**
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/flytoez_dance?retryWrites=true&w=majority
   ```

6. **Add to EB Environment Variables** (see Step 4 above)

---

## Alternative Option: AWS App Runner (Containerized)

If you prefer containerization:

### Step 1: Create Dockerfile in backend folder

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
```

### Step 2: Deploy to App Runner

1. Go to AWS App Runner Console
2. Create service from source code
3. Connect GitHub repository
4. Configure:
   - Runtime: Node.js 18
   - Build command: `npm install`
   - Start command: `npm start`
   - Port: 8080
5. Add environment variables (MONGODB_URI)
6. Deploy

---

## Cost Estimates (Monthly)

### Elastic Beanstalk:
- Free tier: First 750 hours/month free (first 12 months)
- After: ~$15-30/month (t2.micro instance)

### AWS Amplify Hosting:
- Free tier: 1000 build minutes, 15GB served/month
- After: ~$0.01/build minute, ~$0.15/GB served

### MongoDB Atlas:
- Free tier: M0 cluster (512MB storage)
- After: Starting at $9/month (M10 cluster)

---

## Monitoring & Maintenance

### Elastic Beanstalk:

```bash
# View logs
eb logs

# SSH into instance
eb ssh

# Check health
eb health

# Scale up/down
eb scale 2  # Run 2 instances
```

### Amplify:

- View build logs in Amplify Console
- Set up custom domain
- Configure branch deployments

---

## Security Best Practices

1. **Environment Variables**: Never commit .env files
2. **HTTPS**: Enable in both Amplify and EB (automatic with Amplify)
3. **MongoDB**: Use connection string with credentials, whitelist IPs
4. **CORS**: Configure specific origins, not wildcard
5. **API Keys**: Store in AWS Secrets Manager if needed

---

## Troubleshooting

### Backend not responding:
```bash
eb logs
# Check for MongoDB connection errors
# Verify environment variables are set
```

### CORS errors:
- Update allowed origins in server.js
- Check Amplify app URL is in CORS whitelist

### MongoDB connection timeout:
- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure EB has internet access

---

## Useful Commands

```bash
# Elastic Beanstalk
eb deploy                 # Deploy latest code
eb logs                   # View application logs
eb health                 # Check health status
eb terminate              # Delete environment

# Amplify
amplify status           # Check current status
amplify publish          # Build and deploy
amplify console          # Open Amplify console
```

---

## Next Steps

1. ✅ Set up MongoDB Atlas
2. ✅ Deploy backend to Elastic Beanstalk
3. ✅ Deploy frontend to Amplify
4. ✅ Update API URLs in frontend
5. ✅ Test end-to-end functionality
6. ✅ Set up custom domain (optional)
7. ✅ Configure CI/CD pipeline

---

## Support Resources

- AWS Elastic Beanstalk: https://docs.aws.amazon.com/elasticbeanstalk/
- AWS Amplify: https://docs.amplify.aws/
- MongoDB Atlas: https://docs.atlas.mongodb.com/
