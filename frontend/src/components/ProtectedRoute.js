import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path if needed

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth(); // Get user from AuthContext

  if (!user || user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
