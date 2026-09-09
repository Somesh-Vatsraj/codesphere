import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost, getPosts } from '../services/api';
import Loading from '../components/Loading';

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSidebar, setLoadingSidebar] = useState(true);
  const [error, setError] = useState('');
  const [showScroll, setShowScroll] = useState(false);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef(null);

  // --- Scroll handler ---
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Main post + related ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const postData = await getPost(id);
        setPost(postData);
        if (postData.category) {
          const all = await getPosts(postData.category);
          const filtered = all.filter(p => p.id !== parseInt(id)).slice(0, 3);
          setRelated(filtered);
        } else {
          setRelated([]);
        }
      } catch (err) {
        console.error('BlogDetail fetch error:', err);
        setError('Post not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // --- Sidebar data ---
  useEffect(() => {
    const fetchSidebar = async () => {
      try {
        const allPosts = await getPosts();
        const catMap = {};
        allPosts.forEach(p => {
          const cat = p.category || 'Uncategorized';
          if (!catMap[cat]) catMap[cat] = 0;
          catMap[cat]++;
        });
        const catList = Object.keys(catMap).map(name => ({ name, count: catMap[name] }));
        setCategories(catList);
        const sorted = allPosts
          .filter(p => p.id !== parseInt(id))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
        setLatestPosts(sorted);
      } catch (err) {
        console.error('Sidebar fetch error:', err);
      } finally {
        setLoadingSidebar(false);
      }
    };
    fetchSidebar();
  }, [id]);

  // --- Add copy buttons to code blocks ---
  useEffect(() => {
    if (!contentRef.current || !post) return;
    const preElements = contentRef.current.querySelectorAll('pre');
    preElements.forEach((pre) => {
      if (pre.querySelector('.copy-code-btn')) return;
      const button = document.createElement('button');
      button.className = 'copy-code-btn absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded transition-colors';
      button.textContent = 'Copy';
      button.setAttribute('aria-label', 'Copy code');
      button.addEventListener('click', () => {
        const code = pre.querySelector('code')?.innerText || pre.innerText;
        navigator.clipboard.writeText(code).then(() => {
          button.textContent = 'Copied!';
          setTimeout(() => { button.textContent = 'Copy'; }, 2000);
        }).catch(() => {
          alert('Failed to copy');
        });
      });
      pre.style.position = 'relative';
      pre.appendChild(button);
    });
  }, [post, contentRef.current]);

  // --- Table of Contents ---
  const headings = post?.content?.match(/<h2[^>]*>(.*?)<\/h2>/g) || [];
  const tocItems = headings.map((h, i) => ({
    id: `heading-${i}`,
    text: h.replace(/<[^>]*>/g, ''),
  }));

  // --- Copy link handler ---
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy link');
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!post) return <div className="text-center py-10">Post not available.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ===== LEFT SIDEBAR: CATEGORIES ===== */}
        <aside className="hidden lg:block lg:col-span-3 order-1">
          <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              📂 Categories
            </h3>
            {loadingSidebar ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ) : categories.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No categories</p>
            ) : (
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat.name}>
                    <Link
                      to={`/?category=${encodeURIComponent(cat.name)}`}
                      className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition-colors group px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <span className="group-hover:underline">{cat.name}</span>
                      <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                        {cat.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link to="/categories" className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1">
                View all categories →
              </Link>
            </div>
          </div>
        </aside>

        {/* ===== CENTER: MAIN POST with white background ===== */}
        <article className="lg:col-span-6 order-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
            {/* Featured Image – full width inside card */}
            <div className="relative -mx-0 sm:mx-0 rounded-none overflow-hidden">
              {post.image_url ? (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-48 sm:h-64 md:h-80 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
                    e.target.onerror = null;
                  }}
                />
              ) : (
                <div className="w-full h-48 sm:h-64 md:h-80 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-gray-400">
                  <span>No Image</span>
                </div>
              )}
            </div>

            {/* Content inside white card */}
            <div className="p-5 sm:p-6 md:p-8">
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                {post.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                  {post.category || 'Uncategorized'}
                </span>
                <span>•</span>
                <span>
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span>•</span>
                <span>{Math.ceil((post.content?.length || 0) / 1000) || 3} min read</span>
                {post.updated_at && post.updated_at !== post.created_at && (
                  <>
                    <span>•</span>
                    <span>Updated {new Date(post.updated_at).toLocaleDateString()}</span>
                  </>
                )}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl mt-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                  {post.author_name?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {post.author_name || 'Unknown Author'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Software Developer</p>
                </div>
              </div>

              {/* Table of Contents */}
              {tocItems.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl mt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📑 Table of Contents</h3>
                  <ul className="space-y-1">
                    {tocItems.map((item, idx) => (
                      <li key={idx}>
                        <a href={`#heading-${idx}`} className="text-primary hover:underline text-sm">
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Post Content */}
              <div
                ref={contentRef}
                className="prose prose-lg dark:prose-invert max-w-none mt-8
                  prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                  prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                  prose-p:text-gray-700 dark:prose-p:text-gray-300
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-code:text-primary prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-xl prose-pre:relative
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
                  prose-ul:list-disc prose-ol:list-decimal
                  prose-img:rounded-xl prose-img:shadow-md
                  [&_pre]:overflow-x-auto
                  [&_code]:text-sm"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Share */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">Share:</span>
                <div className="relative">
                  <button
                    onClick={handleCopy}
                    className="group flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-200"
                    aria-label="Copy link"
                  >
                    {copied ? (
                      <>
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors">Copy Link</span>
                      </>
                    )}
                  </button>
                  {!copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      Copy to clipboard
                    </span>
                  )}
                </div>
              </div>

              {/* Related Posts */}
              {related.length > 0 && (
                <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    📚 Related Posts
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {related.map((p) => (
                      <Link
                        key={p.id}
                        to={`/blog/${p.id}`}
                        className="group block bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-all duration-300 overflow-hidden"
                      >
                        {p.image_url && (
                          <img
                            src={p.image_url}
                            alt={p.title}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <div className="p-4">
                          <span className="text-xs text-primary font-semibold">{p.category}</span>
                          <h4 className="font-semibold mt-1 text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                            {p.title}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </article>

        {/* ===== RIGHT SIDEBAR: LATEST POSTS ===== */}
        <aside className="lg:col-span-3 order-3">
          <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              🔥 Latest Posts
            </h3>
            {loadingSidebar ? (
              <div className="animate-pulse space-y-4">
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ) : latestPosts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No other posts</p>
            ) : (
              <ul className="space-y-4">
                {latestPosts.map(p => (
                  <li key={p.id}>
                    <Link
                      to={`/blog/${p.id}`}
                      className="group flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      {p.image_url && (
                        <img
                          src={p.image_url}
                          alt={p.title}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                          {p.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {new Date(p.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link to="/tutorials" className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1">
                View all tutorials →
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Back to Top */}
      {showScroll && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-secondary transition-colors z-50"
        >
          ⬆
        </button>
      )}

      {/* Mobile categories strip */}
      <div className="lg:hidden mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-gray-900 dark:text-white">
            📂 Categories
          </summary>
          <div className="mt-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            {loadingSidebar ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ) : categories.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No categories</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <Link
                    key={cat.name}
                    to={`/?category=${encodeURIComponent(cat.name)}`}
                    className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    {cat.name} ({cat.count})
                  </Link>
                ))}
              </div>
            )}
          </div>
        </details>
      </div>
    </div>
  );
}
