import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios defaults for cookie-based auth only
  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  // Load user from session cookie on mount
  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/me`);
        if (res.data.success && isMounted) {
          setUser(res.data.user);
          setIsAuthenticated(true);
          setError(null);
        } else if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        if (isMounted) {
          if (err.response?.status !== 401) {
            console.error('Error loading user:', err);
          }
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, userData, {
        withCredentials: true
      });

      if (res.data.success) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        setError(null);
        return { success: true };
      }
    } catch (err) {
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

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password }, {
        withCredentials: true
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

  // Logout user
  const logout = async () => {
    try {
      await axios.get(`${API_URL}/api/auth/logout`, { withCredentials: true });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
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

      const cleanedData = Object.entries(userData).reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'string' ? value.trim() : value;
        return acc;
      }, {});

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
