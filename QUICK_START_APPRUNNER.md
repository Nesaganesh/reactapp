# AWS App Runner Deployment - Quick Start Checklist

## 📋 Pre-Deployment

- [ ] AWS Account created
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string obtained
- [ ] Code pushed to GitHub (or GitLab/Bitbucket)

---

## 🚀 Deploy Backend to AWS App Runner

### Step 1: Go to AWS App Runner Console
👉 https://console.aws.amazon.com/apprunner/

### Step 2: Create Service

- [ ] Click **"Create service"**

### Step 3: Source Configuration

- [ ] Repository type: **"Source code repository"**
- [ ] Click **"Add new"** → Connect GitHub
- [ ] Authorize AWS App Runner
- [ ] Select repository: `your-repo-name`
- [ ] Select branch: `main`
- [ ] Deployment trigger: **"Automatic"**
- [ ] Click **"Next"**

### Step 4: Build Configuration

**Choose one:**

#### Option A: Manual Configuration (Easier)
- [ ] Runtime: **Node.js 18**
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Port: `8080`

#### Option B: Use Configuration File
- [ ] Select **"Use a configuration file"**
- [ ] App Runner will use `apprunner.yaml`

- [ ] Click **"Next"**

### Step 5: Service Configuration

- [ ] Service name: `flytoez-backend`
- [ ] Port: `8080`

#### Environment Variables:
- [ ] Click **"Add environment variable"**
  
  Add these three:
  ```
  MONGODB_URI = mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/flytoez_dance
  PORT = 8080
  NODE_ENV = production
  ```

- [ ] CPU: **1 vCPU**
- [ ] Memory: **2 GB**
- [ ] Auto scaling: Leave default (1-25 instances)

### Step 6: Health Check

- [ ] Protocol: **HTTP**
- [ ] Path: `/api/health`
- [ ] Interval: **10** seconds
- [ ] Timeout: **5** seconds
- [ ] Healthy threshold: **1**
- [ ] Unhealthy threshold: **5**

### Step 7: Deploy

- [ ] Click **"Next"**
- [ ] Review all settings
- [ ] Click **"Create & deploy"**
- [ ] ⏳ Wait 5-10 minutes for deployment

### Step 8: Get Backend URL

- [ ] Copy your App Runner URL: `https://xxxxx.us-east-1.awsapprunner.com`
- [ ] Save it here: _______________________________________________

### Step 9: Test Backend

```bash
# Replace with your URL
curl https://xxxxx.us-east-1.awsapprunner.com/api/health
```

- [ ] ✅ Backend is working!

---

## 🎨 Deploy Frontend to AWS Amplify

### Step 1: Go to AWS Amplify Console
👉 https://console.aws.amazon.com/amplify/

### Step 2: Create New App

- [ ] Click **"New app"** → **"Host web app"**
- [ ] Select **"GitHub"**
- [ ] Authorize AWS Amplify
- [ ] Select repository and branch

### Step 3: Build Settings

- [ ] Amplify auto-detects `amplify.yml`
- [ ] Review and confirm settings

### Step 4: Environment Variables

- [ ] Add environment variable:
  ```
  Key: REACT_APP_API_URL
  Value: https://xxxxx.us-east-1.awsapprunner.com
  (Your App Runner URL from above)
  ```

### Step 5: Deploy

- [ ] Click **"Save and deploy"**
- [ ] ⏳ Wait 5-10 minutes
- [ ] Copy Amplify URL: _______________________________________________

---

## 🔗 Update CORS in Backend

### Step 1: Update server.js

- [ ] Open `backend/server.js`
- [ ] Add your Amplify URL to `allowedOrigins` array:
  ```javascript
  const allowedOrigins = [
    'http://localhost:3000',
    'https://main.d123abc.amplifyapp.com',  // Your Amplify URL
  ];
  ```

### Step 2: Commit and Push

```bash
git add backend/server.js
git commit -m "Update CORS with Amplify URL"
git push origin main
```

- [ ] ✅ App Runner will auto-deploy

---

## ✅ Testing

### Test Backend
- [ ] Health check: `curl https://your-apprunner-url.com/api/health`
- [ ] API endpoints work
- [ ] MongoDB connection successful

### Test Frontend
- [ ] Open Amplify URL in browser
- [ ] Open DevTools → Console (no CORS errors)
- [ ] Test form submissions
- [ ] Verify data flows between frontend and backend

---

## 📊 Monitor & Manage

### View Backend Logs
1. Go to App Runner Console
2. Select `flytoez-backend`
3. Click **"Logs"** tab

### View Frontend Logs
1. Go to Amplify Console
2. Select your app
3. Click specific build → View logs

### Update Environment Variables
1. App Runner Console → Configuration
2. Edit environment variables
3. Click **"Deploy"**

---

## 💰 Cost Estimate

- **App Runner:** $10-30/month (low traffic) or ~$48/month (24/7)
- **Amplify:** $0-5/month (most small apps)
- **MongoDB Atlas:** Free (M0) or $9+/month
- **Total:** ~$10-50/month depending on usage

---

## 🆘 Troubleshooting

### Backend Not Starting
- [ ] Check logs in App Runner console
- [ ] Verify MongoDB connection string
- [ ] Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)

### CORS Errors
- [ ] Verify Amplify URL in `allowedOrigins`
- [ ] Backend redeployed after CORS update
- [ ] Clear browser cache

### Build Failed
- [ ] Check deployment logs
- [ ] Verify `package.json` has all dependencies
- [ ] Check Node version compatibility

---

## 📝 Important URLs

- **Backend (App Runner):** _______________________________________________
- **Frontend (Amplify):** _______________________________________________
- **MongoDB Atlas:** _______________________________________________
- **GitHub Repo:** _______________________________________________

---

## ✨ You're Done!

Your app is now live with:
- ✅ Automatic deployments on git push
- ✅ Auto-scaling based on traffic
- ✅ HTTPS by default
- ✅ Health monitoring
- ✅ Cloud-hosted MongoDB

🎉 **Congratulations!** Your Flytoez Dance Company app is deployed!

---

**Need detailed instructions?** See [DEPLOY_APPRUNNER.md](./DEPLOY_APPRUNNER.md)
