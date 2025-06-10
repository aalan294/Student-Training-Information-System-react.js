import React from 'react';
import { Navigate } from 'react-router-dom';

const StaffProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('staffToken');
  if (!token) {
    return <Navigate to="/staff/login" replace />;
  }
  return children;
};

export default StaffProtectedRoute; 