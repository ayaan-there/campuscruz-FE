import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { Edit, Save, Person, Badge, Email, Phone } from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';
import apiClient from '../utils/apiClient';

const ProfileSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required'),
  phoneNumber: Yup.string()
    .matches(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
});

const Profile = () => {
  const { user, updateProfile, isAuthenticated } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rideStats, setRideStats] = useState({
    totalRides: 0,
    offeredRides: 0,
    joinedRides: 0
  });

  // Fetch user ride statistics
  useEffect(() => {
    const fetchRideStats = async () => {
      if (!user || !isAuthenticated) return;
      
      try {
        const response = await apiClient.get('/api/users/me/stats');
        if (response.data.success) {
          setRideStats(response.data.stats);
        }
      } catch (err) {
        console.error('Error fetching ride stats:', err);
        // Don't show toast to avoid error fatigue
      }
    };

    if (user && isAuthenticated) {
      fetchRideStats();
    }
  }, [user, isAuthenticated]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setError('');
    
    try {
      // Clean up the values before submission
      const updatedValues = {
        name: values.name.trim(),
        phoneNumber: values.phoneNumber ? values.phoneNumber.trim() : '',
        profilePicture: values.profilePicture ? values.profilePicture.trim() : '',
      };
      
      console.log('Submitting profile update:', updatedValues); // Debug log
      
      const result = await updateProfile(updatedValues);
      
      if (result.success) {
        toast.success('Profile updated successfully!');
        setEditing(false);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* User Profile Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2">
                Profile Information
              </Typography>
              {!editing ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : null}
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {!editing ? (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    src={user.profilePicture}
                    alt={user.name}
                    sx={{ width: 100, height: 100, mr: 3 }}
                  />
                  <Box>
                    <Typography variant="h5">{user.name}</Typography>
                    <Typography variant="body1" color="text.secondary">
                      {user.role === 'admin' ? 'Administrator' : 'Student'}
                    </Typography>
                  </Box>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Email sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Badge sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          College ID
                        </Typography>
                        <Typography variant="body1">
                          {user.collegeID}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Phone Number
                        </Typography>
                        <Typography variant="body1">
                          {user.phoneNumber || 'Not provided'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Person sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Member Since
                        </Typography>
                        <Typography variant="body1">
                          {new Date(user.joinedDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Formik
                initialValues={{
                  name: user.name || '',
                  phoneNumber: user.phoneNumber || '',
                  profilePicture: user.profilePicture || '',
                }}
                validationSchema={ProfileSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Avatar
                            src={user.profilePicture}
                            alt={user.name}
                            sx={{ width: 100, height: 100, mr: 3 }}
                          />
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Profile Picture
                            </Typography>
                            <Field
                              as={TextField}
                              name="profilePicture"
                              label="Profile Picture URL"
                              variant="outlined"
                              fullWidth
                              error={touched.profilePicture && Boolean(errors.profilePicture)}
                              helperText={touched.profilePicture && errors.profilePicture}
                            />
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Field
                          as={TextField}
                          name="name"
                          label="Name"
                          variant="outlined"
                          fullWidth
                          error={touched.name && Boolean(errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="email"
                          label="Email"
                          variant="outlined"
                          fullWidth
                          value={user.email}
                          disabled
                          helperText="Email cannot be changed"
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="collegeID"
                          label="College ID"
                          variant="outlined"
                          fullWidth
                          value={user.collegeID}
                          disabled
                          helperText="College ID cannot be changed"
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Field
                          as={TextField}
                          name="phoneNumber"
                          label="Phone Number"
                          variant="outlined"
                          fullWidth
                          error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                          helperText={touched.phoneNumber && errors.phoneNumber}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button
                          type="button"
                          variant="outlined"
                          onClick={() => setEditing(false)}
                          disabled={isSubmitting || loading}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={isSubmitting || loading ? <CircularProgress size={20} /> : <Save />}
                          disabled={isSubmitting || loading}
                        >
                          Save Changes
                        </Button>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            )}
          </Paper>
        </Grid>
        
        {/* Stats and Points */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              Rewards & Points
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              p: 2,
              backgroundColor: 'primary.light',
              color: 'primary.contrastText',
              borderRadius: 1
            }}>
              <Typography variant="h3" component="div" gutterBottom>
                {user.points}
              </Typography>
              <Typography variant="body1">
                Total Points
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              Earn 5 points for each passenger when you offer a ride, and 1 point when you join a ride!
            </Typography>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              Ride Statistics
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Total Rides
              </Typography>
              <Typography variant="h5">
                {rideStats.totalRides}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Rides Offered
              </Typography>
              <Typography variant="h5">
                {rideStats.offeredRides}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                Rides Joined
              </Typography>
              <Typography variant="h5">
                {rideStats.joinedRides}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
