import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/api';

const categories = ['React', 'JavaScript', 'CSS', 'HTML', 'Node.js', 'Python', 'PHP', 'Database'];

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: categories[0],
    excerpt: '',
    content: '',
    image_url: '',   // यह base64 डेटा स्टोर करेगा
    published: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // इमेज फ़ाइल चुनने पर base64 में बदलें
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image_url: reader.result })); // base64 data URL
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      // अगर image_url base64 है तो वही भेजें, नहीं तो खाली स्ट्रिंग
      const postData = { ...form };
      await createPost(postData);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Failed to create post.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-primary mb-6">Create New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        />
        <input
          name="slug"
          placeholder="Slug (e.g., my-awesome-post)"
          value={form.slug}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <textarea
          name="excerpt"
          placeholder="Excerpt (short summary)"
          value={form.excerpt}
          onChange={handleChange}
          rows="2"
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        />
        <textarea
          name="content"
          placeholder="Full content (HTML supported)"
          value={form.content}
          onChange={handleChange}
          rows="8"
          required
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        />

        {/* इमेज अपलोड – फ़ाइल चुनें */}
        <div>
          <label className="block text-sm font-medium mb-1">Featured Image (Upload)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
          {form.image_url && (
            <div className="mt-2">
              <img src={form.image_url} alt="Preview" className="max-h-40 rounded" />
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, image_url: '' }))}
                className="text-red-500 text-sm mt-1"
              >
                Remove Image
              </button>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">या आप सीधे URL भी डाल सकते हैं (नीचे)</p>
          <input
            name="image_url"
            placeholder="या Image URL (https://...)"
            value={form.image_url.startsWith('data:') ? '' : form.image_url}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 mt-1"
          />
        </div>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="published"
            checked={form.published}
            onChange={handleChange}
          />
          <span>Publish immediately</span>
        </label>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}
