const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  // Add your Amplify URL after deployment:
  // 'https://your-app-name.amplifyapp.com'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Initialize DynamoDB connection
const { REGION } = require('./config/dynamodb');
console.log(`📊 Using DynamoDB in region: ${REGION}`);
console.log(`📋 Table name: ${process.env.DYNAMODB_TABLE || 'CostumeMeasurements'}`);

// Routes
const costumeMeasurementsRoutes = require('./routes/costumeMeasurements');
app.use('/api/costume-measurements', costumeMeasurementsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    database: 'DynamoDB',
    region: REGION,
    table: process.env.DYNAMODB_TABLE || 'CostumeMeasurements',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Flytoez Dance Company API',
    version: '1.0.0',
    database: 'DynamoDB',
    endpoints: {
      health: '/api/health',
      costumeMeasurements: '/api/costume-measurements'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Use port 8080 for AWS App Runner, 5000 for local dev
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Database: DynamoDB`);
});

module.exports = app;
