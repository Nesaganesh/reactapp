# MongoDB Atlas Setup Guide - Step by Step

This guide will walk you through creating a FREE MongoDB Atlas account and getting your connection string.

---

## Step 1: Create MongoDB Atlas Account

1. **Go to MongoDB Atlas website:**  
   👉 https://www.mongodb.com/cloud/atlas/register

2. **Sign up:**
   - Enter your email, first name, last name
   - Create a password
   - Click **"Create your Atlas account"**
   
   OR
   
   - Sign up with Google account (easier)

3. **Verify your email** (check your inbox)

4. **Log in** to MongoDB Atlas

---

## Step 2: Create a Free Cluster

### 2.1 Welcome Screen

1. After logging in, you'll see **"Welcome to Atlas"**
2. Click **"Create"** or **"Build a Database"**

### 2.2 Choose Plan

1. Select **"M0 FREE"** tier
   - ✅ 512 MB storage
   - ✅ Shared RAM
   - ✅ Perfect for development and small apps
   - ✅ No credit card required

2. Click **"Create"**

### 2.3 Choose Cloud Provider & Region

1. **Provider:** Select **AWS** (recommended for App Runner/Amplify)
2. **Region:** Select region closest to your AWS region
   - If deploying to **us-east-1** (Virginia), choose **N. Virginia (us-east-1)**
   - If deploying to **us-west-2** (Oregon), choose **Oregon (us-west-2)**
   
   💡 **Tip:** Choose the same region as your AWS App Runner service for lower latency

3. **Cluster Name:** Keep default (e.g., `Cluster0`) or rename to `flytoez-cluster`

4. Click **"Create Cluster"**

5. ⏳ **Wait 1-3 minutes** for cluster to be created

---

## Step 3: Create Database User

### 3.1 Security Quick Start (Auto-prompt)

After cluster creation, you'll see a **Security Quickstart** popup:

#### Add a Database User:

1. **Authentication Method:** Password
2. **Username:** Enter a username (e.g., `flytoez_admin`)
3. **Password:** 
   - Click **"Autogenerate Secure Password"** (recommended)
   - **⚠️ SAVE THIS PASSWORD** - copy it to a safe place!
   - Or create your own strong password

4. **User Privileges:** Select **"Read and write to any database"**

5. Click **"Create User"**

### 3.2 Manual Method (if popup doesn't appear)

1. Click **"Database Access"** in left sidebar (under Security)
2. Click **"+ ADD NEW DATABASE USER"**
3. Choose **"Password"** authentication
4. Username: `flytoez_admin`
5. Password: Auto-generate or create your own (SAVE IT!)
6. Database User Privileges: **"Atlas admin"** or **"Read and write to any database"**
7. Click **"Add User"**

---

## Step 4: Configure Network Access

### 4.1 Security Quick Start (continued)

In the same popup or next step:

#### Add entries to your IP Access List:

1. Click **"Add My Current IP Address"** (for testing)
   - This allows access from your computer

2. **For Production (AWS App Runner):**
   - Click **"Add IP Address"**
   - Enter: `0.0.0.0/0` (allows access from anywhere)
   - Description: `AWS App Runner`
   - Click **"Add Entry"**

3. Click **"Finish and Close"**

### 4.2 Manual Method

1. Click **"Network Access"** in left sidebar (under Security)
2. Click **"+ ADD IP ADDRESS"**
3. Click **"ALLOW ACCESS FROM ANYWHERE"**
   - This automatically adds `0.0.0.0/0`
   - ⚠️ **Note:** This is acceptable for development. For production, consider restricting IPs if possible
4. Click **"Confirm"**

---

## Step 5: Get Your Connection String

### 5.1 Navigate to Database

1. Click **"Database"** in left sidebar (under Deployment)
2. You should see your cluster (e.g., `Cluster0`)
3. Click **"Connect"** button

### 5.2 Choose Connection Method

1. Click **"Connect your application"**
   
   *(Not "MongoDB Shell" or "Compass")*

### 5.3 Copy Connection String

1. **Driver:** Node.js
2. **Version:** 5.5 or later

3. You'll see a connection string like:
   ```
   mongodb+srv://flytoez_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

4. Click **"Copy"** button

5. **Replace `<password>` with your actual password:**
   ```
   mongodb+srv://flytoez_admin:YourActualPassword123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **Add database name** before the `?`:
   ```
   mongodb+srv://flytoez_admin:YourActualPassword123@cluster0.xxxxx.mongodb.net/flytoez_dance?retryWrites=true&w=majority
   ```

### 5.4 Your Final Connection String

Your connection string should look like:

```
mongodb+srv://flytoez_admin:YourPassword@cluster0.abc123.mongodb.net/flytoez_dance?retryWrites=true&w=majority
```

**Parts explained:**
- `flytoez_admin` - your database username
- `YourPassword` - your database user password
- `cluster0.abc123.mongodb.net` - your cluster address (unique to you)
- `flytoez_dance` - your database name
- `?retryWrites=true&w=majority` - connection options

---

## Step 6: Test Connection Locally

Before deploying, test your connection string:

### 6.1 Create .env file (if not exists)

```bash
cd backend
```

Create or edit `.env` file:

```bash
cat > .env << 'EOF'
MONGODB_URI=mongodb+srv://flytoez_admin:YourPassword@cluster0.abc123.mongodb.net/flytoez_dance?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
EOF
```

**⚠️ Replace with YOUR actual connection string!**

### 6.2 Test Backend Locally

```bash
# Make sure you're in backend folder
cd backend

# Install dependencies (if not already done)
npm install

# Start the server
npm start
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server is running on port 5000
```

If you see connection errors, check:
- Password is correct (no special characters causing issues)
- IP address is whitelisted in Network Access
- Internet connection is working

### 6.3 Test API Endpoint

Open another terminal:

```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"status":"Server is running","timestamp":"2026-02-20T..."}
```

---

## Step 7: Use in AWS App Runner

When deploying to App Runner, add this environment variable:

**In AWS App Runner Console:**

1. During service creation or in Configuration tab
2. Add environment variable:
   ```
   Key: MONGODB_URI
   Value: mongodb+srv://flytoez_admin:YourPassword@cluster0.abc123.mongodb.net/flytoez_dance?retryWrites=true&w=majority
   ```

**⚠️ Important:** Use the FULL connection string including:
- Username
- Password  
- Database name (`flytoez_dance`)
- Connection options

---

## Common Issues & Solutions

### Issue 1: Authentication Failed

**Error:** `MongoServerError: bad auth : Authentication failed`

**Solutions:**
- ✅ Double-check username and password
- ✅ Password might contain special characters - try URL encoding them:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `$` becomes `%24`
  - Example: `Pass@123` → `Pass%40123`
- ✅ Verify user exists in Database Access

### Issue 2: Connection Timeout

**Error:** `MongooseServerSelectionError: connect ETIMEDOUT`

**Solutions:**
- ✅ Check Network Access - ensure `0.0.0.0/0` is added
- ✅ Verify cluster is running (not paused)
- ✅ Check internet connection
- ✅ Try different network (some networks block MongoDB ports)

### Issue 3: Invalid Connection String

**Error:** `Invalid connection string`

**Solutions:**
- ✅ Ensure no spaces in connection string
- ✅ Check format: `mongodb+srv://...` (not `mongodb://...`)
- ✅ Verify database name is before `?`
- ✅ Password is URL-encoded if contains special characters

### Issue 4: Database Not Found

**Note:** MongoDB Atlas creates the database automatically on first write operation. It won't show up until you insert data.

---

## Tips & Best Practices

### Security Tips

1. **Strong Passwords:** Use auto-generated passwords
2. **Limit IP Access:** In production, restrict to specific IPs if possible
3. **Rotate Credentials:** Change passwords periodically
4. **Use Environment Variables:** Never commit `.env` to git

### Performance Tips

1. **Choose Nearby Region:** Select region close to your app server
2. **Create Indexes:** Index frequently queried fields
3. **Monitor Usage:** Check M0 limits (512MB storage, shared CPU)
4. **Upgrade if Needed:** Consider M10 tier for production apps ($9/month)

### Development Workflow

1. **Local Development:** Use `.env` file
2. **Production:** Use AWS App Runner environment variables
3. **Never Commit:** Add `.env` to `.gitignore`
4. **Document:** Keep connection instructions for team members

---

## MongoDB Atlas Dashboard Overview

### Database Deployments
- View cluster status
- Monitor connections
- See database size

### Collections Tab
- Browse your data
- Run queries
- Insert/update/delete documents

### Metrics Tab
- Monitor connections
- View operations per second
- Check storage usage
- Query performance

### Monitoring Tab (M10+ only)
- Real-time metrics
- Query performance
- Slow queries analysis

---

## Upgrading from Free Tier

If you need more resources:

### M10 Cluster ($9/month minimum)
- 10GB storage
- Dedicated RAM
- Better performance
- Advanced monitoring
- Automated backups

**To Upgrade:**
1. Go to your cluster
2. Click **"..."** menu
3. Select **"Edit Configuration"**
4. Choose **M10** tier
5. Click **"Review Changes"**
6. Confirm

---

## Quick Reference

### Important URLs
- **Atlas Console:** https://cloud.mongodb.com/
- **Documentation:** https://docs.atlas.mongodb.com/
- **Support:** https://support.mongodb.com/

### Your Credentials (Fill in)
```
Username: ________________________
Password: ________________________
Cluster Name: ________________________
Connection String: 
mongodb+srv://_______________________________________________________________
```

### Common Commands (MongoDB Shell)

```javascript
// Connect via mongosh (optional)
mongosh "your-connection-string"

// Show databases
show dbs

// Use database
use flytoez_dance

// Show collections
show collections

// Query data
db.costumesMeasurements.find()

// Count documents
db.costumesMeasurements.countDocuments()
```

---

## Next Steps

✅ MongoDB Atlas cluster created  
✅ Database user created  
✅ Network access configured  
✅ Connection string obtained  
✅ Local connection tested  

**Now you can:**
1. ✅ Deploy backend to AWS App Runner (see [DEPLOY_APPRUNNER.md](./DEPLOY_APPRUNNER.md))
2. ✅ Use connection string in App Runner environment variables
3. ✅ Start building your application

---

## Need Help?

- **MongoDB University:** Free courses at https://university.mongodb.com/
- **Community Forums:** https://www.mongodb.com/community/forums/
- **Discord:** https://discord.gg/mongodb

---

**🎉 Congratulations!** You now have a cloud MongoDB database ready to use with your application!
