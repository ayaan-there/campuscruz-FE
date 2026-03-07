import React, { useContext, useState } from 'react';
import { Box, Typography, Paper, Button, TextField, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';
import { API_URL } from '../config';

const Debug = () => {
  const authContext = useContext(AuthContext);
  const { user: _USER, isAuthenticated: _AUTHENTICATED } = authContext;
  const [apiPath, setApiPath] = useState('/api/users/me');
  const [apiResponse, setApiResponse] = useState('');
  const [error, setError] = useState('');
  
  const testApi = async () => {
    setApiResponse('Loading...');
    setError('');
    
    try {
      const response = await axios.get(`${API_URL}${apiPath}`, {
        withCredentials: true
      });
      setApiResponse(JSON.stringify(response.data, null, 2));
    } catch (err) {
      setError(`Error: ${err.message}\n${err.response ? JSON.stringify(err.response.data, null, 2) : ''}`);
      setApiResponse('');
    }
  };
  
  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Debug Component
        </Typography>
        <Typography variant="body1">
          If you can see this message, React is rendering correctly.
          Check browser console for any errors.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Authentication Status:
        </Typography>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
          {JSON.stringify({
            isAuthenticated: authContext?.isAuthenticated,
            loading: authContext?.loading,
            user: authContext?.user,
            hasToken: Boolean(localStorage.getItem('token'))
          }, null, 2)}
        </pre>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Navigation:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Button variant="outlined" component={Link} to="/">Home</Button>
          <Button variant="outlined" component={Link} to="/login">Login</Button>
          <Button variant="outlined" component={Link} to="/register">Register</Button>
          <Button variant="outlined" component={Link} to="/dashboard">Dashboard</Button>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>API Tester</Typography>
        
        <TextField
          fullWidth
          label="API Path"
          value={apiPath}
          onChange={(e) => setApiPath(e.target.value)}
          margin="normal"
          variant="outlined"
          helperText="Example: /api/users/me/notifications"
        />
        
        <Button
          variant="contained"
          onClick={testApi}
          sx={{ mt: 1, mb: 2 }}
        >
          Test API Call
        </Button>
        
        <Divider sx={{ my: 2 }} />
        
        {error && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="error">Error Response:</Typography>
            <Typography component="pre" sx={{ p: 1, bgcolor: '#fff0f0', borderRadius: 1, overflow: 'auto' }}>
              {error}
            </Typography>
          </Box>
        )}
        
        {apiResponse && (
          <Box>
            <Typography variant="subtitle1">API Response:</Typography>
            <Typography component="pre" sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1, overflow: 'auto' }}>
              {apiResponse}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Debug;
