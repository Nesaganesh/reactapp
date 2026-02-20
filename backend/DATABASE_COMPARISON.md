# MongoDB vs DynamoDB - Comparison & Migration Guide

This guide helps you choose between MongoDB Atlas and AWS DynamoDB for your Flytoez backend.

---

## Quick Comparison

| Feature | MongoDB Atlas | AWS DynamoDB |
|---------|--------------|--------------|
| **Type** | Document Database | Key-Value/Document NoSQL |
| **Hosting** | External (MongoDB Cloud) | AWS Native |
| **Setup** | Connection string | IAM roles (no credentials in App Runner) |
| **Free Tier** | 512MB (forever) | 25GB + 200M requests/month (forever) |
| **Pricing After Free** | $9/month minimum | Pay per request (~$1/million) |
| **Integration** | Works with any platform | Best with AWS services |
| **Schema** | Flexible (but defined) | Completely schemaless |
| **Queries** | Rich query language | Key-based + scan/filter |
| **Relationships** | References, population | Application-level |
| **Local Development** | Easy (MongoDB Compass) | Requires AWS credentials |
| **Learning Curve** | Lower (more familiar) | Moderate (AWS-specific) |
| **Best For** | Traditional apps, complex queries | Serverless, AWS-native apps |

---

## When to Choose MongoDB

✅ **Choose MongoDB if you:**
- Want traditional database experience
- Need complex queries and aggregations
- Prefer visual tools (MongoDB Compass)
- Plan to use non-AWS hosting in future
- Have existing MongoDB experience
- Need relationships between collections

**Example use cases:**
- Complex reporting
- Multi-collection queries
- Document relationships
- Traditional web apps

---

## When to Choose DynamoDB

✅ **Choose DynamoDB if you:**
- Deploying primarily on AWS
- Want serverless architecture
- Need auto-scaling without configuration
- Prefer IAM role authentication
- Want better AWS integration
- Need predictable single-digit ms latency

**Example use cases:**
- AWS-native apps
- Serverless architectures
- Simple CRUD operations
- Apps with App Runner/Lambda/Amplify
- High-scale applications

---

## Cost Comparison Example

### Scenario: Small Dance Studio App
- 1,000 students
- ~10,000 reads/month
- ~1,000 writes/month
- ~100MB of data

#### MongoDB Atlas:
- **Free tier:** ✅ Fits in 512MB
- **Cost:** $0/month

#### DynamoDB:
- **Free tier:** ✅ Well within limits
- **Cost:** $0/month

**Winner:** Tie (both free)

---

### Scenario: Growing Studio
- 10,000 students
- ~1 million reads/month
- ~100,000 writes/month
- ~2GB of data

#### MongoDB Atlas:
- **Needs:** M10 cluster
- **Cost:** ~$9-15/month

#### DynamoDB:
- **Reads:** 1M × $0.00025 = $0.25
- **Writes:** 100k × $0.00125 = $0.125
- **Storage:** 2GB × $0.25 = $0.50
- **Cost:** ~$0.88/month

**Winner:** DynamoDB (significantly cheaper)

---

## Technical Differences

### Data Structure

**MongoDB:**
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  studentName: "John Doe",
  measurements: {
    height: "5.8",
    chest: "36",
    waist: "30"
  },
  createdAt: ISODate("2026-02-20T10:00:00Z")
}
```

**DynamoDB:**
```javascript
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  studentName: "John Doe",
  height: "5.8",
  chest: "36",
  waist: "30",
  createdAt: "2026-02-20T10:00:00.000Z"
}
```

### Code Differences

**MongoDB (Mongoose):**
```javascript
// Create
const measurement = new CostumeMeasurement({ studentName: "John" });
await measurement.save();

// Find
const measurements = await CostumeMeasurement.find({ studentName: "John" });

// Update
await CostumeMeasurement.findByIdAndUpdate(id, { height: "6.0" });
```

**DynamoDB (AWS SDK):**
```javascript
// Create
await docClient.send(new PutCommand({
  TableName: 'CostumeMeasurements',
  Item: { id: uuidv4(), studentName: "John" }
}));

// Find (scan)
await docClient.send(new ScanCommand({
  TableName: 'CostumeMeasurements',
  FilterExpression: 'studentName = :name',
  ExpressionAttributeValues: { ':name': 'John' }
}));

// Update
await docClient.send(new UpdateCommand({
  TableName: 'CostumeMeasurements',
  Key: { id },
  UpdateExpression: 'SET height = :height',
  ExpressionAttributeValues: { ':height': '6.0' }
}));
```

---

## Migration Guide

### Option 1: Start Fresh with DynamoDB

The easiest approach - start with a new DynamoDB table:

```bash
# 1. Switch to DynamoDB code
cd backend
./switch-database.sh
# Choose option 2 (DynamoDB)

# 2. Install dependencies
npm install

# 3. Configure AWS credentials (see DYNAMODB_SETUP.md)

# 4. Create DynamoDB table in AWS Console

# 5. Test locally
npm start
```

### Option 2: Migrate Existing Data

If you have existing MongoDB data:

#### Step 1: Export from MongoDB
```bash
# Export data to JSON
mongoexport --uri="your-mongodb-connection-string" \
  --collection=costumemeasurements \
  --out=data.json
```

#### Step 2: Transform Data
Create a migration script (`migrate-to-dynamodb.js`):

```javascript
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { docClient } = require('./config/dynamodb');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');

async function migrate() {
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  
  for (const item of data) {
    // Transform MongoDB document to DynamoDB item
    const dynamoItem = {
      id: uuidv4(),
      studentName: item.studentName,
      height: item.height,
      chest: item.chest,
      waist: item.waist,
      // ... other fields
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Remove MongoDB _id
    delete dynamoItem._id;
    
    // Put item in DynamoDB
    await docClient.send(new PutCommand({
      TableName: 'CostumeMeasurements',
      Item: dynamoItem
    }));
    
    console.log(`Migrated: ${dynamoItem.studentName}`);
  }
  
  console.log('Migration complete!');
}

migrate().catch(console.error);
```

#### Step 3: Run Migration
```bash
node migrate-to-dynamodb.js
```

### Option 3: Dual-Database (Transition Period)

Run both databases temporarily:

1. Keep MongoDB running
2. Add DynamoDB
3. Write to both databases
4. Read from DynamoDB (with MongoDB fallback)
5. After verification, remove MongoDB

---

## Switching Between Implementations

Your backend is set up to support both MongoDB and DynamoDB!

### Files Structure:

```
backend/
├── server.js                          # Current active version
├── server.mongodb.js                  # MongoDB implementation
├── server.dynamodb.js                 # DynamoDB implementation
├── models/
│   ├── CostumeMeasurement.js         # Mongoose model
│   └── CostumeMeasurement.dynamodb.js # DynamoDB model
├── routes/
│   ├── costumeMeasurements.js        # Mongoose routes
│   └── costumeMeasurements.dynamodb.js # DynamoDB routes
└── config/
    └── dynamodb.js                    # DynamoDB client config
```

### Quick Switch:

```bash
cd backend

# Switch to DynamoDB
./switch-database.sh
# Choose option 2

# Switch back to MongoDB
./switch-database.sh
# Choose option 1
```

---

## Recommendation for Your Project

### For Flytoez Dance Company App:

**I recommend DynamoDB because:**

1. ✅ **AWS Native:** Perfect with App Runner + Amplify
2. ✅ **No Credentials:** Uses IAM roles (more secure)
3. ✅ **Cost Effective:** Generous free tier, cheaper at scale
4. ✅ **Simple Operations:** Your app does mainly CRUD
5. ✅ **Serverless:** No connection management
6. ✅ **Auto-scaling:** Handles traffic spikes automatically
7. ✅ **Low Maintenance:** No cluster management

**Use MongoDB if:**
- You need complex aggregations
- You want to self-host later
- Team has MongoDB expertise
- You need relationships between collections

---

## Getting Started

### To use DynamoDB:

1. **Read the guide:** [DYNAMODB_SETUP.md](./DYNAMODB_SETUP.md)
2. **Quick start:** [DYNAMODB_QUICKSTART.md](./DYNAMODB_QUICKSTART.md)
3. **Switch code:** Run `./switch-database.sh`

### To use MongoDB:

1. **Read the guide:** [MONGODB_SETUP.md](./MONGODB_SETUP.md)
2. **Original README:** [README.md](./README.md)
3. **Switch code:** Run `./switch-database.sh`

---

## Support & Resources

### MongoDB
- Documentation: https://docs.mongodb.com/
- Atlas: https://www.mongodb.com/cloud/atlas
- Compass (GUI): https://www.mongodb.com/products/compass

### DynamoDB
- Documentation: https://docs.aws.amazon.com/dynamodb/
- Console: https://console.aws.amazon.com/dynamodbv2/
- NoSQL Workbench: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/workbench.html

---

## Questions?

**Which should I choose?**
- Starting fresh on AWS? → **DynamoDB**
- Need complex queries? → **MongoDB**
- Want lower costs at scale? → **DynamoDB**
- Prefer familiar tools? → **MongoDB**

**Can I switch later?**
- Yes! Both implementations are ready
- Migration script provided
- Minimal code changes needed

**What if I'm not sure?**
- Start with **DynamoDB** (easier AWS integration)
- You can always migrate to MongoDB later
- Both have excellent free tiers for testing

---

**🚀 Ready to deploy?** Choose your database and follow the respective setup guide!
