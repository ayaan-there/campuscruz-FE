import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Home, Error } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
      }}
    >
      <Paper elevation={3} sx={{ p: 5, textAlign: 'center', maxWidth: 500 }}>
        <Error color="error" sx={{ fontSize: 80, mb: 2 }} />
        
        <Typography variant="h4" component="h1" gutterBottom>
          404 - Page Not Found
        </Typography>
        
        <Typography variant="body1" paragraph>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        
        <Button
          component={RouterLink}
          to="/dashboard"
          variant="contained"
          startIcon={<Home />}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;
