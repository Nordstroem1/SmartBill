// Backend: Google OAuth for Identity Only + Your Own Token System

const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const crypto = require('crypto');

// Your custom token system
const generateTokens = (userId, userEmail) => {
  const payload = {
    userId: userId,
    email: userEmail,
    type: 'access'
  };

  // Your access token (short-lived)
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '15m', // Short lived
    issuer: 'smartbill-app',
    audience: 'smartbill-users'
  });

  // Your refresh token (long-lived)
  const refreshToken = jwt.sign(
    { ...payload, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET, // Different secret for refresh tokens
    {
      expiresIn: '7d', // Longer lived
      issuer: 'smartbill-app',
      audience: 'smartbill-users'
    }
  );

  return { accessToken, refreshToken };
};

// Google OAuth endpoint - Identity verification only
app.post('/api/auth/google', async (req, res) => {
  try {
    const { code, state, code_verifier, redirect_uri } = req.body;

    // 1. Exchange code for Google tokens (just to verify identity)
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code: code,
      code_verifier: code_verifier,
      grant_type: 'authorization_code',
      redirect_uri: redirect_uri
    });

    const { access_token } = tokenResponse.data;
    // Note: We're not storing Google's refresh_token

    // 2. Get user info from Google
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const googleUser = userResponse.data;

    // 3. Create or update user in YOUR database
    let user = await findUserByGoogleId(googleUser.id);
    
    if (!user) {
      // Create new user
      user = await createUser({
        google_id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        email_verified: googleUser.verified_email,
        created_at: new Date(),
        last_login: new Date()
      });
    } else {
      // Update existing user
      await updateUser(user.id, {
        name: googleUser.name,
        picture: googleUser.picture,
        last_login: new Date()
      });
    }

    // 4. Generate YOUR tokens (not Google's)
    const { accessToken, refreshToken } = generateTokens(user.id, user.email);

    // 5. Store YOUR refresh token securely
    await storeRefreshToken(user.id, refreshToken);

    // 6. Return user data and YOUR tokens
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        email_verified: user.email_verified
      },
      accessToken: accessToken,
      refreshToken: refreshToken, // Or store in httpOnly cookie
      expiresIn: 900, // 15 minutes
      tokenType: 'Bearer'
    });

    // Google's tokens are discarded at this point

  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Your token refresh endpoint
app.post('/api/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Verify YOUR refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    // Check if refresh token exists in database
    const storedToken = await getRefreshToken(decoded.userId, refreshToken);
    if (!storedToken) {
      throw new Error('Refresh token not found');
    }

    // Generate new access token
    const { accessToken: newAccessToken } = generateTokens(decoded.userId, decoded.email);

    res.json({
      accessToken: newAccessToken,
      expiresIn: 900,
      tokenType: 'Bearer'
    });

  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Database functions (implement based on your database)
const findUserByGoogleId = async (googleId) => {
  // Your database query
  // return await db.users.findOne({ google_id: googleId });
};

const createUser = async (userData) => {
  // Your database insert
  // return await db.users.create(userData);
};

const updateUser = async (userId, updates) => {
  // Your database update
  // return await db.users.update(userId, updates);
};

const storeRefreshToken = async (userId, refreshToken) => {
  // Store in database with expiration
  // await db.refresh_tokens.create({
  //   user_id: userId,
  //   token: refreshToken,
  //   expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  // });
};

const getRefreshToken = async (userId, refreshToken) => {
  // Check if token exists and is valid
  // return await db.refresh_tokens.findOne({
  //   user_id: userId,
  //   token: refreshToken,
  //   expires_at: { $gt: new Date() }
  // });
};
