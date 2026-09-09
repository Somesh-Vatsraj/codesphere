import { Routes, Route, useEffect } from 'react-router-dom';
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

// Import the actual page components
import Tutorials from './pages/Tutorials';
import Categories from './pages/Categories';
import About from './pages/About';

function App() {
  // 🔍 Diagnostic: log the API base URL to help debug data issues
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';
    console.log('🔗 API Base URL:', apiUrl);
    console.log('ℹ️ If you see no data, check:');
    console.log('  1. Your Worker is running (deployed or wrangler dev)');
    console.log('  2. Your database has published posts (published = 1)');
    console.log('  3. VITE_API_URL is set correctly in your .env / Pages variables');
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

          {/* Full pages */}
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about" element={<About />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin routes */}
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
