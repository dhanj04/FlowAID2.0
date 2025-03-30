const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('./config/passport');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const path = require('path');

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS for all routes - more permissive for local development
app.use(cors({
  origin: '*', // Allow all origins during development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // Set to false to avoid CORS preflight issues
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware for parsing requests
app.use(bodyParser.json());
app.use(passport.initialize());

// Serve static files if needed
app.use(express.static(path.join(__dirname, 'public')));

// Import route handlers
const patientRoutes = require('./routes/patients');
const queueRoutes = require('./routes/queue');
const facilityRoutes = require('./routes/facility');
const modelRoutes = require('./routes/model');
const authRoutes = require('./routes/auth');
const diagnosisRoutes = require('./routes/diagnosis');

// Set up API routes
app.use('/api/patients', patientRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/facility', facilityRoutes);
app.use('/api/model', modelRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/diagnosis', diagnosisRoutes);

// Debug route to check if server is working
app.get('/api/debug', (req, res) => {
  res.status(200).json({
    message: 'API is working correctly',
    timestamp: new Date().toISOString()
  });
});

// Add a root route handler
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'FlowAID API Server',
    status: 'online',
    documentation: '/api-docs',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  console.log(`404 Not Found: ${req.originalUrl}`);
  res.status(404).json({
    error: 'Not Found',
    message: `The requested endpoint ${req.originalUrl} does not exist`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'Something went wrong on the server'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API is available at http://localhost:${PORT}/api`);
});

module.exports = app;