const categories = ['All', 'React', 'JavaScript', 'CSS', 'HTML', 'Node.js', 'Python', 'PHP', 'Database'];

export default function CategoryFilter({ activeCategory, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 my-6">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat === 'All' ? '' : cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            (activeCategory === '' && cat === 'All') || activeCategory === cat
              ? 'bg-primary text-white'
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-primary hover:text-white'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
