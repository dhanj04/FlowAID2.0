const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');

// Connect to database
connectDB();

// Initial users data
const users = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    department: null
  },
  {
    username: 'doctor',
    password: 'doctor123',
    name: 'Dr. Jane Smith',
    role: 'doctor',
    department: 'Cardiology'
  },
  {
    username: 'nurse',
    password: 'nurse123',
    name: 'Nurse John Doe',
    role: 'nurse',
    department: 'Emergency'
  }
];

// Seed database
const seedDatabase = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');
    
    // Create new users
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);
    
    // Log created users (without passwords)
    createdUsers.forEach(user => {
      console.log(`Created user: ${user.username} (${user.role})`);
    });
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Disconnect from database
    mongoose.disconnect();
  }
};

// Run the seed function
seedDatabase();