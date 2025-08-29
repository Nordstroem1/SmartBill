// API base:
// - In dev, you can use '/api' and Vite proxy.
// - Or set VITE_API_BASE to 'https://localhost:7094/api' to call backend directly.
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  import.meta.env.VITE_API_BASE_URL ||
  '/api';

// Endpoints
const ME_ENDPOINT = import.meta.env.VITE_ME_ENDPOINT || '/User/Me';
const REFRESH_ENDPOINT = import.meta.env.VITE_REFRESH_ENDPOINT || null; // e.g., '/User/Refresh' if available

// de-dupe concurrent refresh calls
let refreshPromise = null;
function refreshOnce() {
  if (refreshPromise) return refreshPromise;

  const candidates = REFRESH_ENDPOINT
    ? [REFRESH_ENDPOINT]
    : ['/User/Refresh', '/Token/Refresh', '/Auth/Refresh', '/Account/Refresh'];

  refreshPromise = (async () => {
    for (const ep of candidates) {
      try {
        const url = ep.startsWith('http')
          ? ep
          : `${API_BASE}${ep.startsWith('/') ? '' : '/'}${ep}`;
        const res = await fetch(url, { method: 'POST', credentials: 'include' });
        if (res.ok) return true;
        if (res.status !== 404) return false; 
      } catch (_) {
        // try next candidate
      }
    }
    return false;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

async function request(path, init = {}, { retry = true } = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;

  const headers = new Headers(init.headers || {});
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');

  const isForm = init.body instanceof FormData || init.body instanceof Blob;
  const isJsonBody = !!init.body && !isForm && typeof init.body === 'object';
  const body = isJsonBody ? JSON.stringify(init.body) : init.body;
  if (isJsonBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let res = await fetch(url, {
    credentials: 'include', 
    ...init,
    headers,
    body,
  });

  if (res.status === 401 && retry) {
    const ok = await refreshOnce();
    if (ok) {
      res = await fetch(url, {
        credentials: 'include',
        ...init,
        headers,
        body,
      });
    }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(text || `HTTP ${res.status} ${res.statusText}`);
    err.status = res.status;
    throw err;
  }

  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

function isAuthenticated() {
  return true;
}

const apiClient = {
  request,
  get: (p, init) => request(p, { method: 'GET', ...(init || {}) }),
  post: (p, body, init) => request(p, { method: 'POST', body, ...(init || {}) }),
  put: (p, body, init) => request(p, { method: 'PUT', body, ...(init || {}) }),
  patch: (p, body, init) => request(p, { method: 'PATCH', body, ...(init || {}) }),
  delete: (p, init) => request(p, { method: 'DELETE', ...(init || {}) }),

  isAuthenticated,
  async getCurrentUser() {
  // Call the single configured endpoint; avoid duplicate probes
  return request(ME_ENDPOINT, { method: 'GET' });
  },

  async logout() {
  const candidates = ['/User/Logout', '/Auth/Logout', '/Account/Logout', '/auth/logout'];
    for (const ep of candidates) {
      try { await request(ep, { method: 'POST' }); return; }
      catch (e) { if (e.status && e.status !== 404) throw e; }
    }
  },
};

export default apiClient;