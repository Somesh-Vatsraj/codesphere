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
        console.log('Tutorials: Fetching posts...');
        const data = await getPosts();
        console.log('Tutorials: Data received:', data);
        setPosts(data || []);
      } catch (err) {
        console.error('Tutorials: Error fetching posts:', err);
        setError('Failed to load tutorials. Please try again.');
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">📚 All Tutorials</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Explore our collection of coding tutorials and guides.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No tutorials found.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Make sure you have published posts in the database.
          </p>
        </div>
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
