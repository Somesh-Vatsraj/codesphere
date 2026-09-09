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
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-darkBg/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <span className="text-3xl">&lt;/&gt;</span>
          <span>CodeSphere</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/tutorials" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
            Tutorials
          </Link>
          <Link to="/categories" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
            Categories
          </Link>
          <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
            About
          </Link>

          {user ? (
            <>
              <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                Profile
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-1.5 text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/register" className="px-4 py-1.5 bg-primary text-white rounded-full hover:bg-secondary transition-colors">
                Register
              </Link>
            </>
          )}

          {/* Theme Toggle – modern pill */}
          <button
            onClick={toggleTheme}
            className="relative w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none"
            aria-label="Toggle theme"
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white dark:bg-primary shadow-md transform transition-transform ${
                theme === 'dark' ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-darkBg/95 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-800/50 p-4 space-y-3 shadow-lg">
          <Link to="/" className="block text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/tutorials" className="block text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
            Tutorials
          </Link>
          <Link to="/categories" className="block text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
            Categories
          </Link>
          <Link to="/about" className="block text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
            About
          </Link>

          {user ? (
            <>
              <Link to="/profile" className="block text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                Profile
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="block text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-600 dark:text-red-400 hover:text-red-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-primary hover:underline">
                Login
              </Link>
              <Link to="/register" className="block text-primary hover:underline">
                Register
              </Link>
            </>
          )}

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
          >
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      )}
    </nav>
  );
}
