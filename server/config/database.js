const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flowaid';

// Connect to MongoDB
const connectDB = async () => {
  try {
    let uri = MONGODB_URI;
    let mongoServer;

    // Check if we should use in-memory database
    if (process.env.USE_MEMORY_DB === 'true') {
      // Create an in-memory MongoDB instance
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      
      await mongoose.connect(uri);
      console.log('MongoDB Memory Server connected successfully');
    } else {
      // Connect to external MongoDB
      await mongoose.connect(MONGODB_URI);
      console.log('MongoDB connected successfully');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};


module.exports = connectDB;