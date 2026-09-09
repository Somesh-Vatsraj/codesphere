import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-primary">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition-colors">
          Sign In
        </button>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
        </p>
        <p className="text-xs text-center text-gray-400 mt-4">
          Demo: admin@example.com / Admin@12345 &nbsp;|&nbsp; user@example.com / User@12345
        </p>
      </form>
    </div>
  );
}
