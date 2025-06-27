import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  People,
  DirectionsCar,
  CheckCircle,
  PendingActions,
  PersonAdd
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import { API_URL } from '../../config';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRides: 0,
    completedRides: 0,
    scheduledRides: 0,
    recentUsers: [],
    recentRides: []
  });
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // Check if user is admin
    if (!user || !user.isAdmin) {
      navigate('/login', { state: { message: 'You must be an admin to access this page.' } });
      return;
    }

    const fetchDashboardStats = async () => {
      try {
        // Use withCredentials to send cookies instead of Authorization header
        const response = await axios.get(`${API_URL}/api/admin/stats`, {
          withCredentials: true
        });
        
        if (response.data.success) {
          setStats(response.data.stats);
        } else {
          setError('Failed to fetch dashboard statistics');
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError(err.response?.data?.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalUsers}
                  </Typography>
                </Box>
                <People fontSize="large" color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'secondary.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                    Total Rides
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalRides}
                  </Typography>
                </Box>
                <DirectionsCar fontSize="large" color="secondary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                    Completed Rides
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.completedRides}
                  </Typography>
                </Box>
                <CheckCircle fontSize="large" color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                    Scheduled Rides
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.scheduledRides}
                  </Typography>
                </Box>
                <PendingActions fontSize="large" color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Users and Rides */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
            <Tab label="Recent Users" />
            <Tab label="Recent Rides" />
          </Tabs>
        </Box>

        {/* Recent Users Tab */}
        <Box role="tabpanel" hidden={tabValue !== 0} sx={{ p: 3 }}>
          {tabValue === 0 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Recently Registered Users</Typography>
                <Button variant="contained" startIcon={<People />} onClick={() => navigate('/admin/users')}>
                  View All Users
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Joined On</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonAdd sx={{ mr: 1, color: 'primary.main' }} />
                            {user.name}
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {format(new Date(user.joinedDate), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            onClick={() => navigate(`/admin/users/${user._id}`)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>

        {/* Recent Rides Tab */}
        <Box role="tabpanel" hidden={tabValue !== 1} sx={{ p: 3 }}>
          {tabValue === 1 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Recent Rides</Typography>
                <Button variant="contained" startIcon={<DirectionsCar />} onClick={() => navigate('/admin/rides')}>
                  View All Rides
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Route</TableCell>
                      <TableCell>Driver</TableCell>
                      <TableCell>Departure Time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentRides.map((ride) => (
                      <TableRow key={ride._id}>
                        <TableCell>
                          {ride.startLocation} → {ride.endLocation}
                        </TableCell>
                        <TableCell>{ride.driver.name}</TableCell>
                        <TableCell>
                          {format(new Date(ride.departureTime), 'MMM d, yyyy - h:mm a')}
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography 
                              variant="body2"
                              sx={{ 
                                color: 
                                  ride.status === 'completed' ? 'success.main' : 
                                  ride.status === 'cancelled' ? 'error.main' : 
                                  'primary.main'
                              }}
                            >
                              {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            onClick={() => navigate(`/admin/rides/${ride._id}`)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
