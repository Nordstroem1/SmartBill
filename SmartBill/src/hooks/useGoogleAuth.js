import { useState, useCallback } from 'react';
import { GOOGLE_CONFIG, GOOGLE_AUTH_URL } from '../config/googleAuth';

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate a random state parameter for security
  const generateState = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  // Generate code verifier for PKCE (Proof Key for Code Exchange)
  const generateCodeVerifier = () => {
    const array = new Uint32Array(28);
    crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
  };

  // Generate code challenge from verifier
  const generateCodeChallenge = async (verifier) => {
    const data = new TextEncoder().encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  const initiateGoogleAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const state = generateState();
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // Store state and code verifier in sessionStorage for later verification
      sessionStorage.setItem('google_auth_state', state);
      sessionStorage.setItem('google_code_verifier', codeVerifier);

      const params = new URLSearchParams({
        client_id: GOOGLE_CONFIG.CLIENT_ID,
        redirect_uri: GOOGLE_CONFIG.REDIRECT_URI,
        response_type: 'code',
        scope: GOOGLE_CONFIG.SCOPES,
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        access_type: 'offline',
        prompt: 'consent'
      });

      const authUrl = `${GOOGLE_AUTH_URL}?${params.toString()}`;
      
      // Redirect to Google OAuth
      window.location.href = authUrl;
      
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

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

      // Send only the authorization code to backend
      // Backend will handle everything else
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

      const userData = await backendResponse.json();
      
      // Clean up session storage after successful authentication
      sessionStorage.removeItem('google_auth_state');
      sessionStorage.removeItem('google_code_verifier');
      
      // Store only user data - backend handles all tokens
      localStorage.setItem('user', JSON.stringify(userData));
      
      setIsLoading(false);
      return userData;

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
