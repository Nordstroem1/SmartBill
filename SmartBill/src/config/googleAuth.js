// Google OAuth Configuration
export const GOOGLE_CONFIG = {
  // You'll need to get these from Google Cloud Console
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id.googleusercontent.com',
  REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI || import.meta.env.REACT_APP_REDIRECT_URI || 'http://localhost:5173/login',
  SCOPES: [
    'openid',
    'email',
    'profile',
    // Add additional scopes as needed for your app
  ].join(' ')
};

// Google OAuth URLs
export const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
