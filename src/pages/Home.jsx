import { useState, useEffect, useRef } from 'react';
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
  const heroRef = useRef(null);

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

  // Featured posts (first 3 for hero)
  const featuredPosts = posts.slice(0, 3);
  const remainingPosts = posts.slice(3);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center py-20">{error}</div>;

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent dark:from-primary/20 dark:via-secondary/10 dark:to-darkBg py-16 md:py-24"
      >
        {/* Animated background blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Learn to Code.
              <span className="block text-primary">Build Something Amazing.</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
              Practical coding tutorials, web development guides, and programming resources.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="#latest"
                className="px-8 py-3 bg-primary text-white rounded-full shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
              >
                Explore Tutorials
              </Link>
              <Link
                to="#posts"
                className="px-8 py-3 border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-all duration-300"
              >
                Latest Posts
              </Link>
            </div>
          </div>

          {/* Featured Posts Carousel */}
          {featuredPosts.length > 0 && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {featuredPosts.map((post, idx) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="p-4">
                    <span className="text-xs font-semibold text-primary">{post.category}</span>
                    <h3 className="font-bold text-lg mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== CATEGORY FILTER ===== */}
      <div className="container mx-auto px-4 mt-8">
        <CategoryFilter activeCategory={category} onSelect={setCategory} />
      </div>

      {/* ===== POSTS GRID ===== */}
      <section id="posts" className="container mx-auto px-4 py-8">
        {remainingPosts.length === 0 && featuredPosts.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-20">
            No posts found.
          </p>
        ) : (
          <>
            {/* Show all posts (including featured) in a grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <div
                  key={post.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${posts.indexOf(post) * 100}ms` }}
                >
                  <BlogCard post={post} />
                </div>
              ))}
            </div>

            {/* Load More / Pagination (optional) */}
            {posts.length > 6 && (
              <div className="text-center mt-10">
                <button className="px-6 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-colors">
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
