import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  MenuItem,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  LocationOn,
  Route,
  EventSeat,
  Note,
  Schedule,
  Search,
  MyLocation
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { toast } from 'react-toastify';
import { AuthContext } from "../context/AuthContext.jsx";
import { loadGoogleMapsApi } from '../utils/googleMapsLoader.jsx';
import apiClient from '../utils/apiClient';

const OfferRideSchema = Yup.object().shape({
  startLocation: Yup.string()
    .required('Start location is required'),
  endLocation: Yup.string()
    .required('End location is required'),
  route: Yup.string()
    .required('Route description is required'),
  departureTime: Yup.date()
    .required('Departure time is required')
    .min(new Date(), 'Departure time must be in the future'),
  totalSeats: Yup.number()
    .required('Total seats is required')
    .integer('Must be a whole number')
    .min(1, 'Must have at least 1 seat')
    .max(10, 'Maximum 10 seats allowed'),
  additionalNotes: Yup.string()
});

const OfferRide = () => {
  const navigate = useNavigate();
  const { user: _USER } = useContext(AuthContext);
  const [submitError, setSubmitError] = useState('');
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [mapError, setMapError] = useState('');
  const endLocationInputRef = useRef(null);
  const placeAutocompleteInstanceRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState('');

  // Improved Google Maps API Loading using the singleton loader
  useEffect(() => {
    // Clear any previous errors
    setMapError('');
    
    const initializeMapsApi = async () => {
      try {
        await loadGoogleMapsApi();
        setGoogleMapsLoaded(true);
      } catch (error) {
        console.error("Error loading Google Maps API:", error);
        setMapError('Error loading map services: ' + error.message);
      }
    };
    
    initializeMapsApi();
  }, []);

  // Places Autocomplete initialization
  useEffect(() => {
    if (!googleMapsLoaded || !endLocationInputRef.current) {
      return;
    }
    
    let autocompleteInstance = null;
    
    try {
      // Check if Google Maps and Places API are properly loaded
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        throw new Error('Google Maps Places library not loaded correctly');
      }
      
      // Use standard Autocomplete instead of PlaceAutocompleteElement
      autocompleteInstance = new window.google.maps.places.Autocomplete(
        endLocationInputRef.current,
        { 
          types: ['geocode'],  // Limit to addresses
          fields: ['formatted_address', 'geometry', 'name', 'place_id']
        }
      );
      
      // Add place_changed listener
      const listener = autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        
        if (!place.geometry) {
          console.warn("Selected place has no geometry data:", place);
          return;
        }
        
        if (place.formatted_address) {
          // Update our state variable instead of directly calling setFieldValue
          setSelectedLocation(place.formatted_address);
          console.log("Place selected:", place.formatted_address);
        }
      });
      
      console.log("Google Maps Places Autocomplete initialized");
      
      // Store the instance in the ref for cleanup
      placeAutocompleteInstanceRef.current = { instance: autocompleteInstance, listener };
    } catch (error) {
      console.error("Error initializing Places Autocomplete:", error);
      setMapError('Error initializing location search: ' + error.message);
      setGoogleMapsLoaded(false); // Fall back to manual input
    }
    
    // Clean up on unmount or when dependencies change
    return () => {
      if (placeAutocompleteInstanceRef.current && placeAutocompleteInstanceRef.current.listener) {
        // Properly remove the listener to prevent memory leaks
        window.google?.maps?.event?.removeListener(placeAutocompleteInstanceRef.current.listener);
        placeAutocompleteInstanceRef.current = null;
      }
    };
  }, [googleMapsLoaded]);

  // Add this effect to update Formik values when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      const formikForm = document.querySelector('form');
      if (formikForm) {
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'endLocation';
        hiddenInput.value = selectedLocation;
        formikForm.appendChild(hiddenInput);
        
        const event = new Event('change', { bubbles: true });
        hiddenInput.dispatchEvent(event);
      }
    }
  }, [selectedLocation]);

  // Handle setting current location for start location
  const handleSetCurrentLocation = (setFieldValue) => {
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
                setFieldValue('startLocation', results[0].formatted_address);
              } else {
                // Fall back to coordinates if geocoding fails
                setFieldValue('startLocation', `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
              }
              toast.success('Current location set as starting point!');
            });
          } else {
            // Fall back to coordinates if Google Maps isn't loaded
            setFieldValue('startLocation', `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            toast.success('Current location set as starting point!');
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          // Fall back to coordinates
          setFieldValue('startLocation', `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          toast.success('Current location set as starting point!');
        }
      },
      (error) => {
        console.error('Error fetching location:', error);
        toast.error('Failed to fetch current location. Please try again.');
      }
    );
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitError('');
    
    try {
      // Use the apiClient instead of direct API call
      const response = await apiClient.post('/api/rides', values);
      
      if (response.data.success) {
        toast.success('Ride offered successfully!');
        resetForm();
        navigate('/dashboard');
      } else {
        setSubmitError('Failed to create ride offer');
      }
    } catch (err) {
      console.error('Error creating ride:', err);
      setSubmitError(err.response?.data?.message || 'An error occurred while creating your ride');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Offer a Ride
      </Typography>
      <Paper sx={{ p: 3 }} elevation={2}>
        <Typography variant="body1" paragraph>
          Share your ride with other students and earn points!
        </Typography>
        
        {mapError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {mapError}
          </Alert>
        )}
        
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
          <Formik
          initialValues={{
            startLocation: '',
            endLocation: selectedLocation,
            route: '',
            departureTime: new Date(Date.now() + 3600000), // 1 hour from now
            totalSeats: 3,
            additionalNotes: ''
          }}          
          validationSchema={OfferRideSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true} // Allow reinitialization when selectedLocation changes
        >
          {({ isSubmitting, errors, touched, values, setFieldValue }) => (
            <Form>
              <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="startLocation"
                      label="Start Location"
                      fullWidth
                      variant="outlined"
                      error={touched.startLocation && Boolean(errors.startLocation)}
                      helperText={touched.startLocation && errors.startLocation}
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
                                onClick={() => handleSetCurrentLocation(setFieldValue)}
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
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ position: 'relative' }}>
                      <Field
                        as={TextField}
                        name="endLocation"
                        type="hidden"
                      />
                      
                      {!googleMapsLoaded && (
                        <TextField
                          name="endLocationManual"
                          label="End Location"
                          placeholder="Enter destination manually"
                          fullWidth
                          variant="outlined"
                          value={values.endLocation}
                          onChange={(e) => {
                            setFieldValue('endLocation', e.target.value);
                          }}
                          error={touched.endLocation && Boolean(errors.endLocation)}
                          helperText={(touched.endLocation && errors.endLocation) || "Map search unavailable - enter location manually"}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Search color="disabled" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      
                      {googleMapsLoaded && (
                        <TextField
                          inputRef={endLocationInputRef}
                          name="endLocationSearch"
                          label="End Location (Search Map)"
                          placeholder="Search for destination"
                          fullWidth
                          variant="outlined"
                          value={selectedLocation || values.endLocation}
                          onChange={(e) => {
                            setSelectedLocation(e.target.value);
                            setFieldValue('endLocation', e.target.value);
                          }}
                          error={touched.endLocation && Boolean(errors.endLocation)}
                          helperText={touched.endLocation && errors.endLocation}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Search />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="route"
                      label="Route Description"
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={2}
                      error={touched.route && Boolean(errors.route)}
                      helperText={touched.route && errors.route}
                      placeholder="Describe your route, including any major landmarks or streets"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Route />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="Departure Time"
                        value={values.departureTime}
                        onChange={(newValue) => {
                          setFieldValue('departureTime', newValue);
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: touched.departureTime && Boolean(errors.departureTime),
                            helperText: touched.departureTime && errors.departureTime,
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
                  
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="totalSeats"
                      label="Available Seats"
                      type="number"
                      fullWidth
                      variant="outlined"
                      inputProps={{ min: 1, max: 10 }}
                      error={touched.totalSeats && Boolean(errors.totalSeats)}
                      helperText={touched.totalSeats && errors.totalSeats}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventSeat />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="additionalNotes"
                      label="Additional Notes"
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={3}
                      error={touched.additionalNotes && Boolean(errors.additionalNotes)}
                      helperText={touched.additionalNotes && errors.additionalNotes}
                      placeholder="Add any additional information about your ride"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Note />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => navigate('/dashboard')}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                      >
                        {isSubmitting ? 'Submitting...' : 'Offer Ride'}
                      </Button>
                    </Box>
                  </Grid>                </Grid>
              </Form>
            )
          }
        </Formik>
      </Paper>
    </Box>
  );
};

export default OfferRide;