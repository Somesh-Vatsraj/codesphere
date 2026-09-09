import { parseCookies } from './utils';

export async function authenticate(request, env) {
  const cookie = parseCookies(request.headers.get('Cookie') || '');
  const token = cookie.auth_token;
  if (!token) return null;

  const session = await env.DB.prepare(
    `SELECT sessions.*, users.id, users.name, users.email, users.role
     FROM sessions
     JOIN users ON sessions.user_id = users.id
     WHERE sessions.token = ? AND sessions.expires_at > datetime('now')`
  ).bind(token).first();

  if (!session) return null;

  return { user: { id: session.id, name: session.name, email: session.email, role: session.role } };
}

export async function requireAdmin(request, env) {
  const auth = await authenticate(request, env);
  if (!auth || auth.user.role !== 'admin') {
    return null;
  }
  return auth;
}
