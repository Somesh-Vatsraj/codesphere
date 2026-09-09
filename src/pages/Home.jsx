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
  const [searchTerm, setSearchTerm] = useState('');
  const heroRef = useRef(null);

  // ---------- TYPING ANIMATION STATE ----------
  const fullText1 = 'Learn to Code.';
  const fullText2 = 'Build Something Amazing.';
  const [displayText1, setDisplayText1] = useState('');
  const [displayText2, setDisplayText2] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const typingTimerRef = useRef(null);
  const cursorTimerRef = useRef(null);

  useEffect(() => {
    let charIndex1 = 0;
    let charIndex2 = 0;
    let phase = 0;

    const typeNextChar = () => {
      if (phase === 0) {
        if (charIndex1 < fullText1.length) {
          setDisplayText1(fullText1.slice(0, charIndex1 + 1));
          charIndex1++;
          typingTimerRef.current = setTimeout(typeNextChar, 80);
        } else {
          phase = 1;
          typingTimerRef.current = setTimeout(() => {
            phase = 2;
            typeNextChar();
          }, 600);
        }
      } else if (phase === 2) {
        if (charIndex2 < fullText2.length) {
          setDisplayText2(fullText2.slice(0, charIndex2 + 1));
          charIndex2++;
          typingTimerRef.current = setTimeout(typeNextChar, 80);
        } else {
          phase = 3;
          setIsTypingComplete(true);
        }
      }
    };

    typingTimerRef.current = setTimeout(typeNextChar, 300);
    cursorTimerRef.current = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearTimeout(typingTimerRef.current);
      clearInterval(cursorTimerRef.current);
    };
  }, []);

  // ---------- DATA FETCHING ----------
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

  // ---------- SEARCH FILTER ----------
  const filteredPosts = posts.filter(post => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      post.title.toLowerCase().includes(term) ||
      post.category.toLowerCase().includes(term) ||
      post.excerpt?.toLowerCase().includes(term) ||
      post.content?.toLowerCase().includes(term)
    );
  });

  const featuredPosts = filteredPosts.slice(0, 3);
  const remainingPosts = filteredPosts.slice(3);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center py-20">{error}</div>;

  return (
    <div>
      {/* ===== HERO SECTION – with more rounded background ===== */}
      <section
        ref={heroRef}
        className="relative overflow-hidden rounded-3xl mx-4 md:mx-8 my-4 bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent dark:from-primary/30 dark:via-secondary/20 dark:to-darkBg py-16 md:py-24 shadow-2xl"
      >
        {/* Animated background blobs – larger and more diffuse */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-10 w-80 h-80 bg-primary/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl animate-pulse delay-2000" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              <span>
                {displayText1}
                {!isTypingComplete && displayText1 === fullText1 && (
                  <span className={`inline-block w-0.5 h-8 md:h-12 bg-primary ml-1 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`} />
                )}
              </span>
              <br />
              <span className="text-primary">
                {displayText2}
                {(!isTypingComplete || displayText2 === fullText2) && (
                  <span className={`inline-block w-0.5 h-8 md:h-12 bg-primary ml-1 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`} />
                )}
              </span>
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

            {/* Hero Search */}
            <div className="relative max-w-md mx-auto mt-8">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition shadow-md"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              )}
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

      {/* ===== CATEGORY FILTER + SEARCH ===== */}
      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <CategoryFilter activeCategory={category} onSelect={setCategory} />

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===== POSTS GRID ===== */}
      <section id="posts" className="container mx-auto px-4 py-8">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchTerm ? 'No posts match your search.' : 'No posts found.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-primary hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <div
                  key={post.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${filteredPosts.indexOf(post) * 100}ms` }}
                >
                  <BlogCard post={post} />
                </div>
              ))}
            </div>

            {filteredPosts.length > 6 && (
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
