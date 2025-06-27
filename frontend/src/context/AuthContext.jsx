import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios defaults
  useEffect(() => {
    // Set default withCredentials for all requests
    axios.defaults.withCredentials = true;
    
    // Also set token in Authorization header if available (for backward compatibility)
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);
  // Load user from token or session cookie
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts
    
    const loadUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/me`);
        if (res.data.success && isMounted) {
          setUser(res.data.user);
          setIsAuthenticated(true);
          setError(null);
        } else if (isMounted) {
          // Handle case where API returns success: false but not an error
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        if (isMounted) {
          // Only log if it's not a 401 (unauthorized) - that's expected when not logged in
          if (err.response?.status !== 401) {
            console.error('Error loading user:', err);
          }
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Only try to load user if there's a token OR if we're using cookies
    loadUser();
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run once on mount

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, userData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        setError(null);
        return { success: true };
      }    } catch (err) {
      const errorData = err.response?.data;
      setError(
        errorData?.message || 
        'Registration failed. Please try again.'
      );
      return { 
        success: false, 
        error: errorData?.message || 'Registration failed',
        suggestLogin: errorData?.suggestLogin || false,
        duplicateType: errorData?.duplicateType || null
      };
    }
  };

  // Update the login function to work with cookies
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password }, {
        withCredentials: true // Important for cookies
      });
      
      if (res.data.success) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return {
          success: false,
          error: res.data.message || 'Login failed'
        };
      }
    } catch (err) {
      console.error('Login error:', err);
      return {
        success: false,
        error: err.response?.data?.message || 'An error occurred during login'
      };
    } finally {
      setLoading(false);
    }
  };
  // Update the logout function to clear cookies
  const logout = async () => {
    try {
      // Call the logout endpoint to clear the cookie
      await axios.get(`${API_URL}/api/auth/logout`, { withCredentials: true });
    } catch (err) {
      console.error('Logout error:', err);
      // Even if logout fails on server, clear local state
    } finally {
      // Always clear local state regardless of server response
      setUser(null);
      setIsAuthenticated(false);
      setToken(null);
      setError(null);
      
      // Remove from localStorage if you still have any tokens there
      localStorage.removeItem('token');
      
      // Clear axios default headers
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      // Validate inputs client-side before sending to server
      if (userData.name && userData.name.trim().length === 0) {
        return {
          success: false,
          error: 'Name cannot be empty'
        };
      }
      
      if (userData.phoneNumber && !/^\+?[0-9]{10,15}$/.test(userData.phoneNumber.trim())) {
        return {
          success: false,
          error: 'Invalid phone number format'
        };
      }
      
      // Clean the data by trimming strings
      const cleanedData = Object.entries(userData).reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'string' ? value.trim() : value;
        return acc;
      }, {});
      
      console.log('Updating profile with data:', cleanedData); // Debug log
      
      const res = await axios.put(`${API_URL}/api/users/me`, cleanedData, {
        withCredentials: true
      });
      
      if (res.data.success) {
        setUser(res.data.user);
        return { success: true };
      } else {
        return {
          success: false,
          error: res.data.message || 'Failed to update profile'
        };
      }
    } catch (err) {
      console.error('Update profile error:', err);
      
      // Provide more detailed error message
      const errorMessage = err.response?.data?.errors ? 
        err.response.data.errors.map(e => e.msg).join(', ') :
        err.response?.data?.message || 
        'An error occurred while updating profile';
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};