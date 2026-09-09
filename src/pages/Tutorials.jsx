import { useState, useEffect } from 'react';
import { getPosts } from '../services/api';
import BlogCard from '../components/BlogCard';
import Loading from '../components/Loading';

export default function Tutorials() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data || []);
      } catch (err) {
        setError('Failed to load tutorials.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center py-20">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        📚 All Tutorials
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Explore our collection of coding tutorials and guides.
      </p>
      {posts.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-20">
          No tutorials found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
