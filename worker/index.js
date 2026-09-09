import { handleRegister, handleLogin, handleLogout, handleMe } from './auth';
import {
  handleGetPosts,
  handleGetPost,
  handleCreatePost,
  handleUpdatePost,
  handleDeletePost,
  handlePublishPost,
  handleAdminStats,
} from './posts';
import { handleGetUsers, handleUpdateUserRole, handleDeleteUser } from './users';
import { authenticate } from './middleware';
import { corsHeaders, handleOptions, errorResponse, successResponse } from './utils';

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      const method = request.method;

      // CORS preflight
      if (method === 'OPTIONS') {
        return handleOptions(request);
      }

      // API routes
      if (path.startsWith('/api')) {
        // ---------- AUTH ----------
        if (path === '/api/auth/register' && method === 'POST') {
          return await handleRegister(request, env);
        }
        if (path === '/api/auth/login' && method === 'POST') {
          return await handleLogin(request, env);
        }
        if (path === '/api/auth/logout' && method === 'POST') {
          return await handleLogout(request, env);
        }
        if (path === '/api/auth/me' && method === 'GET') {
          return await handleMe(request, env);
        }

        // ---------- PUBLIC POSTS ----------
        if (path === '/api/posts' && method === 'GET') {
          return await handleGetPosts(request, env);
        }
        if (path.match(/^\/api\/posts\/\d+$/) && method === 'GET') {
          const id = path.split('/').pop();
          return await handleGetPost(request, env, id);
        }

        // ---------- AUTHENTICATED POSTS (admin or author) ----------
        if (path === '/api/posts' && method === 'POST') {
          const auth = await authenticate(request, env);
          if (!auth) return errorResponse('Unauthorized', 401);
          return await handleCreatePost(request, env, auth.user);
        }
        if (path.match(/^\/api\/posts\/\d+$/) && method === 'PUT') {
          const auth = await authenticate(request, env);
          if (!auth) return errorResponse('Unauthorized', 401);
          const id = path.split('/').pop();
          return await handleUpdatePost(request, env, id, auth.user);
        }
        if (path.match(/^\/api\/posts\/\d+$/) && method === 'DELETE') {
          const auth = await authenticate(request, env);
          if (!auth) return errorResponse('Unauthorized', 401);
          const id = path.split('/').pop();
          return await handleDeletePost(request, env, id, auth.user);
        }
        if (path.match(/^\/api\/posts\/\d+\/publish$/) && method === 'PATCH') {
          const auth = await authenticate(request, env);
          if (!auth) return errorResponse('Unauthorized', 401);
          const id = path.split('/')[3];
          return await handlePublishPost(request, env, id, auth.user);
        }

        // ---------- ADMIN ----------
        if (path === '/api/admin/stats' && method === 'GET') {
          const auth = await authenticate(request, env);
          if (!auth || auth.user.role !== 'admin') return errorResponse('Forbidden', 403);
          return await handleAdminStats(request, env);
        }
        if (path === '/api/admin/users' && method === 'GET') {
          const auth = await authenticate(request, env);
          if (!auth || auth.user.role !== 'admin') return errorResponse('Forbidden', 403);
          return await handleGetUsers(request, env);
        }
        if (path.match(/^\/api\/admin\/users\/\d+\/role$/) && method === 'PUT') {
          const auth = await authenticate(request, env);
          if (!auth || auth.user.role !== 'admin') return errorResponse('Forbidden', 403);
          const id = path.split('/')[4];
          return await handleUpdateUserRole(request, env, id);
        }
        if (path.match(/^\/api\/admin\/users\/\d+$/) && method === 'DELETE') {
          const auth = await authenticate(request, env);
          if (!auth || auth.user.role !== 'admin') return errorResponse('Forbidden', 403);
          const id = path.split('/')[4];
          return await handleDeleteUser(request, env, id);
        }

        return errorResponse('API endpoint not found', 404);
      }

      // If not API, return 404 (React will be served separately)
      return new Response('Not Found', { status: 404 });
    } catch (err) {
      console.error('Unhandled exception in Worker:', err);
      return new Response(
        JSON.stringify({ success: false, error: err.message || 'Internal Server Error' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(request),
          },
        }
      );
    }
  },
};
