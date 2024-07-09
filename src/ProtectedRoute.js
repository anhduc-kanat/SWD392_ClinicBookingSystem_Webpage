// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const userRole = localStorage.getItem('role');

  // If user role is not found or not allowed, redirect to login
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  // Render the component if user role is allowed
  return element;
};

export default ProtectedRoute;
