# Production Security Checklist

## 🔒 **Critical Security Measures for Production**

### 1. **HTTPS Requirements**
```bash
# ❌ Development (OK)
http://localhost:5173/login

# ✅ Production (Required)
https://yourdomain.com/login
```

### 2. **Environment Variables Security**

#### ✅ **Frontend (.env.production)**
```env
# These are PUBLIC and safe to expose:
VITE_GOOGLE_CLIENT_ID=your-prod-client-id.googleusercontent.com
VITE_REDIRECT_URI=https://yourdomain.com/login
VITE_API_BASE_URL=https://api.yourdomain.com
```

#### 🔐 **Backend (.env) - KEEP SECRET**
```env
# ❌ NEVER expose these in frontend:
GOOGLE_CLIENT_SECRET=your-secret-key
JWT_SECRET=super-long-random-string
DATABASE_URL=postgresql://...
```

### 3. **Enhanced Token Security**

#### Option A: HttpOnly Cookies (Most Secure)
```javascript
// Backend sets httpOnly cookie
res.cookie('token', jwtToken, {
  httpOnly: true,     // Not accessible via JavaScript
  secure: true,       // HTTPS only
  sameSite: 'strict', // CSRF protection
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
});
```

#### Option B: Secure localStorage (Current)
```javascript
// Frontend stores token (current implementation)
// ⚠️ Vulnerable to XSS but simpler to implement
localStorage.setItem('token', jwtToken);
```

### 4. **Content Security Policy (CSP)**
```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com;">
```

### 5. **Rate Limiting**
```javascript
// Backend rate limiting
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts'
});

app.use('/api/auth', authLimiter);
```

### 6. **JWT Security**
```javascript
// Enhanced JWT configuration
const token = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: '24h',
  issuer: 'smartbill-app',
  audience: 'smartbill-users',
  algorithm: 'HS256' // Specify algorithm to prevent attacks
});
```

### 7. **Input Validation**
```javascript
// Backend validation
const { body, validationResult } = require('express-validator');

app.post('/api/auth/google', [
  body('code').isLength({ min: 1 }).escape(),
  body('state').isLength({ min: 1 }).escape(),
  body('code_verifier').isLength({ min: 43, max: 128 }).escape()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process authentication...
});
```

## 🛡️ **Security Headers**
```javascript
// Backend security middleware
const helmet = require('helmet');
const cors = require('cors');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://accounts.google.com", "https://oauth2.googleapis.com"]
    }
  }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
}));
```

## 🔍 **Security Monitoring**
```javascript
// Log security events
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'security.log' })
  ]
});

// Log authentication attempts
app.post('/api/auth/google', (req, res) => {
  logger.info('Authentication attempt', {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  // ... rest of auth logic
});
```

## ✅ **Current Implementation Security Score**

| Aspect | Score | Status |
|--------|--------|--------|
| OAuth Flow | 🟢 Excellent | PKCE + State param |
| Token Handling | 🟡 Good | Backend exchange only |
| Data Exposure | 🟢 Excellent | No sensitive data in frontend |
| CSRF Protection | 🟢 Excellent | State parameter |
| XSS Protection | 🟡 Moderate | LocalStorage usage |
| HTTPS Ready | 🟢 Excellent | Ready for production |

## 🚀 **Deployment Security**

### Environment Setup:
1. **Never commit `.env` files**
2. **Use platform environment variables** (Vercel, Netlify, etc.)
3. **Enable HTTPS** (free with Let's Encrypt)
4. **Set up monitoring** (error tracking, auth logs)

### Google Cloud Console:
1. **Restrict API keys** to your domain
2. **Set authorized domains** only
3. **Enable audit logging**
4. **Monitor OAuth usage**
