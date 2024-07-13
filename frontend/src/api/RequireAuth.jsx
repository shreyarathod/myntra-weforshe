import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');  // Check for authentication token

  if (!isAuthenticated) {
    return <Navigate to="/login" />;  // Redirect to login if not authenticated
  }

  return children;
};

export default RequireAuth;
