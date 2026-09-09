import { authenticate, requireAdmin } from './middleware';
import { successResponse, errorResponse } from './utils';

export async function handleGetPosts(request, env) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const auth = await authenticate(request, env);
  const isAdmin = auth && auth.user.role === 'admin';

  let query = `
    SELECT posts.*, users.name as author_name
    FROM posts
    JOIN users ON posts.author_id = users.id
  `;
  const params = [];
  const conditions = [];

  if (!isAdmin) {
    conditions.push('posts.published = 1');
  }
  if (category) {
    conditions.push('posts.category = ?');
    params.push(category);
  }

  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY posts.created_at DESC';

  const { results } = await env.DB.prepare(query).bind(...params).all();
  return successResponse(results);
}

export async function handleGetPost(request, env, id) {
  const auth = await authenticate(request, env);
  const isAdmin = auth && auth.user.role === 'admin';

  let query = `
    SELECT posts.*, users.name as author_name
    FROM posts
    JOIN users ON posts.author_id = users.id
    WHERE posts.id = ?
  `;
  if (!isAdmin) {
    query += ' AND posts.published = 1';
  }
  const post = await env.DB.prepare(query).bind(id).first();
  if (!post) return errorResponse('Post not found', 404);
  return successResponse(post);
}

export async function handleCreatePost(request, env, user) {
  const { title, slug, category, excerpt, content, image_url, published } = await request.json();
  if (!title || !slug || !category || !content) {
    return errorResponse('Missing required fields', 400);
  }

  // Check unique slug
  const existing = await env.DB.prepare('SELECT id FROM posts WHERE slug = ?').bind(slug).first();
  if (existing) return errorResponse('Slug already exists', 400);

  const result = await env.DB.prepare(
    `INSERT INTO posts (title, slug, category, excerpt, content, image_url, author_id, published)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(title, slug, category, excerpt, content, image_url, user.id, published ? 1 : 0).run();

  const post = await env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(result.meta.last_row_id).first();
  return successResponse(post);
}

export async function handleUpdatePost(request, env, id, user) {
  const post = await env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();
  if (!post) return errorResponse('Post not found', 404);
  if (post.author_id !== user.id && user.role !== 'admin') {
    return errorResponse('Forbidden', 403);
  }

  const { title, slug, category, excerpt, content, image_url, published } = await request.json();
  await env.DB.prepare(
    `UPDATE posts SET title = ?, slug = ?, category = ?, excerpt = ?, content = ?, image_url = ?, published = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).bind(title, slug, category, excerpt, content, image_url, published ? 1 : 0, id).run();

  const updated = await env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();
  return successResponse(updated);
}

export async function handleDeletePost(request, env, id, user) {
  const post = await env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();
  if (!post) return errorResponse('Post not found', 404);
  if (post.author_id !== user.id && user.role !== 'admin') {
    return errorResponse('Forbidden', 403);
  }

  await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
  return successResponse({ message: 'Post deleted' });
}

export async function handlePublishPost(request, env, id, user) {
  const post = await env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();
  if (!post) return errorResponse('Post not found', 404);
  if (post.author_id !== user.id && user.role !== 'admin') {
    return errorResponse('Forbidden', 403);
  }

  const { published } = await request.json();
  await env.DB.prepare('UPDATE posts SET published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(published ? 1 : 0, id).run();

  return successResponse({ published });
}

export async function handleAdminStats(request, env) {
  const total = await env.DB.prepare('SELECT COUNT(*) as count FROM posts').first();
  const published = await env.DB.prepare('SELECT COUNT(*) as count FROM posts WHERE published = 1').first();
  const drafts = await env.DB.prepare('SELECT COUNT(*) as count FROM posts WHERE published = 0').first();
  const users = await env.DB.prepare('SELECT COUNT(*) as count FROM users').first();

  return successResponse({
    total: total.count,
    published: published.count,
    drafts: drafts.count,
    users: users.count,
  });
}
