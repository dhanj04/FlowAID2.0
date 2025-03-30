const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const db = admin.firestore();

// Demo credentials for testing
const DEMO_USERS = [
  {
    email: 'admin@flowaidsystem.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  },
  {
    email: 'staff@flowaidsystem.com',
    password: 'staff123',
    name: 'Staff User',
    role: 'staff'
  }
];

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // For demo purposes, use demo credentials
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create a JWT token
    const token = jwt.sign(
      { 
        email: user.email,
        name: user.name,
        role: user.role
      }, 
      process.env.JWT_SECRET || 'flowaid-secret-key',
      { expiresIn: '24h' }
    );
    
    // Return user info and token
    res.status(200).json({
      token,
      user: {
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
});

// Get current user endpoint
router.get('/user', async (req, res) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'flowaid-secret-key');
    
    res.status(200).json({
      email: decoded.email,
      name: decoded.name,
      role: decoded.role
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router; 