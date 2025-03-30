const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configure Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '12345', // Replace with actual client ID in production
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '12345', // Replace with actual client secret in production
  callbackURL: '/api/auth/google/callback',
  scope: ['profile', 'email']
},
async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google profile received:', profile.displayName, profile.emails[0].value);
    
    // Check if user already exists with this Google ID or email
    let user = await User.findOne({ 
      $or: [{ googleId: profile.id }, { email: profile.emails[0].value }] 
    });
    
    if (user) {
      // If user exists but googleId is not set (user registered with email first)
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
      
      // Update lastLogin
      user.lastLogin = new Date();
      await user.save();
      console.log('Existing user logged in with Google:', user.email);
    } else {
      // Create new user from Google profile with flattened structure
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        username: profile.emails[0].value,
        role: 'patient', // Default role
        lastLogin: new Date()
      });
      
      await user.save();
      console.log('New user created from Google profile:', user.email);
    }
    
    return done(null, user);
  } catch (error) {
    console.error('Google auth error:', error);
    return done(error, null);
  }
}));

// Middleware to validate token
const validateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication token is required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'flowaid-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'flowaid-secret-key';

// Token expiration time (24 hours in seconds)
const TOKEN_EXPIRATION = 24 * 60 * 60;

// Local authentication - Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { 
      username, 
      email, 
      password, 
      role,
      name,
      phone,
      address,
      dateOfBirth,
      gender,
      specialty,
      licenseNumber,
      experience,
      education 
    } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Missing required fields: email, password, and name are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // Create new user with flattened structure (no nested profile)
    const user = new User({
      username: username || email, // Default to email if username not provided
      email,
      password,
      role: role || 'patient', // Default to patient if role not specified
      name,
      phone: phone || '',
      address: address || '',
      dateOfBirth: dateOfBirth || '',
      gender: gender || '',
      // Add doctor specific fields if applicable
      ...(role === 'doctor' && {
        specialty: specialty || '',
        licenseNumber: licenseNumber || '',
        experience: experience || '',
        education: education || ''
      }),
      // Track registration time
      lastLogin: new Date()
    });

    await user.save();
    console.log('User created successfully:', user._id);

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration. Please try again.' });
  }
});

// Local authentication - Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if this is a Google account and password login is attempted
    if (user.googleId && !user.password) {
      return res.status(400).json({ 
        message: 'This account uses Google authentication. Please sign in with Google.',
        useGoogle: true
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Google authentication routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  try {
    // Generate JWT token for the authenticated user
    const token = jwt.sign(
      { userId: req.user._id, role: req.user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Update last login time
    User.findByIdAndUpdate(req.user._id, { lastLogin: new Date() }).exec();

    // Redirect to frontend with token
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3001';
    res.redirect(`${frontendURL}/auth/callback?token=${token}&role=${req.user.role}`);
  } catch (error) {
    console.error('Google auth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3001'}/login?error=auth_failed`);
  }
});

// Get current user
router.get('/me', validateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  // Since we're using JWT, we don't need to do anything server-side
  // The client should remove the token from storage
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;