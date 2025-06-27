import React, { useContext, useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  Tab,
  Tabs,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip
} from '@mui/material';
import { 
  DirectionsCar, 
  EmojiPeople, 
  History, 
  Star, 
  Schedule, 
  AccessTime 
} from '@mui/icons-material';
import apiClient from '../utils/apiClient';
import { format } from 'date-fns';
import { AuthContext } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [tabValue, setTabValue] = useState(0);
  const [upcomingRides, setUpcomingRides] = useState([]);
  const [pastRides, setPastRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    let mounted = true;
    
    const fetchRides = async () => {
      if (!user || !isAuthenticated) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await apiClient.get('/api/rides');
        
        if (!mounted) return;
        
        if (response.data.success) {
          // Filter rides into upcoming and past
          const upcoming = [];
          const past = [];
          
          response.data.rides.forEach(ride => {
            if (ride.status === 'completed' || ride.status === 'cancelled') {
              past.push(ride);
            } else {
              upcoming.push(ride);
            }
          });
          
          setUpcomingRides(upcoming);
          setPastRides(past);
        }
      } catch (err) {
        if (!mounted) return;
        console.error('Error fetching rides:', err);
        
        // Only show error toast for non-auth errors to avoid spamming
        if (err.response?.status !== 401) {
          toast.error('Error loading your rides. Please try again.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    fetchRides();
    
    return () => {
      mounted = false;
    };
  }, [user, isAuthenticated]);

  const renderRideStatus = (status) => {
    switch (status) {
      case 'scheduled':
        return <Chip size="small" label="Scheduled" color="primary" />;
      case 'in-progress':
        return <Chip size="small" label="In Progress" color="secondary" />;
      case 'completed':
        return <Chip size="small" label="Completed" color="success" />;
      case 'cancelled':
        return <Chip size="small" label="Cancelled" color="error" />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Points: {user?.points || 0}
        </Typography>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              backgroundColor: '#f0f7ff'
            }}
            elevation={2}
          >
            <Typography variant="h5" gutterBottom>
              Offer a Ride
            </Typography>
            <Typography variant="body1" paragraph>
              Going to campus? Offer seats to fellow students and earn points!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DirectionsCar />}
              component={RouterLink}
              to="/offer-ride"
              sx={{ alignSelf: 'flex-start' }}
            >
              Offer Ride
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              backgroundColor: '#fff4e5'
            }}
            elevation={2}
          >
            <Typography variant="h5" gutterBottom>
              Find a Ride
            </Typography>
            <Typography variant="body1" paragraph>
              Need a lift? Find available rides from other students heading to campus.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<EmojiPeople />}
              component={RouterLink}
              to="/find-ride"
              sx={{ alignSelf: 'flex-start' }}
            >
              Find Ride
            </Button>
          </Paper>
        </Grid>
      </Grid>
      
      <Paper sx={{ mb: 4 }} elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="ride history tabs">
            <Tab icon={<Schedule />} label="Upcoming Rides" />
            <Tab icon={<History />} label="Past Rides" />
          </Tabs>
        </Box>
        
        <Box sx={{ p: 2 }}>
          {/* Upcoming Rides Tab */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Upcoming Rides
              </Typography>
              
              {loading ? (
                <Typography>Loading rides...</Typography>
              ) : upcomingRides.length === 0 ? (
                <Typography>No upcoming rides found.</Typography>
              ) : (
                <Grid container spacing={2}>
                  {upcomingRides.map((ride) => (
                    <Grid item xs={12} sm={6} md={4} key={ride._id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="h6" component="div">
                              {ride.startLocation} to {ride.endLocation}
                            </Typography>
                            {renderRideStatus(ride.status)}
                          </Box>
                          
                          <Typography color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTime fontSize="small" sx={{ mr: 1 }} />
                            {format(new Date(ride.departureTime), 'MMM d, yyyy - h:mm a')}
                          </Typography>
                          
                          <Divider sx={{ my: 1 }} />
                          
                          <Typography variant="body2">
                            {ride.isDriver ? 'You are offering this ride' : 'You are joining this ride'}
                          </Typography>
                          
                          <Typography variant="body2">
                            Seats: {ride.availableSeats}/{ride.totalSeats} available
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button 
                            size="small" 
                            component={RouterLink} 
                            to={`/rides/${ride._id}`}
                          >
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
          
          {/* Past Rides Tab */}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Past Rides
              </Typography>
              
              {loading ? (
                <Typography>Loading rides...</Typography>
              ) : pastRides.length === 0 ? (
                <Typography>No past rides found.</Typography>
              ) : (
                <Grid container spacing={2}>
                  {pastRides.map((ride) => (
                    <Grid item xs={12} sm={6} md={4} key={ride._id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="h6" component="div">
                              {ride.startLocation} to {ride.endLocation}
                            </Typography>
                            {renderRideStatus(ride.status)}
                          </Box>
                          
                          <Typography color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTime fontSize="small" sx={{ mr: 1 }} />
                            {format(new Date(ride.departureTime), 'MMM d, yyyy - h:mm a')}
                          </Typography>
                          
                          <Divider sx={{ my: 1 }} />
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Star sx={{ color: 'gold', mr: 0.5 }} fontSize="small" />
                            <Typography variant="body2">
                              {ride.isDriver 
                                ? `Points earned: ${(ride.passengers?.filter(p => p.status === 'completed').length || 0) * 5}` 
                                : (ride.hasRated ? 'You rated this ride' : 'Rate this ride')}
                            </Typography>
                          </Box>
                        </CardContent>
                        <CardActions>
                          <Button 
                            size="small" 
                            component={RouterLink} 
                            to={`/rides/${ride._id}`}
                          >
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;
