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

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!post) return <div className="text-center py-10">Post not available.</div>;

  return (
    <article className="max-w-3xl mx-auto">
      {/* Featured Image – supports both URL and base64 */}
      {post.image_url ? (
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full rounded-xl mb-6 object-cover max-h-96"
          onError={(e) => {
            // Fallback if image fails to load
            e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
            e.target.onerror = null; // prevent infinite loop
          }}
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No Image
        </div>
      )}

      <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>

      {/* Author & Date */}
      <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mt-2 gap-2">
        <span>{post.author_name || 'Unknown Author'}</span>
        <span>•</span>
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
        {post.updated_at && post.updated_at !== post.created_at && (
          <>
            <span>•</span>
            <span>Updated {new Date(post.updated_at).toLocaleDateString()}</span>
          </>
        )}
        <span>•</span>
        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
          {post.category || 'Uncategorized'}
        </span>
      </div>

      {/* Post Content – HTML rendered safely (trusted source) */}
      <div
        className="mt-6 prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold mb-4">Related Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map(p => (
              <Link
                key={p.id}
                to={`/blog/${p.id}`}
                className="block bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition group"
              >
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-32 object-cover rounded mb-2"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <h4 className="font-semibold group-hover:text-primary transition-colors">
                  {p.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {p.category}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
