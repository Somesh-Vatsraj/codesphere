import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, deletePost, togglePublish } from '../services/api';
import Loading from '../components/Loading';

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [postsData, statsData] = await Promise.all([
        getPosts(),
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, { credentials: 'include' }).then(r => r.json())
      ]);
      setPosts(postsData);
      setStats(statsData.data || {});
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    await deletePost(id);
    fetchData();
  };

  const handleTogglePublish = async (id, currentStatus) => {
    await togglePublish(id, !currentStatus);
    fetchData();
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <Link to="/admin/posts/create" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary">
          + New Post
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Posts</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Published</p>
          <p className="text-2xl font-bold text-green-600">{stats.published}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Drafts</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.drafts}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Users</p>
          <p className="text-2xl font-bold">{stats.users}</p>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {posts.map(post => (
              <tr key={post.id}>
                <td className="px-6 py-4">{post.title}</td>
                <td className="px-6 py-4">{post.category}</td>
                <td className="px-6 py-4">{post.author_name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4">{new Date(post.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 space-x-2">
                  <Link to={`/admin/posts/edit/${post.id}`} className="text-blue-600 hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:underline">Delete</button>
                  <button onClick={() => handleTogglePublish(post.id, post.published)} className="text-primary hover:underline">
                    {post.published ? 'Unpublish' : 'Publish'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
