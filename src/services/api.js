const API_BASE = import.meta.env.VITE_API_URL || 'https://codesphere.someshsoftwareengineer-233.workers.dev';

async function fetcher(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error || 'Request failed');
  }
  return json.data;
}

// ---------- AUTH ----------
export const login = (email, password) =>
  fetcher('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const register = (name, email, password) =>
  fetcher('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });

export const logout = () => fetcher('/api/auth/logout', { method: 'POST' });

export const getMe = () => fetcher('/api/auth/me');

// ---------- POSTS ----------
export const getPosts = (category = '') =>
  fetcher(`/api/posts${category ? `?category=${encodeURIComponent(category)}` : ''}`);

export const getPost = (id) => fetcher(`/api/posts/${id}`);

export const createPost = (data) =>
  fetcher('/api/posts', { method: 'POST', body: JSON.stringify(data) });

export const updatePost = (id, data) =>
  fetcher(`/api/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deletePost = (id) =>
  fetcher(`/api/posts/${id}`, { method: 'DELETE' });

export const togglePublish = (id, published) =>
  fetcher(`/api/posts/${id}/publish`, { method: 'PATCH', body: JSON.stringify({ published }) });

// ---------- ADMIN: USERS ----------
export const getUsers = () => fetcher('/api/admin/users');
export const updateUserRole = (userId, role) =>
  fetcher(`/api/admin/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role }) });
export const deleteUser = (userId) =>
  fetcher(`/api/admin/users/${userId}`, { method: 'DELETE' });

// ---------- ADMIN: STATS ----------
export const getStats = () => fetcher('/api/admin/stats');
