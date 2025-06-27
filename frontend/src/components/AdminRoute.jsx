import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { AuthContext } from '../context/AuthContext.jsx';

const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated or not an admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated and admin
  return <Outlet />;
};

export default AdminRoute;
