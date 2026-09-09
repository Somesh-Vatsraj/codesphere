import { successResponse, errorResponse } from './utils';

export async function handleGetUsers(request, env) {
  const { results } = await env.DB.prepare('SELECT id, name, email, role, created_at FROM users').all();
  return successResponse(results);
}

export async function handleUpdateUserRole(request, env, userId) {
  const { role } = await request.json();
  if (!['admin', 'user'].includes(role)) {
    return errorResponse('Invalid role', 400);
  }

  // Prevent self‑demotion
  const auth = await authenticate(request, env);
  if (auth.user.id === parseInt(userId)) {
    return errorResponse('Cannot change your own role', 400);
  }

  await env.DB.prepare('UPDATE users SET role = ? WHERE id = ?').bind(role, userId).run();
  return successResponse({ message: 'Role updated' });
}

export async function handleDeleteUser(request, env, userId) {
  // Prevent self‑deletion
  const auth = await authenticate(request, env);
  if (auth.user.id === parseInt(userId)) {
    return errorResponse('Cannot delete yourself', 400);
  }

  await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();
  return successResponse({ message: 'User deleted' });
}
