import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Avatar,
  Divider,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  CircularProgress,
  Rating,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  LocationOn,
  DirectionsCar,
  CalendarMonth,
  AccessTime,
  Person,
  EventSeat,
  AttachMoney,
  Star,
  ArrowBack,
  Check,
  Close,
  PendingActions,
} from '@mui/icons-material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL, RIDE_STATUS, PASSENGER_STATUS } from '../config';
import { AuthContext } from '../context/AuthContext';

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  // Fetch ride details
  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/rides/${id}`);
        if (response.data.success) {
          setRide(response.data.ride);
          setError('');
        } else {
          setError('Failed to fetch ride details');
        }
      } catch (err) {
        console.error('Error fetching ride:', err);
        setError(err.response?.data?.message || 'An error occurred while fetching ride details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRideDetails();
  }, [id]);
  
  // Check if user is the driver - fixed to handle null values properly
  const isDriver = ride && user && ride.driver && ride.driver._id === user._id;
  
  // Check if user is a passenger - fixed to handle object structure correctly
  const currentUserAsPassenger = ride?.passengers?.find(
    p => p.user && user && p.user._id === user._id
  );

  // Log values for debugging
  useEffect(() => {
    if (ride && user) {
      console.log('User is driver:', isDriver);
      console.log('User is passenger:', !!currentUserAsPassenger);
      console.log('Ride status:', ride.status);
      console.log('Available seats:', ride.availableSeats);
      console.log('Join button should show:', !isDriver && !currentUserAsPassenger && 
                 ride.status === RIDE_STATUS.SCHEDULED && ride.availableSeats > 0);
    }
  }, [ride, user, isDriver, currentUserAsPassenger]);
  
  // Handle join ride request
  const handleJoinRide = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/rides/${id}/join`, {
        pickupLocation
      }, {
        withCredentials: true // Ensure cookies are sent
      });
      
      if (response.data.success) {
        toast.success('Request to join ride sent successfully!');
        // Update ride data
        setRide(response.data.ride);
        
        // Force notification refresh on the driver's side (if this is implemented)
        // This is just a comment - actual implementation would depend on your backend
        // The backend should handle this via WebSockets or similar real-time tech
      } else {
        toast.error('Failed to request joining ride');
      }
    } catch (err) {
      console.error('Error joining ride:', err);
      toast.error(err.response?.data?.message || 'An error occurred while requesting to join');
    } finally {
      setJoinDialogOpen(false);
    }
  };
  
  // Handle passenger status update (for driver)
  const handlePassengerStatusUpdate = async (passengerId, status) => {
    try {
      const response = await axios.put(`${API_URL}/api/rides/${id}/passengers/${passengerId}`, {
        status
      });
      
      if (response.data.success) {
        toast.success(`Passenger ${status === 'accepted' ? 'accepted' : 'rejected'}`);
        // Update ride data
        setRide(response.data.ride);
      } else {
        toast.error(`Failed to ${status} passenger`);
      }
    } catch (err) {
      console.error('Error updating passenger status:', err);
      toast.error(err.response?.data?.message || 'An error occurred while updating passenger status');
    }
  };
  
  // Handle ride completion (for driver)
  const handleCompleteRide = async () => {
    try {
      const response = await axios.put(`${API_URL}/api/rides/${id}/complete`);
      
      if (response.data.success) {
        toast.success(`Ride completed! You earned ${response.data.pointsEarned} points.`);
        // Update ride data
        setRide(response.data.ride);
      } else {
        toast.error('Failed to complete ride');
      }
    } catch (err) {
      console.error('Error completing ride:', err);
      toast.error(err.response?.data?.message || 'An error occurred while completing the ride');
    }
  };
  
  // Handle rating submission
  const handleRateRide = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/rides/${id}/rate`, {
        rating,
        comment
      });
      
      if (response.data.success) {
        toast.success('Rating submitted successfully!');
        // Update ride data to show rating was submitted
        const updatedRide = { ...ride };
        const passengerIndex = updatedRide.passengers.findIndex(
          p => p.user._id === user._id
        );
        if (passengerIndex !== -1) {
          updatedRide.passengers[passengerIndex].hasRated = true;
          setRide(updatedRide);
        }
      } else {
        toast.error('Failed to submit rating');
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      toast.error(err.response?.data?.message || 'An error occurred while submitting rating');
    } finally {
      setRatingDialogOpen(false);
    }
  };

  // Handle setting current location
  const handleSetCurrentLocation = () => {
    if (!navigator.geolocation) {
      // Changed <p><div>...</div></p> to just <div>...</div>
      return (
        <div className="error-message">
          Geolocation is not supported by your browser.
        </div>
      );
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPickupLocation(`Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);
        toast.success('Current location set successfully!');
      },
      (error) => {
        console.error('Error fetching location:', error);
        toast.error('Failed to fetch current location. Please try again.');
      }
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    // Make sure error messages are not wrapped in paragraph tags
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!ride) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="info">Ride not found.</Alert>
      </Box>
    );
  }
  
  // Count pending requests for badge
  const pendingRequestsCount = ride.passengers.filter(p => p.status === 'pending').length;

  return (
    <Box>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      
      <Typography variant="h4" component="h1" gutterBottom>
        Ride Details
        {ride.status && (
          <Chip 
            label={ride.status.charAt(0).toUpperCase() + ride.status.slice(1)} 
            color={
              ride.status === RIDE_STATUS.SCHEDULED ? 'primary' :
              ride.status === RIDE_STATUS.IN_PROGRESS ? 'secondary' :
              ride.status === RIDE_STATUS.COMPLETED ? 'success' : 'error'
            }
            sx={{ ml: 2 }}
          />
        )}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Ride Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              <DirectionsCar sx={{ mr: 1, verticalAlign: 'middle' }} />
              Ride Information
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex' }}>
                  <LocationOn color="primary" sx={{ mr: 1, mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      From
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {ride.startLocation}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex' }}>
                  <LocationOn color="secondary" sx={{ mr: 1, mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      To
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {ride.endLocation}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex' }}>
                  <CalendarMonth sx={{ mr: 1, mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {format(new Date(ride.departureTime), 'MMMM d, yyyy')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex' }}>
                  <AccessTime sx={{ mr: 1, mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Departure Time
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {format(new Date(ride.departureTime), 'h:mm a')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex' }}>
                  <EventSeat sx={{ mr: 1, mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Available Seats
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {ride.availableSeats} / {ride.totalSeats}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              {ride.price > 0 && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex' }}>
                    <AttachMoney sx={{ mr: 1, mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Price
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        ${ride.price.toFixed(2)} per person
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
            
            {ride.route && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                  Route Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {ride.route}
                </Typography>
              </>
            )}
            
            {ride.additionalNotes && (
              <>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Additional Notes
                </Typography>
                <Typography variant="body1" paragraph>
                  {ride.additionalNotes}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>
        
        {/* Driver Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
              Driver
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                src={ride.driver.profilePicture} 
                alt={ride.driver.name} 
                sx={{ width: 60, height: 60, mr: 2 }}
              />
              <Box>
                <Typography variant="h6">
                  {ride.driver.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={ride.driver.averageRating || 0} precision={0.5} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {ride.driver.averageRating ? 
                      `${ride.driver.averageRating.toFixed(1)} / 5` : 
                      'New Driver'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
          
          {/* Action Buttons */}
          <Paper sx={{ p: 3 }}>
            {isDriver ? (
              // Driver actions
              <>
                <Typography variant="h6" gutterBottom>
                  Driver Actions
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {ride.status === RIDE_STATUS.SCHEDULED && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleCompleteRide}
                      sx={{ mb: 2 }}
                    >
                      Mark as Completed
                    </Button>
                    
                    {/* NEW: Add badge showing pending requests count */}
                    {pendingRequestsCount > 0 && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        startIcon={<PendingActions />}
                        onClick={() => document.getElementById('pending-requests-section').scrollIntoView({ behavior: 'smooth' })}
                      >
                        {pendingRequestsCount} Pending Request{pendingRequestsCount !== 1 ? 's' : ''}
                      </Button>
                    )}
                  </>
                )}
                
                {ride.status === RIDE_STATUS.COMPLETED && (
                  <Typography variant="body2" color="text.secondary">
                    This ride has been completed.
                  </Typography>
                )}
              </>
            ) : (
              // Passenger actions
              <>
                <Typography variant="h6" gutterBottom>
                  Passenger Actions
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {/* Add !isDriver condition to prevent the driver from joining their own ride */}
                {!isDriver && 
                 !currentUserAsPassenger && 
                 ride.status === 'scheduled' && // Use string directly in case RIDE_STATUS isn't defined properly
                 ride.availableSeats > 0 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => setJoinDialogOpen(true)}
                  >
                    Request to Join
                  </Button>
                ) : (
                  !isDriver && !currentUserAsPassenger && (
                    <Typography variant="body2" color="text.secondary">
                      {ride.status !== 'scheduled' ? 
                        "This ride is no longer accepting passengers." : 
                        ride.availableSeats <= 0 ? 
                        "No seats available on this ride." : 
                        "Cannot join this ride."}
                    </Typography>
                  )
                )}
                
                {/* Display message for driver instead of join button */}
                {isDriver && ride.status === RIDE_STATUS.SCHEDULED && (
                  <Typography variant="body2" color="text.secondary">
                    You are the driver of this ride.
                  </Typography>
                )}

                {currentUserAsPassenger && (
                  <>
                    <Typography variant="body1" gutterBottom>
                      Request Status: 
                      <Chip 
                        label={currentUserAsPassenger.status.charAt(0).toUpperCase() + currentUserAsPassenger.status.slice(1)} 
                        color={
                          currentUserAsPassenger.status === PASSENGER_STATUS.PENDING ? 'default' :
                          currentUserAsPassenger.status === PASSENGER_STATUS.ACCEPTED ? 'primary' :
                          currentUserAsPassenger.status === PASSENGER_STATUS.COMPLETED ? 'success' : 'error'
                        }
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    
                    {currentUserAsPassenger.status === PASSENGER_STATUS.COMPLETED && !currentUserAsPassenger.hasRated && (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Star />}
                        fullWidth
                        onClick={() => setRatingDialogOpen(true)}
                        sx={{ mt: 1 }}
                      >
                        Rate this Ride
                      </Button>
                    )}
                    
                    {currentUserAsPassenger.status === PASSENGER_STATUS.COMPLETED && currentUserAsPassenger.hasRated && (
                      <Typography variant="body2" color="text.secondary">
                        You have already rated this ride.
                      </Typography>
                    )}
                  </>
                )}
              </>
            )}
          </Paper>
        </Grid>
        
        {/* NEW: Passengers List with Pending Requests (visible to driver) */}
        {isDriver && ride.passengers.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }} id="pending-requests-section">
              <Typography variant="h6" gutterBottom>
                Passengers ({ride.passengers.length})
                {pendingRequestsCount > 0 && (
                  <Chip 
                    label={`${pendingRequestsCount} Pending`} 
                    color="warning" 
                    size="small" 
                    sx={{ ml: 2 }}
                  />
                )}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                {ride.passengers.map((passenger) => (
                  <Grid item xs={12} sm={6} md={4} key={passenger.user._id}>
                    <Card 
                      sx={{ 
                        border: passenger.status === 'pending' ? 2 : 0, 
                        borderColor: passenger.status === 'pending' ? 'warning.main' : 'transparent'
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src={passenger.user.profilePicture} alt={passenger.user.name} />
                            <Box sx={{ ml: 1 }}>
                              <Typography variant="subtitle1">{passenger.user.name}</Typography>
                              <Chip 
                                label={passenger.status.charAt(0).toUpperCase() + passenger.status.slice(1)} 
                                color={
                                  passenger.status === PASSENGER_STATUS.PENDING ? 'warning' :
                                  passenger.status === PASSENGER_STATUS.ACCEPTED ? 'primary' :
                                  passenger.status === PASSENGER_STATUS.COMPLETED ? 'success' : 'error'
                                }
                                size="small"
                              />
                            </Box>
                          </Box>
                        </Box>
                        
                        {passenger.pickupLocation && (
                          <Box sx={{ mt: 2, mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Pickup Location:
                            </Typography>
                            <Typography variant="body2">
                              {passenger.pickupLocation}
                            </Typography>
                          </Box>
                        )}
                        
                        <Typography variant="body2" color="text.secondary">
                          Requested at:
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {format(new Date(passenger.requestedAt), 'MMM d, yyyy - h:mm a')}
                        </Typography>
                        
                        {passenger.status === PASSENGER_STATUS.PENDING && ride.status === RIDE_STATUS.SCHEDULED && (
                          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<Check />}
                              onClick={() => handlePassengerStatusUpdate(passenger.user._id, 'accepted')}
                              fullWidth
                            >
                              Accept
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Close />}
                              onClick={() => handlePassengerStatusUpdate(passenger.user._id, 'rejected')}
                              fullWidth
                            >
                              Reject
                            </Button>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
      
      {/* Join Ride Dialog */}
      <Dialog open={joinDialogOpen} onClose={() => setJoinDialogOpen(false)}>
        <DialogTitle>Request to Join Ride</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide your pickup location to request joining this ride.
          </DialogContentText>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Pickup Location"
              fullWidth
              variant="outlined"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSetCurrentLocation}
              startIcon={<MyLocationIcon />}
            >
              Use GPS
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJoinDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleJoinRide}
            variant="contained" 
            disabled={!pickupLocation.trim()}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Rate Ride Dialog */}
      <Dialog open={ratingDialogOpen} onClose={() => setRatingDialogOpen(false)}>
        <DialogTitle>Rate this Ride</DialogTitle>
        <DialogContent>
          <DialogContentText>
            How was your ride with {ride.driver.name}?
          </DialogContentText>
          <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <Typography sx={{ mr: 2 }}>Rating:</Typography>
            <Rating
              name="ride-rating"
              value={rating}
              precision={0.5}
              onChange={(e, newValue) => setRating(newValue)}
            />
          </Box>
          <TextField
            label="Comments (optional)"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRatingDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleRateRide}
            variant="contained"
            disabled={!rating}
          >
            Submit Rating
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RideDetails;
