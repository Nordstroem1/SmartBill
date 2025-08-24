// Centralized fetch wrapper with automatic token refresh on 401
// Usage: import fetchWithAuth from '../utils/fetchWithAuth';

const API_BASE = 'https://localhost:7094';

async function fetchWithAuth(input, init = {}) {
  // Always include credentials for cookies
  const fetchInit = { ...init, credentials: 'include' };
  let response = await fetch(input, fetchInit);

  if (response.status === 401) {
    // Try to refresh token using the correct endpoint
    const refreshResp = await fetch(`${API_BASE}/api/Token/Refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (refreshResp.ok) {
      // Retry the original request once
      response = await fetch(input, fetchInit);
    }
  }
  return response;
}

export default fetchWithAuth;
