import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField,
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Divider,
  Avatar,
  Rating,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Paper,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Skeleton
} from '@mui/material';
import { 
  Search, 
  LocationOn, 
  CalendarMonth, 
  AccessTime,
  DirectionsCar,
  Person,
  AttachMoney,
  MyLocation,
  Schedule,
  Info
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import axios from 'axios';
import { API_URL } from '../config.jsx';
import { toast } from 'react-toastify';
import { loadGoogleMapsApi } from '../utils/googleMapsLoader.jsx';

const FindRide = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rides, setRides] = useState([]);
  const [searchParams, setSearchParams] = useState({
    startLocation: '',
    endLocation: '',
    departureTime: new Date()  // Initialize with current date/time
  });

  const [error, setError] = useState('');
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [mapError, setMapError] = useState('');
  const endLocationInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Google Maps API Loading
  useEffect(() => {
    const initMapsApi = async () => {
      // Clear any previous errors
      setMapError('');
      
      try {
        await loadGoogleMapsApi();
        setGoogleMapsLoaded(true);
      } catch (error) {
        console.error("Error loading Google Maps API:", error);
        setMapError('Error loading map services: ' + error.message);
      }
    };
    
    initMapsApi();
  }, []);

  // Places Autocomplete initialization
  useEffect(() => {
    if (!googleMapsLoaded || !endLocationInputRef.current) {
      return;
    }
    
    try {
      // Initialize autocomplete with specific options
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        endLocationInputRef.current,
        { 
          types: ['geocode'],  // Limit to addresses
          fields: ['formatted_address', 'geometry', 'name', 'place_id']
        }
      );
      
      // Add place_changed listener
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        
        if (!place.geometry) {
          console.warn("Selected place has no geometry data:", place);
          return;
        }
        
        if (place.formatted_address) {
          // Update state directly instead of using Formik
          setSearchParams(prev => ({
            ...prev,
            endLocation: place.formatted_address
          }));
        }
      });
      
      console.log("Google Maps Places Autocomplete initialized");
    } catch (error) {
      console.error("Error initializing Places Autocomplete:", error);
      setMapError('Error initializing location search');
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      if (autocompleteRef.current) {
        autocompleteRef.current.unbindAll();
        autocompleteRef.current = null;
      }
    };
  }, [googleMapsLoaded]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleDateTimeChange = (newDateTime) => {
    setSearchParams(prev => ({ ...prev, departureTime: newDateTime }));
  };

  // Handle setting current location for start location
  const handleSetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    toast.info('Fetching your location...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode to get a human-readable address
          if (window.google && window.google.maps) {
            const geocoder = new window.google.maps.Geocoder();
            const latlng = { lat: latitude, lng: longitude };
            
            geocoder.geocode({ location: latlng }, (results, status) => {
              if (status === 'OK' && results[0]) {
                setSearchParams(prev => ({
                  ...prev,
                  startLocation: results[0].formatted_address
                }));
              } else {
                // Fall back to coordinates if geocoding fails
                setSearchParams(prev => ({
                  ...prev,
                  startLocation: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                }));
              }
              toast.success('Current location set as starting point!');
            });
          } else {
            // Fall back to coordinates if Google Maps isn't loaded
            setSearchParams(prev => ({
              ...prev,
              startLocation: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            }));
            toast.success('Current location set as starting point!');
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          // Fall back to coordinates
          setSearchParams(prev => ({
            ...prev,
            startLocation: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`  // Exact coordinates stored
          }));
          toast.success('Current location set as starting point!');
        }
      },
      (error) => {
        console.error('Error fetching location:', error);
        toast.error('Failed to fetch current location. Please try again.');
      }
    );
  };
  const searchRides = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = {};
      
      if (searchParams.startLocation) {
        params.startLocation = searchParams.startLocation;
      }
      
      if (searchParams.endLocation) {
        params.endLocation = searchParams.endLocation;
      }
      
      if (searchParams.departureTime) {
        params.departureTime = searchParams.departureTime.toISOString();
      }
      
      const response = await axios.get(`${API_URL}/api/rides`, { params });
      
      if (response.data.success) {
        setRides(response.data.rides);
      } else {
        setError('Failed to fetch rides');
      }
    } catch (err) {
      console.error('Error searching rides:', err);
      setError('An error occurred while searching for rides');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);
  // Initial ride search on component mount
  useEffect(() => {
    searchRides();
  }, [searchRides]);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Find a Ride
      </Typography>
      
      {mapError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {mapError}
        </Alert>
      )}
      
      <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              name="startLocation"
              label="From"
              value={searchParams.startLocation}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Use your current location">
                      <IconButton 
                        onClick={handleSetCurrentLocation}
                        edge="end"
                        color="primary"
                        size="small"
                      >
                        <MyLocation />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              name="endLocation"
              label="To (Search Map)"
              value={searchParams.endLocation}
              onChange={handleChange}
              placeholder={googleMapsLoaded ? "Search for destination" : "Enter destination manually"}
              inputRef={endLocationInputRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color={googleMapsLoaded ? "primary" : "disabled"} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Departure Time"
                value={searchParams.departureTime}
                onChange={handleDateTimeChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Schedule />
                        </InputAdornment>
                      ),
                    }
                  }
                }}
                minDateTime={new Date()}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} sm={1} sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="contained"
              onClick={searchRides}
              fullWidth
              disabled={loading}
              sx={{ height: '56px' }}
            >
              {loading ? <CircularProgress size={24} /> : <Search />}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Typography variant="h6" component="h2" gutterBottom>
        Available Rides ({rides.length})
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : rides.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1">
            No rides available matching your search criteria.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search parameters or offer your own ride!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {rides.map((ride) => (
            <Grid item xs={12} sm={6} md={4} key={ride._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={ride.driver.profilePicture} alt={ride.driver.name} />
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="subtitle1">{ride.driver.name}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={ride.driver.averageRating} readOnly size="small" precision={0.5} />
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          {ride.driver.averageRating ? `(${ride.driver.averageRating})` : 'New Driver'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <LocationOn sx={{ color: 'primary.main', mr: 1, mt: 0.5 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {ride.startLocation}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Starting Point
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <LocationOn sx={{ color: 'secondary.main', mr: 1, mt: 0.5 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {ride.endLocation}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Destination
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                      <CalendarMonth sx={{ fontSize: 20, mr: 0.5 }} />
                      <Typography variant="body2">
                        {format(new Date(ride.departureTime), 'MMM d, yyyy')}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTime sx={{ fontSize: 20, mr: 0.5 }} />
                      <Typography variant="body2">
                        {format(new Date(ride.departureTime), 'h:mm a')}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ fontSize: 20, mr: 0.5 }} />
                      <Typography variant="body2">
                        {ride.availableSeats}/{ride.totalSeats} seats
                      </Typography>
                    </Box>
                    
                    {ride.price > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AttachMoney sx={{ fontSize: 20, mr: 0.5 }} />
                        <Typography variant="body2">
                          ${ride.price.toFixed(2)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
                
                <Divider />
                
                <CardActions>
                  <Button 
                    size="small" 
                    variant="contained" 
                    fullWidth
                    onClick={() => navigate(`/rides/${ride._id}`)}
                  >
                    View Details & Join
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default FindRide;