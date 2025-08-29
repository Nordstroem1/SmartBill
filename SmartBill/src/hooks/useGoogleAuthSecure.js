// Enhanced secure storage approach (backend modification needed)

// Modified useGoogleAuth.js - for maximum security
import { useState, useCallback } from 'react';
import { GOOGLE_CONFIG, GOOGLE_AUTH_URL } from '../config/googleAuth';

function b64url(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function sha256(input) {
  const data = new TextEncoder().encode(input);
  return crypto.subtle.digest('SHA-256', data);
}
function randStr(len = 64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const rnd = new Uint8Array(len);
  crypto.getRandomValues(rnd);
  return Array.from(rnd, n => chars[n % chars.length]).join('');
}
async function buildPkce() {
  const state = randStr(32);
  const codeVerifier = randStr(64);
  const challenge = b64url(await sha256(codeVerifier));
  sessionStorage.setItem('google_auth_state', state);
  sessionStorage.setItem('google_code_verifier', codeVerifier);
  return { state, challenge, codeVerifier };
}

export function useGoogleAuthSecure() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const initiateGoogleAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { state, challenge } = await buildPkce();
      const params = new URLSearchParams({
        client_id: GOOGLE_CONFIG.CLIENT_ID,
        redirect_uri: GOOGLE_CONFIG.REDIRECT_URI,
        response_type: 'code',
        scope: GOOGLE_CONFIG.SCOPES,
        access_type: 'offline',
        include_granted_scopes: 'true',
        prompt: 'consent',
        state,
        code_challenge: challenge,
        code_challenge_method: 'S256',
      });
      window.location.href = `${GOOGLE_AUTH_URL}?${params.toString()}`;
    } catch (e) {
      setError(e.message || 'Failed to start Google auth');
      setIsLoading(false);
    }
  }, []);

  const handleAuthCallback = useCallback(async (code, state) => {
    try {
      setIsLoading(true);
      setError(null);

      const storedState = sessionStorage.getItem('google_auth_state');
      if (!state || state !== storedState) throw new Error('Invalid state parameter');
      const codeVerifier = sessionStorage.getItem('google_code_verifier');
      if (!codeVerifier) throw new Error('Code verifier not found');

      const path = import.meta.env.VITE_AUTH_GOOGLE_PATH || '/auth/google';
      const res = await fetch(`/api${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          code,
          state,
          code_verifier: codeVerifier,
          redirect_uri: GOOGLE_CONFIG.REDIRECT_URI,
        }),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        throw new Error(msg || `Backend authentication failed (${res.status})`);
      }
      const data = await res.json().catch(() => ({}));

      sessionStorage.removeItem('google_auth_state');
      sessionStorage.removeItem('google_code_verifier');

      setIsLoading(false);
      return data;
    } catch (e) {
      setError(e.message || 'Google auth failed');
      setIsLoading(false);
      throw e;
    }
  }, []);

  return { initiateGoogleAuth, handleAuthCallback, isLoading, error };
}

export default useGoogleAuthSecure;
