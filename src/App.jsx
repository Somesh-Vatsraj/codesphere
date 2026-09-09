import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';    // ✅ यह सही है
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BlogDetail from './pages/BlogDetail';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Users from './pages/Users';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// ----- Inline components (no external files) -----
function Tutorials() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">📚 All Tutorials</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-4">Coming soon – create <code>src/pages/Tutorials.jsx</code> to display real data.</p>
    </div>
  );
}

function Categories() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">📂 Categories</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-4">Browse posts by category – coming soon.</p>
    </div>
  );
}

function About() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">About CodeSphere</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-4">Learn to code with practical tutorials.</p>
    </div>
  );
}

function App() {
  // Diagnostic log
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';
    console.log('🔗 API Base URL:', apiUrl);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-lightBg dark:bg-darkBg text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about" element={<About />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/posts/create" element={<CreatePost />} />
            <Route path="/admin/posts/edit/:id" element={<EditPost />} />
            <Route path="/admin/users" element={<Users />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
