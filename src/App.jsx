import { Routes, Route } from 'react-router-dom';
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

// 🆕 Temporary placeholder components for new pages
function Tutorials() {
  return <div className="container mx-auto px-4 py-12"><h1 className="text-3xl font-bold">All Tutorials</h1><p>Coming soon...</p></div>;
}
function Categories() {
  return <div className="container mx-auto px-4 py-12"><h1 className="text-3xl font-bold">Categories</h1><p>Browse posts by category.</p></div>;
}
function About() {
  return <div className="container mx-auto px-4 py-12"><h1 className="text-3xl font-bold">About CodeSphere</h1><p>Learn to code with practical tutorials.</p></div>;
}

function App() {
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
          
          {/* 🆕 New Routes */}
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
