/**
 * Centralized API client with automatic token refresh
 */

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

const apiClient = {
  /**
   * Make an authenticated API request with automatic token refresh
   */
  async request(url, options = {}) {
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include', // Include cookies
      ...options
    };

    // Try the original request
    let response = await fetch(url, defaultOptions);

    // If we get a 401, try to refresh the token
    if (response.status === 401 && !options._retry) {
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          // Retry the original request after refresh
          return fetch(url, { ...defaultOptions, _retry: true });
        });
      }

      isRefreshing = true;

      try {
        console.log('Token expired, attempting refresh...');
        const refreshResponse = await this.refreshToken();
        
        if (refreshResponse.ok) {
          console.log('Token refreshed successfully');
          processQueue(null);
          
          // Retry the original request
          response = await fetch(url, { ...defaultOptions, _retry: true });
        } else {
          console.log('Token refresh failed, user needs to login again');
          processQueue(new Error('Token refresh failed'), null);
          this.handleAuthFailure();
          throw new Error('Authentication failed');
        }
      } catch (error) {
        console.error('Error during token refresh:', error);
        processQueue(error, null);
        this.handleAuthFailure();
        throw error;
      } finally {
        isRefreshing = false;
      }
    }

    return response;
  },

  /**
   * Refresh the access token using the refresh token
   */
  async refreshToken() {
    try {
      const response = await fetch('https://localhost:7094/api/Token/RefreshToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update localStorage with new tokens if they're in the response
        if (data.accessToken) {
          localStorage.setItem('SmartBill_auth_token', data.accessToken);
        }
        if (data.refreshToken) {
          localStorage.setItem('SmartBill_auth_RefreshToken', data.refreshToken);
        }
        
        return response;
      } else {
        console.error('Refresh token request failed:', response.status);
        return response;
      }
    } catch (error) {
      console.error('Network error during token refresh:', error);
      throw error;
    }
  },

  /**
   * Handle authentication failure - clear tokens and redirect to login
   */
  handleAuthFailure() {
    console.log('Authentication failed, clearing tokens and redirecting to login');
    
    // Clear localStorage tokens
    localStorage.removeItem('SmartBill_auth_token');
    localStorage.removeItem('SmartBill_auth_RefreshToken');
    
    // Clear any auth-related session storage
    sessionStorage.removeItem('google_code_verifier');
    
    // Redirect to login page
    window.location.href = '/login';
  },

  /**
   * Check if user is authenticated by checking for tokens
   */
  isAuthenticated() {
    // Check for tokens in localStorage or cookies
    const hasLocalStorageToken = localStorage.getItem('SmartBill_auth_token');
    const hasCookieToken = document.cookie.includes('SmartBill_auth_token');
    
    return hasLocalStorageToken || hasCookieToken;
  },

  /**
   * Get current authenticated user info
   */
  async getCurrentUser() {
    try {
      // Get auth token from localStorage as fallback
      const authToken = localStorage.getItem('SmartBill_auth_token');
      
      const options = {};
      if (authToken) {
        options.headers = {
          'Authorization': `Bearer ${authToken}`
        };
      }
      
      const response = await this.request('https://localhost:7094/api/User/Me', options);
      
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to get current user');
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },

  /**
   * Logout user by clearing tokens and calling logout endpoint
   */
  async logout() {
    try {
      // Call logout endpoint to invalidate server-side tokens
      await fetch('https://localhost:7094/api/User/Logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Always clear local tokens regardless of API call success
      this.handleAuthFailure();
    }
  }
};

export default apiClient;
