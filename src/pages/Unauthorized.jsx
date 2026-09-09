import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-red-500">403 – Unauthorized</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">You do not have permission to view this page.</p>
      <Link to="/" className="text-primary hover:underline mt-4 inline-block">Return Home</Link>
    </div>
  );
}
