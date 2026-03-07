import React, { useState, useContext, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Tooltip,
  Badge,
  Divider,
  Container,
  CircularProgress,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  DirectionsCar,
  EmojiPeople,
  Person,
  Logout,
  Dashboard,
  PendingActions
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';
import { API_URL } from '../config';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // Fetch user's ride requests notifications with improved polling and error handling
  useEffect(() => {
    let mounted = true;
    let intervalId = null;
      const fetchNotifications = async () => {
      if (!user || !isAuthenticated) return;
      
      setNotificationsLoading(true);
      try {
        // Add timestamp query parameter to prevent caching
        const timestamp = new Date().getTime();
        const response = await axios.get(
          `${API_URL}/api/users/me/notifications?_t=${timestamp}`, 
          { withCredentials: true }
        );
        
        if (mounted && response.data.success) {
          setNotifications(response.data.notifications);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
        // If we get unauthorized, don't keep trying
        if (err.response?.status === 401) {
          return;
        }
      } finally {
        if (mounted) {
          setNotificationsLoading(false);
        }
      }
    };

    // Initial fetch
    if (user && isAuthenticated) {
      fetchNotifications();
      
      // More frequent polling for better responsiveness (every 10 seconds)
      intervalId = setInterval(fetchNotifications, 10000);
    }
      return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user, isAuthenticated]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleOpenNotificationsMenu = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Handle notification click - navigate to the ride details
  const handleNotificationClick = (rideId) => {
    navigate(`/rides/${rideId}`);
    handleCloseNotificationsMenu();
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo - visible on all screens */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/dashboard"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none'
            }}
          >
            CampusCruz
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem 
                onClick={() => {
                  handleCloseNavMenu();
                  navigate('/dashboard');
                }}
              >
                <Dashboard sx={{ mr: 1 }} />
                <Typography textAlign="center">Dashboard</Typography>
              </MenuItem>
              <MenuItem 
                onClick={() => {
                  handleCloseNavMenu();
                  navigate('/offer-ride');
                }}
              >
                <DirectionsCar sx={{ mr: 1 }} />
                <Typography textAlign="center">Offer Ride</Typography>
              </MenuItem>
              <MenuItem 
                onClick={() => {
                  handleCloseNavMenu();
                  navigate('/find-ride');
                }}
              >
                <EmojiPeople sx={{ mr: 1 }} />
                <Typography textAlign="center">Find Ride</Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Logo for mobile */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/dashboard"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none'
            }}
          >
            CampusCruz
          </Typography>

          {/* Desktop menu items */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={RouterLink}
              to="/dashboard"
              sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center' }}
            >
              <Dashboard sx={{ mr: 0.5 }} />
              Dashboard
            </Button>
            <Button
              component={RouterLink}
              to="/offer-ride"
              sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center' }}
            >
              <DirectionsCar sx={{ mr: 0.5 }} />
              Offer Ride
            </Button>
            <Button
              component={RouterLink}
              to="/find-ride"
              sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center' }}
            >
              <EmojiPeople sx={{ mr: 0.5 }} />
              Find Ride
            </Button>
          </Box>

          {/* Right side - notifications and user menu */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton 
                onClick={handleOpenNotificationsMenu} 
                color="inherit"
                sx={{ mr: 1 }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Menu
              id="notifications-menu"
              anchorEl={anchorElNotifications}
              open={Boolean(anchorElNotifications)}
              onClose={handleCloseNotificationsMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              sx={{
                mt: 1,
                "& .MuiMenu-list": { 
                  width: 300,
                  maxHeight: 400
                }
              }}
            >
              <Typography sx={{ px: 2, py: 1, fontWeight: 'bold' }}>
                Notifications
              </Typography>
              <Divider />
              
              {notificationsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : notifications.length === 0 ? (
                <MenuItem>
                  <Typography>No notifications</Typography>
                </MenuItem>
              ) : (
                notifications.map((notification) => (
                  <MenuItem 
                    key={notification.id} 
                    onClick={() => handleNotificationClick(notification.rideId)}
                    sx={{
                      backgroundColor: notification.read ? 'inherit' : 'rgba(25, 118, 210, 0.08)',
                      whiteSpace: 'normal'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <PendingActions />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.title}
                      secondary={notification.message}
                    />
                  </MenuItem>
                ))
              )}
            </Menu>

            {/* User menu */}
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar 
                  alt={user?.name} 
                  src={user?.profilePicture || "/static/images/avatar/default.jpg"}
                />
              </IconButton>
            </Tooltip>
            
            <Menu
              id="user-menu"
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem 
                onClick={() => {
                  handleCloseUserMenu();
                  navigate('/profile');
                }}
              >
                <Person sx={{ mr: 2 }} />
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              
              {user?.role === 'admin' && (
                <MenuItem 
                  onClick={() => {
                    handleCloseUserMenu();
                    navigate('/admin/dashboard');
                  }}
                >
                  <Dashboard sx={{ mr: 2 }} />
                  <Typography textAlign="center">Admin Dashboard</Typography>
                </MenuItem>
              )}
              
              <Divider />
              
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 2 }} />
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};


export default Navbar;
