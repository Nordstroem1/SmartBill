// Backend modification for httpOnly cookies (enhanced security)

app.post('/api/auth/google', async (req, res) => {
  try {
    const { code, state, code_verifier, redirect_uri } = req.body;

    // ... existing token exchange logic ...

    const { access_token, id_token, refresh_token } = tokenResponse.data;
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const googleUser = userResponse.data;

    // Generate JWT for your app
    const appToken = jwt.sign(
      { userId: googleUser.id, email: googleUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set httpOnly cookie (most secure approach)
    res.cookie('auth_token', appToken, {
      httpOnly: true,        // Not accessible via JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict',    // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    });

    // Store Google tokens securely on backend (optional)
    // await storeUserTokens(googleUser.id, { access_token, refresh_token });

    // Return only user profile data (no tokens)
    const userData = {
      user: {
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        verified_email: googleUser.verified_email
      },
      loginTime: new Date().toISOString()
      // No token in response - it's in the httpOnly cookie
    };

    res.json(userData);

  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Middleware to verify httpOnly cookie
const authenticateToken = (req, res, next) => {
  const token = req.cookies.auth_token;

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

// Logout endpoint - clear cookie
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
  res.json({ message: 'Logged out successfully' });
});
