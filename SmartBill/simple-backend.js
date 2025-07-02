// Simple backend for testing - receives auth code only
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Simple endpoint that just receives the auth code
app.post('/api/auth/google', async (req, res) => {
  try {
    const { code, state, code_verifier, redirect_uri } = req.body;

    console.log('Received auth code:', code);
    console.log('State:', state);
    console.log('Code verifier:', code_verifier);

    // For now, just return mock user data
    // In your real backend, you'll exchange the code with Google
    const mockUserData = {
      id: '12345',
      email: 'user@example.com',
      name: 'Test User',
      picture: 'https://via.placeholder.com/100',
      verified_email: true
    };

    console.log('Returning user data:', mockUserData);
    
    res.json(mockUserData);

  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Simple backend running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple backend running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoint: http://localhost:${PORT}/api/auth/google`);
});

module.exports = app;
