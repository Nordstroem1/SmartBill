// Example Node.js/Express backend for Google OAuth
// This is a reference implementation - adapt to your backend framework

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Environment variables you'll need to set
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5173/login';

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

    // Verify the ID token (optional but recommended)
    const verifyResponse = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`);
    const tokenInfo = verifyResponse.data;

    if (tokenInfo.aud !== GOOGLE_CLIENT_ID) {
      return res.status(400).json({ error: 'Invalid token audience' });
    }

    // Here you would typically:
    // 1. Check if user exists in your database
    // 2. Create user if they don't exist
    // 3. Generate your own JWT token for the user
    // 4. Store refresh token securely if needed

    // For this example, we'll just return user data
    const userData = {
      id: googleUser.id,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      verified_email: googleUser.verified_email,
      // Add your own app token here
      token: generateAppToken(googleUser.id), // You'll implement this
      loginTime: new Date().toISOString()
    };

    // Store tokens securely on the backend (don't send to frontend)
    // await storeUserTokens(googleUser.id, { access_token, refresh_token });

    res.json(userData);

  } catch (error) {
    console.error('Google OAuth error:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      return res.status(400).json({ error: 'Invalid authorization code or expired' });
    }
    
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Example function to generate your own app token
function generateAppToken(userId) {
  // In a real app, use a proper JWT library with your secret
  const payload = {
    userId: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  // This is a simplified example - use proper JWT signing in production
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

module.exports = app;
