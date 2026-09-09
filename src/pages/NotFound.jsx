import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">404 – Page Not Found</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-primary hover:underline mt-4 inline-block">Go Home</Link>
    </div>
  );
}
