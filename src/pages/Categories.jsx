import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../services/api';
import Loading from '../components/Loading';

const categoryColors = {
  React: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  JavaScript: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  CSS: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  HTML: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  'Node.js': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  Python: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  PHP: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  Database: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};
const categoryIcons = {
  React: '⚛️', JavaScript: '🟨', CSS: '🎨', HTML: '🌐',
  'Node.js': '🟩', Python: '🐍', PHP: '🐘', Database: '🗄️',
};

export default function Categories() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data || []);
      } catch (err) {
        setError('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const categoryMap = {};
  posts.forEach(post => {
    const cat = post.category || 'Uncategorized';
    if (!categoryMap[cat]) categoryMap[cat] = [];
    categoryMap[cat].push(post);
  });

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center py-20">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">📂 Categories</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Browse all posts by category. Click a category to filter posts.</p>
      {Object.keys(categoryMap).length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-20">No categories found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(categoryMap).map(cat => {
            const count = categoryMap[cat].length;
            const colorClass = categoryColors[cat] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
            const icon = categoryIcons[cat] || '📁';
            const examplePost = categoryMap[cat][0];
            return (
              <Link
                key={cat}
                to={`/?category=${encodeURIComponent(cat)}`}
                className="group block bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
              >
                {examplePost?.image_url && (
                  <img
                    src={examplePost.image_url}
                    alt={cat}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{icon}</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${colorClass}`}>{cat}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{count} {count === 1 ? 'post' : 'posts'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 group-hover:text-primary transition-colors">View all →</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
