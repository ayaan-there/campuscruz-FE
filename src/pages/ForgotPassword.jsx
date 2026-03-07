import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { API_URL } from '../config';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
});

const ForgotPassword = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      setMessage('');
      
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, values);
      
      if (response.data.success) {
        setMessage('Password reset email sent! Please check your inbox.');
        setIsSubmitted(true);
      } else {
        setError(response.data.message || 'Failed to send reset email');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '400px',
        mx: 'auto',
        p: 2
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          CampusCruz
        </Typography>
        <Typography component="h2" variant="h5" align="center" gutterBottom>
          Forgot Password
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        
        {!isSubmitted ? (
          <Formik
            initialValues={{
              email: ''
            }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <Field
                  as={TextField}
                  name="email"
                  type="email"
                  label="Email Address"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Email'
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              If an account with that email exists, you'll receive a password reset link shortly.
            </Typography>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setMessage('');
                setError('');
              }}
              variant="outlined"
              sx={{ mb: 2 }}
            >
              Send Another Email
            </Button>
          </Box>
        )}
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link component={RouterLink} to="/login" variant="body2">
            Remember your password? Sign in
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
