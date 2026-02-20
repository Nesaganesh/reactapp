# Flytoez Dance Company - Backend Setup

## MongoDB Setup Instructions

### Option 1: Local MongoDB (Development)

1. **Install MongoDB on macOS:**
   ```bash
   # Using Homebrew
   brew tap mongodb/brew
   brew install mongodb-community
   
   # Start MongoDB
   brew services start mongodb-community
   ```

2. **Verify MongoDB is running:**
   ```bash
   mongosh
   ```

### Option 2: MongoDB Atlas (Cloud - Recommended for Production)

1. **Create a free account at:** https://www.mongodb.com/cloud/atlas

2. **Create a new cluster:**
   - Click "Build a Cluster"
   - Choose FREE tier (M0)
   - Select your preferred region
   - Click "Create Cluster"

3. **Create a database user:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password
   - Select "Read and write to any database"
   - Click "Add User"

4. **Whitelist your IP:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
   - Click "Confirm"

5. **Get your connection string:**
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `myFirstDatabase` with `flytoez_dance`

6. **Update backend/.env file:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/flytoez_dance?retryWrites=true&w=majority
   PORT=5000
   ```

## Installation & Running

### Install Backend Dependencies:
```bash
cd backend
npm install
```

### Start the Backend Server:
```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

The backend server will run on http://localhost:6000

### Start the Frontend (in a separate terminal):
```bash
# From the root directory
npm start
```

The frontend will run on http://localhost:3000

## API Endpoints

### Costume Measurements

- **POST** `/api/costume-measurements` - Submit new measurements
- **GET** `/api/costume-measurements` - Get all measurements
- **GET** `/api/costume-measurements/:id` - Get single measurement
- **DELETE** `/api/costume-measurements/:id` - Delete measurement

### Health Check

- **GET** `/api/health` - Check if server is running

## Testing the API

You can test the API using:

1. **Browser:** Visit http://localhost:5000/api/health

2. **Postman or curl:**
   ```bash
   curl http://localhost:5000/api/health
   ```

## Viewing Data in MongoDB

### Using MongoDB Compass (GUI):
1. Download from: https://www.mongodb.com/products/compass
2. Connect using your connection string
3. Browse the `flytoez_dance` database

### Using mongosh (CLI):
```bash
mongosh "your-connection-string"
use flytoez_dance
db.costumemeasurements.find()
```

## Troubleshooting

### Backend won't start:
- Check if MongoDB is running
- Verify MONGODB_URI in backend/.env
- Check if port 5000 is available

### Frontend can't connect to backend:
- Ensure backend is running on port 5000
- Check REACT_APP_API_URL in .env
- Verify CORS is enabled in backend

### MongoDB connection errors:
- Check your internet connection (for Atlas)
- Verify username/password
- Ensure IP is whitelisted (for Atlas)
- Check if MongoDB service is running (for local)
