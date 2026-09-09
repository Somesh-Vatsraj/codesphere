import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../services/api';
import BlogCard from '../components/BlogCard';
import CategoryFilter from '../components/CategoryFilter';
import Loading from '../components/Loading';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts(category);
        setPosts(data);
      } catch (err) {
        setError('Failed to load posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [category]);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">Learn to Code. Build Something Amazing.</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
          Practical coding tutorials, web development guides, and programming resources.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link to="/" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors">
            Explore Tutorials
          </Link>
          <Link to="/" className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
            Latest Posts
          </Link>
        </div>
      </section>

      {/* Categories */}
      <CategoryFilter activeCategory={category} onSelect={setCategory} />

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => <BlogCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
}
