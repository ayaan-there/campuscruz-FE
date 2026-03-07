import React, { useState, useEffect, useCallback } from 'react';
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
  InputAdornment,
  CircularProgress,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Search,
  LocationOn,
  CalendarMonth,
  AccessTime,
  Person,
  AttachMoney,
  MyLocation,
  Schedule,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import axios from 'axios';
import { API_URL, CAMPUS_DESTINATIONS } from '../config.jsx';
import { toast } from 'react-toastify';

const FindRide = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rides, setRides] = useState([]);
  const [searchParams, setSearchParams] = useState({
    startLocation: '',
    endLocation: '',
    departureTime: new Date(),
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateTimeChange = (newDateTime) => {
    setSearchParams((prev) => ({ ...prev, departureTime: newDateTime }));
  };

  const handleSetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    toast.info('Fetching your location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSearchParams((prev) => ({
          ...prev,
          startLocation: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        }));
        toast.success('Current location set as starting point!');
      },
      () => {
        toast.error('Failed to fetch current location. Please try again.');
      }
    );
  };

  const searchRides = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};

      if (searchParams.startLocation) params.startLocation = searchParams.startLocation;
      if (searchParams.endLocation) params.endLocation = searchParams.endLocation;
      if (searchParams.departureTime) params.date = searchParams.departureTime.toISOString();

      const response = await axios.get(`${API_URL}/api/rides`, {
        params,
        withCredentials: true,
      });

      if (response.data.success) {
        setRides(response.data.rides);
      } else {
        setError('Failed to fetch rides');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while searching for rides');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    searchRides();
  }, [searchRides]);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Find a Ride
      </Typography>

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
                      <IconButton onClick={handleSetCurrentLocation} edge="end" color="primary" size="small">
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
              select
              name="endLocation"
              label="Campus Destination"
              value={searchParams.endLocation}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">Any approved campus destination</MenuItem>
              {CAMPUS_DESTINATIONS.map((destination) => (
                <MenuItem key={destination.key} value={destination.address}>
                  {destination.address}
                </MenuItem>
              ))}
            </TextField>
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
                    },
                  },
                }}
                minDateTime={new Date()}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={1} sx={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="contained" onClick={searchRides} fullWidth disabled={loading} sx={{ height: '56px' }}>
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
          <Typography variant="body1">No rides available matching your search criteria.</Typography>
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
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{ride.startLocation}</Typography>
                      <Typography variant="body2" color="text.secondary">Starting Point</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <LocationOn sx={{ color: 'secondary.main', mr: 1, mt: 0.5 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{ride.endLocation}</Typography>
                      <Typography variant="body2" color="text.secondary">Destination</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                      <CalendarMonth sx={{ fontSize: 20, mr: 0.5 }} />
                      <Typography variant="body2">{format(new Date(ride.departureTime), 'MMM d, yyyy')}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTime sx={{ fontSize: 20, mr: 0.5 }} />
                      <Typography variant="body2">{format(new Date(ride.departureTime), 'h:mm a')}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ fontSize: 20, mr: 0.5 }} />
                      <Typography variant="body2">{ride.availableSeats}/{ride.totalSeats} seats</Typography>
                    </Box>

                    {ride.price > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AttachMoney sx={{ fontSize: 20, mr: 0.5 }} />
                        <Typography variant="body2">${ride.price.toFixed(2)}</Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>

                <Divider />

                <CardActions>
                  <Button size="small" variant="contained" fullWidth onClick={() => navigate(`/rides/${ride._id}`)}>
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
