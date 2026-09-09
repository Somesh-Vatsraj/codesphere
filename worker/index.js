import { handleAuth, handleRegister, handleLogin, handleLogout, handleMe } from './auth';
import { handleGetPosts, handleGetPost, handleCreatePost, handleUpdatePost, handleDeletePost, handlePublishPost, handleAdminStats } from './posts';
import { handleGetUsers, handleUpdateUserRole, handleDeleteUser } from './users';
import { authenticate, requireAdmin } from './middleware';
import { corsHeaders, handleOptions, errorResponse, successResponse } from './utils';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return handleOptions(request);
    }

    // API routes
    if (path.startsWith('/api')) {
      // Auth
      if (path === '/api/auth/register' && method === 'POST') {
        return handleRegister(request, env);
      }
      if (path === '/api/auth/login' && method === 'POST') {
        return handleLogin(request, env);
      }
      if (path === '/api/auth/logout' && method === 'POST') {
        return handleLogout(request, env);
      }
      if (path === '/api/auth/me' && method === 'GET') {
        return handleMe(request, env);
      }

      // Posts (public)
      if (path === '/api/posts' && method === 'GET') {
        return handleGetPosts(request, env);
      }
      if (path.match(/^\/api\/posts\/\d+$/) && method === 'GET') {
        const id = path.split('/').pop();
        return handleGetPost(request, env, id);
      }

      // Posts (authenticated & admin)
      if (path === '/api/posts' && method === 'POST') {
        const auth = await authenticate(request, env);
        if (!auth) return errorResponse('Unauthorized', 401);
        return handleCreatePost(request, env, auth.user);
      }
      if (path.match(/^\/api\/posts\/\d+$/) && method === 'PUT') {
        const auth = await authenticate(request, env);
        if (!auth) return errorResponse('Unauthorized', 401);
        const id = path.split('/').pop();
        return handleUpdatePost(request, env, id, auth.user);
      }
      if (path.match(/^\/api\/posts\/\d+$/) && method === 'DELETE') {
        const auth = await authenticate(request, env);
        if (!auth) return errorResponse('Unauthorized', 401);
        const id = path.split('/').pop();
        return handleDeletePost(request, env, id, auth.user);
      }
      if (path.match(/^\/api\/posts\/\d+\/publish$/) && method === 'PATCH') {
        const auth = await authenticate(request, env);
        if (!auth) return errorResponse('Unauthorized', 401);
        const id = path.split('/')[3];
        return handlePublishPost(request, env, id, auth.user);
      }

      // Admin stats
      if (path === '/api/admin/stats' && method === 'GET') {
        const auth = await authenticate(request, env);
        if (!auth || auth.user.role !== 'admin') return errorResponse('Forbidden', 403);
        return handleAdminStats(request, env);
      }

      // Admin users
      if (path === '/api/admin/users' && method === 'GET') {
        const auth = await authenticate(request, env);
        if (!auth || auth.user.role !== 'admin') return errorResponse('Forbidden', 403);
        return handleGetUsers(request, env);
      }
      if (path.match(/^\/api\/admin\/users\/\d+\/role$/) && method === 'PUT') {
        const auth = await authenticate(request, env);
        if (!auth || auth.user.role !== 'admin') return errorResponse('Forbidden', 403);
        const id = path.split('/')[4];
        return handleUpdateUserRole(request, env, id);
      }
      if (path.match(/^\/api\/admin\/users\/\d+$/) && method === 'DELETE') {
        const auth = await authenticate(request, env);
        if (!auth || auth.user.role !== 'admin') return errorResponse('Forbidden', 403);
        const id = path.split('/')[4];
        return handleDeleteUser(request, env, id);
      }

      return errorResponse('Not Found', 404);
    }

    // Fallback (static assets handled by React)
    return new Response('Not Found', { status: 404 });
  },
};
