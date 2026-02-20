# AWS Deployment Checklist

## Pre-Deployment Setup

- [ ] Create AWS Account
- [ ] Install AWS CLI: `brew install awscli`
- [ ] Configure AWS credentials: `aws configure`
- [ ] Install EB CLI: `pip install awsebcli --upgrade --user`
- [ ] Create MongoDB Atlas account and cluster

## Backend Deployment (Elastic Beanstalk)

- [ ] Navigate to backend folder: `cd backend`
- [ ] Initialize EB: `eb init`
  - [ ] Choose region
  - [ ] Create app: flytoez-backend
  - [ ] Select Node.js platform
  - [ ] Setup SSH: Yes
- [ ] Create environment: `eb create flytoez-backend-prod --single`
- [ ] Set environment variables:
  ```bash
  eb setenv MONGODB_URI="your-connection-string" PORT=8080
  ```
- [ ] Test deployment: `eb open`
- [ ] Copy the EB URL (e.g., flytoez-backend-prod.us-east-1.elasticbeanstalk.com)

## Frontend Deployment (AWS Amplify)

### Option 1: Amplify Console (Recommended)
- [ ] Go to AWS Amplify Console
- [ ] Click "New app" → "Host web app"
- [ ] Connect your Git repository
- [ ] Select branch (main/master)
- [ ] Amplify will auto-detect build settings (amplify.yml)
- [ ] Add environment variable:
  - Key: `REACT_APP_API_URL`
  - Value: `https://your-backend-url.elasticbeanstalk.com` (from step above)
- [ ] Click "Save and deploy"
- [ ] Wait for build to complete
- [ ] Copy your Amplify app URL

### Option 2: Amplify CLI
- [ ] Install Amplify CLI: `npm install -g @aws-amplify/cli`
- [ ] Configure: `amplify configure`
- [ ] Initialize: `amplify init`
- [ ] Add hosting: `amplify add hosting`
- [ ] Publish: `amplify publish`

## Post-Deployment Configuration

- [ ] Update CORS in backend/server.js:
  - Add your Amplify URL to `allowedOrigins` array
  - Example: `'https://main.d1234abcd.amplifyapp.com'`
- [ ] Redeploy backend: `cd backend && eb deploy`
- [ ] Test the frontend application
- [ ] Verify API calls work correctly

## MongoDB Atlas Configuration

- [ ] Whitelist IP addresses in Network Access
- [ ] Create database user
- [ ] Get connection string
- [ ] Update EB environment variable with connection string

## Testing

- [ ] Test health endpoint: `https://your-backend.elasticbeanstalk.com/api/health`
- [ ] Test frontend loads: Open Amplify URL
- [ ] Test API integration: Submit a form or fetch data
- [ ] Check browser console for errors
- [ ] Verify CORS is working

## Optional: Custom Domain

### For Backend:
- [ ] Go to EB Console → Configuration → Load Balancer
- [ ] Add SSL certificate
- [ ] Update Route 53 or your DNS provider

### For Frontend:
- [ ] Go to Amplify Console → Domain management
- [ ] Add custom domain
- [ ] Follow DNS configuration steps

## Monitoring & Maintenance

- [ ] Set up CloudWatch alarms for EB environment
- [ ] Enable Amplify build notifications
- [ ] Check logs regularly: `eb logs`
- [ ] Monitor MongoDB Atlas metrics
- [ ] Set up backup strategy for database

## Troubleshooting Commands

```bash
# Backend (Elastic Beanstalk)
eb status                  # Check status
eb logs                    # View logs
eb health                  # Check health
eb ssh                     # SSH into instance
eb deploy                  # Deploy updates

# Frontend (Amplify Console)
# View logs in AWS Console → Amplify → Your App → Build logs

# MongoDB
# View logs in Atlas Console → Metrics
```

## URLs to Save

- [ ] Backend API URL: ____________________________________
- [ ] Frontend URL: ____________________________________
- [ ] MongoDB Atlas URL: ____________________________________
- [ ] AWS Console: https://console.aws.amazon.com

## Costs to Monitor

- Elastic Beanstalk: ~$15-30/month (after free tier)
- Amplify Hosting: ~$0-5/month (depends on traffic)
- MongoDB Atlas: Free (M0 tier) or $9+/month

---

**Need Help?** Refer to [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
