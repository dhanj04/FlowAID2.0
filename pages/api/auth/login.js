// Next.js API Route for user login
import { v4 as uuidv4 } from 'uuid';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Get login credentials from request body
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    // In a real application, you would:
    // 1. Check if user exists
    // 2. Verify password hash
    // 3. Generate JWT token
    
    // For mock purposes, just return success with a fake user
    // This simulates a successful login for any credentials
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: uuidv4(),
        email: email,
        firstName: 'Test',
        lastName: 'User',
        role: 'patient',
        createdAt: new Date().toISOString()
      },
      token: `mock-jwt-token-${uuidv4()}`
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}
