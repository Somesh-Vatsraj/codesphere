import { authenticate } from './middleware';
import { successResponse, errorResponse } from './utils';

export async function handleGetUsers(request, env) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT id, name, email, role, created_at FROM users'
    ).all();
    return successResponse(results);
  } catch (err) {
    console.error('handleGetUsers error:', err);
    return errorResponse('Failed to fetch users', 500);
  }
}

export async function handleUpdateUserRole(request, env, userId) {
  try {
    const { role } = await request.json();
    if (!['admin', 'user'].includes(role)) {
      return errorResponse('Invalid role', 400);
    }

    // Authenticate and ensure the user is an admin
    const auth = await authenticate(request, env);
    if (!auth) return errorResponse('Unauthorized', 401);

    // Prevent self‑demotion
    if (auth.user.id === parseInt(userId)) {
      return errorResponse('Cannot change your own role', 400);
    }

    await env.DB.prepare('UPDATE users SET role = ? WHERE id = ?')
      .bind(role, userId)
      .run();

    return successResponse({ message: 'Role updated' });
  } catch (err) {
    console.error('handleUpdateUserRole error:', err);
    return errorResponse('Failed to update role', 500);
  }
}

export async function handleDeleteUser(request, env, userId) {
  try {
    // Authenticate and ensure the user is an admin
    const auth = await authenticate(request, env);
    if (!auth) return errorResponse('Unauthorized', 401);

    // Prevent self‑deletion
    if (auth.user.id === parseInt(userId)) {
      return errorResponse('Cannot delete yourself', 400);
    }

    await env.DB.prepare('DELETE FROM users WHERE id = ?')
      .bind(userId)
      .run();

    return successResponse({ message: 'User deleted' });
  } catch (err) {
    console.error('handleDeleteUser error:', err);
    return errorResponse('Failed to delete user', 500);
  }
}
