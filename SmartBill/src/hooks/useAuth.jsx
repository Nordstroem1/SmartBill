import { useState, useEffect, useContext, createContext } from 'react';
import apiClient from '../utils/apiClient';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    
    try {
      if (apiClient.isAuthenticated()) {
        try {
          // Try to get user info to verify token is still valid
          const userData = await apiClient.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (networkError) {
          // If it's a network error (backend offline), don't spam console
          if (networkError.message.includes('Failed to fetch')) {
            console.log('Backend appears to be offline, user will need to login when it\'s back');
          } else {
            console.error('Auth check failed:', networkError);
          }
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Unexpected auth error:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
