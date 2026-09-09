import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-darkBg border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <Link to="/" className="text-2xl font-bold text-primary">CodeSphere</Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/" className="hover:text-primary">Tutorials</Link>
          <Link to="/" className="hover:text-primary">Categories</Link>
          <Link to="/" className="hover:text-primary">About</Link>
          {user ? (
            <>
              <Link to="/profile" className="hover:text-primary">Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-primary">Dashboard</Link>
              )}
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-primary">Login</Link>
              <Link to="/register" className="hover:text-primary">Register</Link>
            </>
          )}
          <button onClick={toggleTheme} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-darkBg border-t border-gray-200 dark:border-gray-800 p-4 space-y-3">
          <Link to="/" className="block hover:text-primary">Home</Link>
          <Link to="/" className="block hover:text-primary">Tutorials</Link>
          <Link to="/" className="block hover:text-primary">Categories</Link>
          <Link to="/" className="block hover:text-primary">About</Link>
          {user ? (
            <>
              <Link to="/profile" className="block hover:text-primary">Profile</Link>
              {user.role === 'admin' && <Link to="/admin" className="block hover:text-primary">Dashboard</Link>}
              <button onClick={handleLogout} className="block text-red-500 hover:text-red-700">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block hover:text-primary">Login</Link>
              <Link to="/register" className="block hover:text-primary">Register</Link>
            </>
          )}
          <button onClick={toggleTheme} className="block">Toggle Theme</button>
        </div>
      )}
    </nav>
  );
}
