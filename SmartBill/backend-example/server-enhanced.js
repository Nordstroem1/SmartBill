// Enhanced version with proper JWT handling
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Validate required environment variables
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !JWT_SECRET) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Google OAuth endpoint
app.post('/api/auth/google', async (req, res) => {
  try {
    const { code, state, code_verifier, redirect_uri } = req.body;

    // Validate required fields
    if (!code || !code_verifier) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Exchange authorization code for tokens
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code: code,
      code_verifier: code_verifier,
      grant_type: 'authorization_code',
      redirect_uri: redirect_uri || GOOGLE_REDIRECT_URI
    });

    const { access_token, id_token, refresh_token } = tokenResponse.data;

    // Get user information from Google
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const googleUser = userResponse.data;

    // Verify the ID token
    try {
      const verifyResponse = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`);
      const tokenInfo = verifyResponse.data;

      if (tokenInfo.aud !== GOOGLE_CLIENT_ID) {
        return res.status(400).json({ error: 'Invalid token audience' });
      }
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError.message);
      return res.status(400).json({ error: 'Token verification failed' });
    }

    // Here you would typically:
    // 1. Check if user exists in your database
    // 2. Create user if they don't exist
    // 3. Update last login time
    
    // For demo purposes, we'll create a user object
    const user = {
      id: googleUser.id,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      verified_email: googleUser.verified_email,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString()
    };

    // Generate JWT token for your application
    const appToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name 
      },
      JWT_SECRET,
      { 
        expiresIn: '24h',
        issuer: 'smartbill-app',
        audience: 'smartbill-users'
      }
    );

    // Store refresh token securely (in a real app, store in database)
    // await storeUserTokens(user.id, { 
    //   google_access_token: access_token, 
    //   google_refresh_token: refresh_token 
    // });

    // Return user data and app token (no Google tokens to frontend)
    const responseData = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        verified_email: user.verified_email
      },
      token: appToken,
      loginTime: new Date().toISOString()
    };

    res.json(responseData);

  } catch (error) {
    console.error('Google OAuth error:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      return res.status(400).json({ 
        error: 'Invalid authorization code or expired',
        details: error.response.data?.error_description 
      });
    }
    
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Middleware to verify JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Protected route example
app.get('/api/user/profile', authenticateToken, (req, res) => {
  res.json({
    message: 'Access granted to protected route',
    user: req.user
  });
});

// Logout endpoint (invalidate token)
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  // In a real app, you might want to blacklist the token
  // or store logout time in database
  res.json({ message: 'Logged out successfully' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
