import { hashPassword, comparePassword, generateToken, setCookie, parseCookies, successResponse, errorResponse } from './utils';

export async function handleRegister(request, env) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password || password.length < 6) {
      return errorResponse('Invalid input', 400);
    }

    // Check if user exists
    const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
    if (existing) return errorResponse('Email already registered', 400);

    const salt = crypto.randomUUID();
    const hash = await hashPassword(password, salt);

    const result = await env.DB.prepare(
      'INSERT INTO users (name, email, password_hash, salt, role) VALUES (?, ?, ?, ?, ?)'
    ).bind(name, email, hash, salt, 'user').run();

    const user = await env.DB.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?')
      .bind(result.meta.last_row_id).first();

    // Create session
    const token = generateToken();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await env.DB.prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)')
      .bind(user.id, token, expires.toISOString()).run();

    // Determine cookie settings based on environment
    const cookieOptions = getCookieOptions(request);
    return successResponse(user, {
      headers: setCookie(token, expires, cookieOptions),
    });
  } catch (err) {
    console.error('Register error:', err);
    return errorResponse('Registration failed', 500);
  }
}

export async function handleLogin(request, env) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return errorResponse('Email and password required', 400);

    const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
    if (!user) return errorResponse('Invalid credentials', 401);

    const valid = await comparePassword(password, user.password_hash, user.salt);
    if (!valid) return errorResponse('Invalid credentials', 401);

    // Create session
    const token = generateToken();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await env.DB.prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)')
      .bind(user.id, token, expires.toISOString()).run();

    const { password_hash, salt, ...safeUser } = user;
    const cookieOptions = getCookieOptions(request);
    return successResponse(safeUser, {
      headers: setCookie(token, expires, cookieOptions),
    });
  } catch (err) {
    console.error('Login error:', err);
    return errorResponse('Login failed', 500);
  }
}

export async function handleLogout(request, env) {
  try {
    const cookie = parseCookies(request.headers.get('Cookie') || '');
    const token = cookie.auth_token;
    if (token) {
      await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    }
    // Clear cookie with same attributes
    const cookieOptions = getCookieOptions(request);
    return successResponse(null, {
      headers: {
        'Set-Cookie': `auth_token=; HttpOnly; Secure; ${cookieOptions.sameSite}; Max-Age=0; Path=/`,
      },
    });
  } catch (err) {
    console.error('Logout error:', err);
    return errorResponse('Logout failed', 500);
  }
}

export async function handleMe(request, env) {
  try {
    const cookie = parseCookies(request.headers.get('Cookie') || '');
    const token = cookie.auth_token;
    if (!token) return errorResponse('Not authenticated', 401);

    const session = await env.DB.prepare(
      `SELECT sessions.*, users.id, users.name, users.email, users.role, users.created_at
       FROM sessions
       JOIN users ON sessions.user_id = users.id
       WHERE sessions.token = ? AND sessions.expires_at > datetime('now')`
    ).bind(token).first();

    if (!session) return errorResponse('Session expired', 401);

    const { password_hash, salt, ...user } = session;
    return successResponse(user);
  } catch (err) {
    console.error('Me error:', err);
    return errorResponse('Failed to fetch user', 500);
  }
}

// Helper to determine cookie attributes based on request origin
function getCookieOptions(request) {
  const url = new URL(request.url);
  const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  const sameSite = isLocalhost ? 'SameSite=Lax' : 'SameSite=None';
  const secure = isLocalhost ? '' : 'Secure;';
  return { sameSite, secure };
}
