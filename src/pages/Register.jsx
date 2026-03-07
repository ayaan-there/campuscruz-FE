import React, { useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  CircularProgress,
  Alert
} from '@mui/material';
import { AuthContext } from '../context/AuthContext.jsx';

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required'),  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
    .matches(/^[a-zA-Z0-9._%+-]+@(geu\.ac\.in|gehu\.ac\.in)$/, 'Must use geu.ac.in or gehu.ac.in email address'),
  collegeID: Yup.string()
    .required('College ID is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required')
});

const Register = () => {  const [error, setError] = useState('');
  const [showLoginSuggestion, setShowLoginSuggestion] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    // Remove confirmPassword from data sent to server
    const { confirmPassword: _CONFIRM_PASSWORD, ...userData } = values;
    
    try {
      const result = await register(userData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed');
        // Check if this is a duplicate account error
        if (result.suggestLogin) {
          setShowLoginSuggestion(true);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
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
        maxWidth: '500px',
        mx: 'auto',
        p: 2
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          CampusCruz
        </Typography>
        <Typography component="h2" variant="h5" align="center" gutterBottom>
          Register
        </Typography>
          {error && (
          <Alert 
            severity={showLoginSuggestion ? "warning" : "error"} 
            sx={{ mb: 2 }}
            action={
              showLoginSuggestion && (
                <Button 
                  component={RouterLink} 
                  to="/login" 
                  color="inherit" 
                  size="small"
                  variant="outlined"
                >
                  Go to Login
                </Button>
              )
            }
          >
            {error}
          </Alert>
        )}
        
        <Formik
          initialValues={{
            name: '',
            email: '',
            collegeID: '',
            password: '',
            confirmPassword: ''
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, values }) => (
            <Form>
              <Field
                as={TextField}
                name="name"
                label="Full Name"
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                inputProps={{
                  maxLength: 50,
                  'aria-required': 'true'
                }}
              />
              
              <Field
                as={TextField}
                name="email"
                label="College Email"
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email || "Must use a college email from geu.ac.in or gehu.ac.in"}
                inputProps={{
                  type: 'email',
                  'aria-required': 'true'
                }}
              />
              
              <Field
                as={TextField}
                name="collegeID"
                label="College ID"
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.collegeID && Boolean(errors.collegeID)}
                helperText={touched.collegeID && errors.collegeID}
                inputProps={{
                  maxLength: 20,
                  'aria-required': 'true'
                }}
              />
              
              <Field
                as={TextField}
                name="password"
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                inputProps={{
                  'aria-required': 'true'
                }}
              />
              
              {values.password && (
                <Box sx={{ mt: 1, mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Password strength:
                  </Typography>
                  <Box sx={{ 
                    height: 4, 
                    bgcolor: 'grey.200', 
                    borderRadius: 2,
                    mt: 0.5,
                    overflow: 'hidden'
                  }}>
                    <Box sx={{ 
                      height: '100%', 
                      width: `${Math.min(values.password.length * 10, 100)}%`,
                      bgcolor: values.password.length < 6 ? 'error.main' : 
                             values.password.length < 8 ? 'warning.main' : 'success.main',
                      borderRadius: 2
                    }} />
                  </Box>
                </Box>
              )}
              
              <Field
                as={TextField}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
                inputProps={{
                  'aria-required': 'true'
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ mt: 3, mb: 2 }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Register'}
              </Button>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link component={RouterLink} to="/login">
                    Log In
                  </Link>
                </Typography>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default Register;