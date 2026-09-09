import { Link } from 'react-router-dom';

export default function BlogCard({ post }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {post.image_url && (
        <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-5">
        <span className="text-xs font-semibold text-primary uppercase">{post.category}</span>
        <Link to={`/blog/${post.id}`}>
          <h3 className="text-xl font-bold mt-2 hover:text-primary transition-colors">{post.title}</h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">{post.excerpt}</p>
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          <span>{post.author_name || 'Unknown'}</span>
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
