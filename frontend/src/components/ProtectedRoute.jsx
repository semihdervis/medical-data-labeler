import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, allowedRoles, ...rest }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Assuming you store the role in local storage

  if (!token) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;