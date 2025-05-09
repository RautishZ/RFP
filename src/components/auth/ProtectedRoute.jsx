/**
 * ProtectedRoute component
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { userState } from '../../services/userState';

/**
 * ProtectedRoute component
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = userState.isAuthenticated();
  const userType = userState.getUserType();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If roles are specified and user's role is not included, redirect to dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(userType)) {
    return <Navigate to="/dashboard" />;
  }
  
  // User is authenticated and authorized, render the children
  return children;
};

export default ProtectedRoute;