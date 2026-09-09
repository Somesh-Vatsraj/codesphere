import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost, getPosts } from '../services/api';
import Loading from '../components/Loading';

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showScroll, setShowScroll] = useState(false);

  // Track scroll for "Back to Top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postData = await getPost(id);
        setPost(postData);

        // Fetch related posts (same category, exclude current)
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

  // Auto‑generate Table of Contents from <h2> headings
  const headings = post?.content?.match(/<h2[^>]*>(.*?)<\/h2>/g) || [];
  const tocItems = headings.map((h, i) => ({
    id: `heading-${i}`,
    text: h.replace(/<[^>]*>/g, ''),
  }));

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!post) return <div className="text-center py-10">Post not available.</div>;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Featured Image – full‑width on mobile, rounded on desktop */}
      <div className="relative -mx-4 sm:mx-0 rounded-none sm:rounded-xl overflow-hidden mb-8">
        {post.image_url ? (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-48 sm:h-64 md:h-96 object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
              e.target.onerror = null;
            }}
          />
        ) : (
          <div className="w-full h-48 sm:h-64 md:h-96 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-gray-400">
            <span>No Image</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
        {post.title}
      </h1>

      {/* Metadata: Category, Date, Reading Time */}
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

      {/* Author Section with Avatar */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl mt-6">
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

      {/* Table of Contents (if there are H2 headings) */}
      {tocItems.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl mt-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📑 Table of Contents</h3>
          <ul className="space-y-1">
            {tocItems.map((item, idx) => (
              <li key={idx}>
                <a
                  href={`#heading-${idx}`}
                  className="text-primary hover:underline text-sm"
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Post Content – with enhanced typography and code styling */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none mt-8
          prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-p:text-gray-700 dark:prose-p:text-gray-300
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-code:text-primary prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-xl
          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
          prose-ul:list-disc prose-ol:list-decimal
          prose-img:rounded-xl prose-img:shadow-md
          [&_pre]:overflow-x-auto
          [&_code]:text-sm"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Social Share Buttons */}
      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <span className="text-sm text-gray-500 dark:text-gray-400">Share:</span>
        <button
          onClick={() =>
            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`,
              '_blank'
            )
          }
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary/20 transition-colors text-lg"
        >
          🐦
        </button>
        <button
          onClick={() =>
            window.open(
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
              '_blank'
            )
          }
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary/20 transition-colors text-lg"
        >
          🔗
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
          }}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary/20 transition-colors text-lg"
        >
          📋
        </button>
      </div>

      {/* Related Posts with Thumbnails */}
      {related.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            📚 Related Posts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((p) => (
              <Link
                key={p.id}
                to={`/blog/${p.id}`}
                className="group block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="p-4">
                  <span className="text-xs text-primary font-semibold">
                    {p.category}
                  </span>
                  <h4 className="font-semibold mt-1 text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                    {p.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back to Top Button */}
      {showScroll && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-secondary transition-colors z-50"
        >
          ⬆
        </button>
      )}
    </article>
  );
}
