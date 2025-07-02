// Updated useGoogleAuth.js for custom token system

import { useState, useCallback } from 'react';
import { GOOGLE_CONFIG, GOOGLE_AUTH_URL } from '../config/googleAuth';
import { storeAuthData } from '../utils/auth-custom-tokens';

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ... existing generateState, generateCodeVerifier, generateCodeChallenge functions ...

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

      // Send to backend - backend uses Google only for identity verification
      // and returns YOUR tokens
      const backendResponse = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

      const authData = await backendResponse.json();
      
      // Clean up session storage
      sessionStorage.removeItem('google_auth_state');
      sessionStorage.removeItem('google_code_verifier');
      
      // Store YOUR tokens and user data
      storeAuthData(authData);
      
      setIsLoading(false);
      return authData;

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  // ... rest of the hook remains the same ...

  return {
    initiateGoogleAuth,
    handleAuthCallback,
    isLoading,
    error
  };
};
