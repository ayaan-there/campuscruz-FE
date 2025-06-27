import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Stack,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import {
  DirectionsCar,
  EmojiPeople,
  School,
  NaturePeople,
  AttachMoney,
  Security
} from '@mui/icons-material';

const Home = () => {
  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 10,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                CampusCruz
              </Typography>
              <Typography variant="h5" paragraph>
                The smarter way to get around campus.
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                Connect with students heading your way. Save money, reduce emissions,
                and make new friends through college carpooling.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="secondary"
                  size="large"
                >
                  Sign Up
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  sx={{ color: 'white', borderColor: 'white' }}
                  size="large"
                >
                  Log In
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={6} sx={{ p: 0, overflow: 'hidden', display: { xs: 'none', md: 'block' } }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1516640175543-849c7368499b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Students carpooling"
                  sx={{
                    width: '100%',
                    height: 350,
                    objectFit: 'cover'
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          How It Works
        </Typography>
        <Typography variant="body1" align="center" paragraph sx={{ mb: 4 }}>
          Getting around campus has never been easier
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <DirectionsCar color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Offer a Ride
                </Typography>
                <Typography variant="body1">
                  Heading to campus? Share your journey with fellow students
                  and earn points for each passenger you take.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <EmojiPeople color="secondary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Find a Ride
                </Typography>
                <Typography variant="body1">
                  Need a lift? Browse available rides going your way and request
                  to join a ride that fits your schedule.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <School color="success" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Build Community
                </Typography>
                <Typography variant="body1">
                  Connect with students, build your network, and make the most of
                  your college experience through shared transportation.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 6, mb: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Benefits of CampusCruz
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ mb: 4 }}>
            Why students love our platform
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <AttachMoney color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Save Money
                </Typography>
                <Typography variant="body2">
                  Split gas costs and reduce your transportation expenses
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <NaturePeople color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Go Green
                </Typography>
                <Typography variant="body2">
                  Reduce your carbon footprint with shared transportation
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Security color="error" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Ride Safely
                </Typography>                <Typography variant="body2">
                  Only verified students with GEU/GEHU emails can join
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <School color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Campus Community
                </Typography>
                <Typography variant="body2">
                  Meet new people and build connections on campus
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ mb: 8, textAlign: 'center' }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 2,
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            color: 'white'
          }}
        >
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Ready to start carpooling?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Join CampusCruz today and revolutionize your campus commute.
          </Typography>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            color="secondary"
            size="large"
            sx={{ px: 4, py: 1, fontWeight: 'bold' }}
          >
            Sign Up Now
          </Button>
        </Paper>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'grey.300', py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} CampusCruz - College Ride Sharing Platform
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
