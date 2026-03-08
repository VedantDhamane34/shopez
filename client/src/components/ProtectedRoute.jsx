import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirects to /login if not authenticated; to / if not admin
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fefcf7', fontFamily: 'Jost, sans-serif', color: '#b4a08a', fontSize: '0.9rem' }}>
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return children;
}
