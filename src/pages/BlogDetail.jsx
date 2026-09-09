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
        const all = await getPosts(postData.category);
        setRelated(all.filter(p => p.id !== parseInt(id)).slice(0, 3));
      } catch (err) {
        setError('Post not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!post) return <div className="text-center">Post not available.</div>;

  return (
    <article className="max-w-3xl mx-auto">
      {post.image_url && (
        <img src={post.image_url} alt={post.title} className="w-full rounded-xl mb-6" />
      )}
      <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
        <span>{post.author_name}</span>
        <span className="mx-2">•</span>
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
        {post.updated_at !== post.created_at && (
          <>
            <span className="mx-2">•</span>
            <span>Updated {new Date(post.updated_at).toLocaleDateString()}</span>
          </>
        )}
      </div>
      <div className="mt-6 prose dark:prose-invert max-w-none">
        {/* Render content as HTML; sanitize if using Markdown */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="mt-12">
          <h3 className="text-2xl font-bold mb-4">Related Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map(p => (
              <Link key={p.id} to={`/blog/${p.id}`} className="block bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition">
                <h4 className="font-semibold">{p.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{p.category}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
