// Enhanced auth utility with secure token storage
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/**
 * Secure token storage using httpOnly cookies (requires backend support)
 * This is more secure than localStorage as it's not accessible via JavaScript
 */

/**
 * Get the stored authentication token
 * In a more secure setup, this would be sent automatically via httpOnly cookies
 */
export const getAuthToken = () => {
  // For demo purposes, using localStorage
  // In production, consider using httpOnly cookies
  return localStorage.getItem('token');
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
  const token = getAuthToken();
  const user = getStoredUser();
  return !!(token && user);
};

/**
 * Make an authenticated API request with enhanced security
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: 'include', // Include cookies for httpOnly token support
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    // Token expired or invalid - redirect to login
    clearAuth();
    window.location.href = '/login';
    return;
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Clear authentication data
 */
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Also clear any httpOnly cookies via backend call
};

/**
 * Logout user with secure cleanup
 */
export const logout = async () => {
  try {
    // Call backend logout endpoint to clear httpOnly cookies
    await apiRequest('/api/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage regardless of backend response
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

// Security utility functions
export const sanitizeUserInput = (input) => {
  // Basic XSS prevention
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

export const isSecureContext = () => {
  return window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost';
};
