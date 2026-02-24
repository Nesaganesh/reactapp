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
  'https://irmsdkmf43.us-east-1.awsapprunner.com',
  'https://www.flytoez.co.uk',
  'https://flytoez.co.uk'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    // Allow any origin in development (when testing)
    // Comment this out in production for security
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, check allowed origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // For testing purposes, allow all origins (REMOVE THIS IN PRODUCTION)
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Initialize DynamoDB connection and table
const { REGION, TABLE_NAME, initializeTable } = require('./config/dynamodb');
console.log(`📊 Using DynamoDB in region: ${REGION}`);
console.log(`📋 Table name: ${TABLE_NAME}`);

// Initialize table async (will create if doesn't exist)
initializeTable().catch(err => {
  console.error('⚠️ Warning: Could not initialize DynamoDB table:', err.message);
  console.error('   The server will continue, but database operations may fail.');
  console.error('   Please check your AWS credentials and permissions.');
});

// Routes
const costumeMeasurementsRoutes = require('./routes/costumeMeasurements');
const stripeRoutes = require('./routes/stripe');

app.use('/api/costume-measurements', costumeMeasurementsRoutes);
app.use('/api/stripe', stripeRoutes);

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

// Use port 5000 for both local dev and AWS App Runner
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Database: DynamoDB`);
});

module.exports = app;
