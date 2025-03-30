// Next.js API Route for user registration
import { v4 as uuidv4 } from 'uuid';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Get user data from request body
    const userData = req.body;
    
    // For debugging
    console.log('Received user data:', userData);
    
    // Validate required fields
    if (!userData.email || !userData.password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: email and password are required' 
      });
    }
    
    // In a real application, you would:
    // 1. Check if user already exists
    // 2. Hash the password
    // 3. Store user in database
    
    // For mock purposes, just return success with a fake user ID
    const userId = uuidv4();
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: userId,
        email: userData.email,
        name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        role: userData.role || 'patient',
        createdAt: new Date().toISOString()
      },
      token: `mock-jwt-token-${userId}`
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message
    });
  }
}
