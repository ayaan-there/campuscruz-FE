import React, { useState } from 'react';
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
  Tooltip,
} from '@mui/material';
import {
  LocationOn,
  Route,
  EventSeat,
  AccessTime,
  Note,
  Schedule,
  MyLocation,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { toast } from 'react-toastify';
import apiClient from '../utils/apiClient';
import { CAMPUS_DESTINATIONS } from '../config.jsx';

const OfferRideSchema = Yup.object().shape({
  startLocation: Yup.string().required('Start location is required'),
  endLocation: Yup.string()
    .oneOf(CAMPUS_DESTINATIONS.map((d) => d.address), 'Please select an approved campus destination')
    .required('Destination is required'),
  route: Yup.string().required('Route description is required'),
  departureTime: Yup.date()
    .required('Departure time is required')
    .min(new Date(), 'Departure time must be in the future'),
  estimatedDurationMinutes: Yup.number()
    .required('Estimated duration is required')
    .integer('Must be a whole number')
    .min(5, 'Minimum duration is 5 minutes')
    .max(300, 'Maximum duration is 300 minutes'),
  totalSeats: Yup.number()
    .required('Total seats is required')
    .integer('Must be a whole number')
    .min(1, 'Must have at least 1 seat')
    .max(10, 'Maximum 10 seats allowed'),
  additionalNotes: Yup.string(),
});

const OfferRide = () => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');

  const handleSetCurrentLocation = (setFieldValue) => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    toast.info('Fetching your location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFieldValue('startLocation', `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        toast.success('Current location set as starting point!');
      },
      () => {
        toast.error('Failed to fetch current location. Please try again.');
      }
    );
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitError('');

    try {
      const response = await apiClient.post('/api/rides', values);

      if (response.data.success) {
        toast.success('Ride offered successfully!');
        resetForm();
        navigate('/dashboard');
      } else {
        setSubmitError('Failed to create ride offer');
      }
    } catch (err) {
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
          Start from anywhere, but destination must be one of the approved college zones.
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <Formik
          initialValues={{
            startLocation: '',
            endLocation: CAMPUS_DESTINATIONS[0].address,
            route: '',
            departureTime: new Date(Date.now() + 3600000),
            estimatedDurationMinutes: 30,
            totalSeats: 3,
            additionalNotes: '',
          }}
          validationSchema={OfferRideSchema}
          onSubmit={handleSubmit}
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
                  <Field
                    as={TextField}
                    name="endLocation"
                    label="College Destination"
                    fullWidth
                    select
                    variant="outlined"
                    error={touched.endLocation && Boolean(errors.endLocation)}
                    helperText={touched.endLocation && errors.endLocation}
                    value={values.endLocation}
                    onChange={(e) => setFieldValue('endLocation', e.target.value)}
                  >
                    {CAMPUS_DESTINATIONS.map((destination) => (
                      <MenuItem key={destination.key} value={destination.address}>
                        {destination.address}
                      </MenuItem>
                    ))}
                  </Field>
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
                    placeholder="Describe your route, including landmarks or streets"
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
                      onChange={(newValue) => setFieldValue('departureTime', newValue)}
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
                          },
                        },
                      }}
                      minDateTime={new Date()}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="estimatedDurationMinutes"
                    label="Estimated Duration (minutes)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    inputProps={{ min: 5, max: 300 }}
                    error={touched.estimatedDurationMinutes && Boolean(errors.estimatedDurationMinutes)}
                    helperText={touched.estimatedDurationMinutes && errors.estimatedDurationMinutes}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTime />
                        </InputAdornment>
                      ),
                    }}
                  />
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
                    placeholder="Any extra details for passengers"
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
                    <Button type="button" variant="outlined" onClick={() => navigate('/dashboard')}>
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
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default OfferRide;
