import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AdminRoute() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="text-center py-10">Loading...</div>;
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/unauthorized" replace />;
}
