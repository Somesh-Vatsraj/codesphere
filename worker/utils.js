export function corsHeaders(request) {
  const origin = request?.headers?.get('Origin') || '';
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://codesphere.pages.dev',          // अपने Pages domain से बदलें
    'https://codesphere.someshsoftwareengineer-233.workers.dev', // Worker URL
  ];
  const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

export function handleOptions(request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request),
  });
}

export function successResponse(data, extra = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...corsHeaders(extra.request || {}),
    ...(extra.headers || {}),
  };
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers,
  });
}

export function errorResponse(error, status = 400) {
  return new Response(JSON.stringify({ success: false, error }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders({ headers: { get: () => '' } }), // dummy request for CORS
    },
  });
}

export function parseCookies(cookieString) {
  const cookies = {};
  cookieString.split(';').forEach(pair => {
    const [key, value] = pair.trim().split('=');
    if (key) cookies[key] = decodeURIComponent(value || '');
  });
  return cookies;
}

export function generateToken() {
  return crypto.randomUUID() + crypto.randomUUID();
}

export function setCookie(token, expires) {
  return {
    'Set-Cookie': `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Expires=${expires.toUTCString()}; Path=/`,
  };
}

// Password hashing using Web Crypto
export async function hashPassword(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 1000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  return Array.from(new Uint8Array(derived))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function comparePassword(password, hash, salt) {
  const newHash = await hashPassword(password, salt);
  return newHash === hash;
}
