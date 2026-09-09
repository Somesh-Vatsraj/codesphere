import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, deletePost, togglePublish, getStats } from '../services/api';
import Loading from '../components/Loading';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      console.log('Fetching dashboard data...');
      const [postsData, statsData] = await Promise.all([
        getPosts(),
        getStats(),
      ]);
      console.log('Posts:', postsData);
      console.log('Stats:', statsData);
      setPosts(postsData);
      setStats(statsData);
      setError('');
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      // Show the actual error message from the server
      setError(`Failed to load dashboard: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData();
    } else if (user) {
      setError('You do not have admin privileges.');
      setLoading(false);
    } else {
      setError('Please log in as admin.');
      setLoading(false);
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(id);
      fetchData();
    } catch (err) {
      alert('Failed to delete post: ' + err.message);
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await togglePublish(id, !currentStatus);
      fetchData();
    } catch (err) {
      alert('Failed to update publish status: ' + err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return (
    <div className="text-center py-10">
      <div className="text-red-500 font-bold text-xl">{error}</div>
      <button 
        onClick={fetchData} 
        className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-secondary"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <Link
          to="/admin/posts/create"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
        >
          + New Post
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Posts</p>
          <p className="text-2xl font-bold">{stats.total || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Published</p>
          <p className="text-2xl font-bold text-green-600">{stats.published || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Drafts</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.drafts || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Users</p>
          <p className="text-2xl font-bold">{stats.users || 0}</p>
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
            {posts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No posts found.</td>
              </tr>
            ) : (
              posts.map(post => (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
