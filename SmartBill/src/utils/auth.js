// Simple auth utilities - only auth code to backend, backend handles tokens

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7094';

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
  const user = getStoredUser();
  return !!user; // Simple check - if user exists, they're authenticated
};

/**
 * Store user data after successful authentication
 */
export const storeUserData = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

/**
 * Clear authentication data
 */
export const clearAuth = () => {
  localStorage.removeItem('user');
};

/**
 * Logout user
 */
export const logout = async () => {
  // Clear local storage
  clearAuth();
  // Redirect to login
  window.location.href = '/login';
};
