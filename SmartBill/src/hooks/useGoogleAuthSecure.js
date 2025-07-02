// Enhanced secure storage approach (backend modification needed)

// Modified useGoogleAuth.js - for maximum security
import { useState, useCallback } from 'react';
import { GOOGLE_CONFIG, GOOGLE_AUTH_URL } from '../config/googleAuth';

export const useGoogleAuthSecure = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ... existing code for generateState, generateCodeVerifier, generateCodeChallenge ...

  const handleAuthCallback = useCallback(async (code, state) => {
    try {
      setIsLoading(true);
      setError(null);

      // Verify state parameter
      const storedState = sessionStorage.getItem('google_auth_state');
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }

      const codeVerifier = sessionStorage.getItem('google_code_verifier');
      if (!codeVerifier) {
        throw new Error('Code verifier not found');
      }

      // Send to backend - backend will set httpOnly cookies
      const backendResponse = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({
          code: code,
          state: state,
          code_verifier: codeVerifier,
          redirect_uri: GOOGLE_CONFIG.REDIRECT_URI,
        }),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.text();
        throw new Error(`Backend authentication failed: ${errorData}`);
      }

      const responseData = await backendResponse.json();
      
      // Clean up session storage
      sessionStorage.removeItem('google_auth_state');
      sessionStorage.removeItem('google_code_verifier');
      
      // Only store non-sensitive user profile data
      // JWT token is stored in httpOnly cookie by backend
      localStorage.setItem('user', JSON.stringify(responseData.user));
      
      setIsLoading(false);
      return responseData;

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  return {
    initiateGoogleAuth,
    handleAuthCallback,
    isLoading,
    error
  };
};
