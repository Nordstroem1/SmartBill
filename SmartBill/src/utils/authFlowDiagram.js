/**
 * 🔄 TOKEN REFRESH SYSTEM - COMPLETE FLOW DIAGRAM
 * 
 * 📋 SYSTEM OVERVIEW:
 * ==================
 * 
 * 1. APP STARTUP:
 * ---------------
 * App.jsx → AuthProvider → useAuth hook → checkAuthStatus()
 *    ↓
 * apiClient.isAuthenticated() → Check localStorage + cookies
 *    ↓
 * apiClient.getCurrentUser() → GET /api/User/Me
 *    ↓
 * Success: setUser(data) + setIsAuthenticated(true)
 * Failure: Redirect to login
 * 
 * 
 * 2. NORMAL API REQUEST:
 * ----------------------
 * Component → apiClient.request(url, options)
 *    ↓
 * fetch(url, { credentials: 'include', ...options })
 *    ↓
 * Status 200: ✅ Return response
 * Status 401: 🔄 Trigger refresh flow
 * 
 * 
 * 3. TOKEN REFRESH FLOW (when 401 received):
 * ===========================================
 * 
 * Step 1: Check refresh status
 * if (isRefreshing) {
 *   → Queue request in failedQueue[]
 *   → Wait for refresh to complete
 * } else {
 *   → Start refresh process
 * }
 * 
 * Step 2: Refresh token
 * POST /api/Token/RefreshToken (with refresh token cookie)
 *    ↓
 * Success (200): 
 *   → New access token set in cookie
 *   → Update localStorage if tokens in response
 *   → processQueue(null) → retry all queued requests
 *   → Retry original request
 * 
 * Failure (401/403):
 *   → processQueue(error) → reject all queued requests
 *   → handleAuthFailure() → clear tokens + redirect to login
 * 
 * 
 * 4. LOGOUT FLOW:
 * ===============
 * Header → logout button → apiClient.logout()
 *    ↓
 * POST /api/User/Logout (invalidate server tokens)
 *    ↓
 * handleAuthFailure() → Clear localStorage + redirect to login
 * */