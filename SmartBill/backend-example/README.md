# SmartBill Backend - Google OAuth Implementation

This backend handles secure Google OAuth 2.0 authentication using the PKCE flow.

## 🔐 Security Features

- **PKCE (Proof Key for Code Exchange)**: Secure OAuth flow for public clients
- **Backend Token Exchange**: Authorization codes are exchanged for tokens on the backend only
- **JWT Token Management**: Issues your own application tokens
- **No Token Exposure**: Google tokens never reach the frontend
- **Proper Token Verification**: Validates Google ID tokens

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend-example
npm install
```

### 2. Environment Setup

```bash
# Copy the example environment file
copy .env.example .env

# Edit .env with your values
```

### 3. Required Environment Variables

```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5173/login
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 4. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API or Google OAuth2 API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Set Application type to **Web application**
6. Add Authorized redirect URIs:
   - `http://localhost:5173/login` (development)
   - `https://yourdomain.com/login` (production)

### 5. Start the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Authentication

#### `POST /api/auth/google`
Exchanges Google authorization code for user data and app token.

**Request Body:**
```json
{
  "code": "google_authorization_code",
  "state": "state_parameter",
  "code_verifier": "pkce_code_verifier",
  "redirect_uri": "http://localhost:5173/login"
}
```

**Response:**
```json
{
  "user": {
    "id": "google_user_id",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "https://...",
    "verified_email": true
  },
  "token": "jwt_app_token",
  "loginTime": "2024-01-15T10:30:00.000Z"
}
```

### Protected Routes

#### `GET /api/user/profile`
Get user profile (requires valid JWT token).

**Headers:**
```
Authorization: Bearer your_jwt_token
```

#### `POST /api/auth/logout`
Logout user (requires valid JWT token).

### Utility

#### `GET /health`
Health check endpoint.

## 🔒 Security Best Practices

### What This Implementation Does Right:

1. **PKCE Flow**: Uses code_challenge and code_verifier for secure OAuth
2. **Backend Token Exchange**: Google tokens never reach the frontend
3. **Token Verification**: Validates Google ID tokens
4. **JWT Signing**: Issues your own application tokens
5. **CORS Protection**: Configured for your frontend domain
6. **Error Handling**: Proper error responses and logging

### Frontend Integration:

Your frontend is already correctly implemented! It:
- Sends only the authorization code and code_verifier to backend
- Doesn't handle Google tokens directly
- Stores only the app token and user data

## 🔧 Customization

### Database Integration

To store users in a database, modify the `/api/auth/google` endpoint:

```javascript
// Check if user exists
let user = await findUserByGoogleId(googleUser.id);

if (!user) {
  // Create new user
  user = await createUser({
    google_id: googleUser.id,
    email: googleUser.email,
    name: googleUser.name,
    picture: googleUser.picture,
    created_at: new Date()
  });
}

// Update last login
await updateUser(user.id, { last_login: new Date() });
```

### Token Storage

Store Google refresh tokens securely:

```javascript
// Store tokens for API access (optional)
await storeUserTokens(user.id, {
  google_access_token: access_token,
  google_refresh_token: refresh_token,
  expires_at: new Date(Date.now() + 3600000) // 1 hour
});
```

## 🚀 Deployment

### Environment Variables for Production:

```env
GOOGLE_CLIENT_ID=your-prod-client-id
GOOGLE_CLIENT_SECRET=your-prod-client-secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/login
PORT=3001
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=super-secure-random-string
```

### HTTPS Requirements:

- Google OAuth requires HTTPS in production
- Make sure your domain has a valid SSL certificate
- Update redirect URIs in Google Cloud Console

## 🧪 Testing

Test the authentication flow:

1. Start backend: `npm run dev`
2. Start frontend: `npm run dev` (in main project)
3. Visit `http://localhost:5173/login`
4. Click "Fortsätt med Google"
5. Complete OAuth flow
6. Check browser network tab for API calls

## 📝 Notes

- The JWT secret should be a long, random string in production
- Consider implementing refresh token rotation for enhanced security
- Add rate limiting for production use
- Implement proper logging for security monitoring
- Consider using a session store for large-scale applications

## 🔍 Troubleshooting

### Common Issues:

1. **"Invalid authorization code"**: Code was already used or expired
2. **"Invalid state parameter"**: CSRF protection triggered
3. **"Invalid token audience"**: Google Client ID mismatch
4. **CORS errors**: Check FRONTEND_URL environment variable

### Debug Mode:

Add this to see detailed OAuth responses:

```javascript
console.log('Google token response:', tokenResponse.data);
console.log('Google user data:', googleUser);
```
