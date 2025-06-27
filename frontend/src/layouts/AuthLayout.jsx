import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Box, Paper, Container, Typography, Button } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AuthLayout = () => {
  const { isAuthenticated, loading, logout } = useContext(AuthContext);

  // If user is authenticated, show option to logout or continue to dashboard
  if (isAuthenticated && !loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: (theme) => theme.palette.grey[100]
        }}
      >
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Paper
            elevation={6}
            sx={{
              p: { xs: 2, md: 4 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}
            >
              Already Logged In
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
              You are already logged in. Would you like to continue to your dashboard or log out to access the login/signup page?
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button
                variant="contained"
                onClick={() => window.location.href = '/dashboard'}
                sx={{ minWidth: 150 }}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  logout();
                  // Small delay to ensure logout completes
                  setTimeout(() => window.location.reload(), 100);
                }}
                sx={{ minWidth: 150 }}
              >
                Logout & Continue
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: (theme) => theme.palette.grey[100]
      }}
    >
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper
          elevation={6}
          sx={{
            p: { xs: 2, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}
          >
            CampusCruz
          </Typography>
          <Outlet />
        </Paper>
      </Container>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 2 }}
      >
        © {new Date().getFullYear()} CampusCruz - College Ride Sharing Platform
      </Typography>
    </Box>
  );
};

export default AuthLayout;