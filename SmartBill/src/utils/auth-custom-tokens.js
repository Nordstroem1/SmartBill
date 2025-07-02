// Frontend: Updated auth utilities for your custom token system

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/**
 * Get the stored access token
 */
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

/**
 * Get the stored refresh token
 */
export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

/**
 * Get the stored user data
 */
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  const user = getStoredUser();
  return !!(accessToken && refreshToken && user);
};

/**
 * Refresh the access token using your refresh token
 */
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    // Refresh token is invalid - user needs to login again
    clearAuth();
    window.location.href = '/login';
    throw new Error('Refresh token expired');
  }

  const data = await response.json();
  
  // Store new access token
  localStorage.setItem('accessToken', data.accessToken);
  
  return data.accessToken;
};

/**
 * Make an authenticated API request with automatic token refresh
 */
export const apiRequest = async (endpoint, options = {}) => {
  let accessToken = getAccessToken();
  
  const makeRequest = async (token) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    return fetch(`${API_BASE_URL}${endpoint}`, config);
  };

  let response = await makeRequest(accessToken);

  // If access token expired, try to refresh
  if (response.status === 401) {
    try {
      accessToken = await refreshAccessToken();
      response = await makeRequest(accessToken);
    } catch (error) {
      // Refresh failed - redirect to login
      return;
    }
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Store authentication data
 */
export const storeAuthData = (authData) => {
  localStorage.setItem('user', JSON.stringify(authData.user));
  localStorage.setItem('accessToken', authData.accessToken);
  localStorage.setItem('refreshToken', authData.refreshToken);
};

/**
 * Clear authentication data
 */
export const clearAuth = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    // Call backend logout endpoint to invalidate refresh token
    await apiRequest('/api/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage regardless
    clearAuth();
    window.location.href = '/login';
  }
};

/**
 * Get user profile from backend
 */
export const getUserProfile = async () => {
  return apiRequest('/api/user/profile');
};
