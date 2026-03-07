import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Avatar,
  Button,
  Chip,
  Divider,
  Rating
} from '@mui/material';
import {
  LocationOn,
  CalendarMonth,
  AccessTime,
  Person,
  AttachMoney,
  DirectionsCar
} from '@mui/icons-material';
import { format } from 'date-fns';
import { RIDE_STATUS } from '../config';

const RideCard = ({ ride, variant = 'default' }) => {
  const navigate = useNavigate();
  
  // Helper function to get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case RIDE_STATUS.SCHEDULED:
        return 'primary';
      case RIDE_STATUS.IN_PROGRESS:
        return 'secondary';
      case RIDE_STATUS.COMPLETED:
        return 'success';
      case RIDE_STATUS.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Status chip */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="div">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DirectionsCar sx={{ mr: 1 }} />
              Ride
            </Box>
          </Typography>
          {ride.status && (
            <Chip 
              label={ride.status.charAt(0).toUpperCase() + ride.status.slice(1)} 
              color={getStatusColor(ride.status)}
              size="small"
            />
          )}
        </Box>
        
        {/* Driver info - only show if variant is default */}
        {variant === 'default' && ride.driver && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                src={ride.driver.profilePicture} 
                alt={ride.driver.name || 'Driver'}
                sx={{ 
                  width: 40,
                  height: 40,
                  bgcolor: !ride.driver.profilePicture ? 'primary.main' : undefined 
                }}
              >
                {!ride.driver.profilePicture && ride.driver.name ? ride.driver.name.charAt(0).toUpperCase() : <Person />}
              </Avatar>
              <Box sx={{ ml: 1 }}>
                <Typography variant="subtitle1">{ride.driver.name || 'Unknown Driver'}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={ride.driver.averageRating || 0} readOnly size="small" precision={0.5} />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {ride.driver.averageRating ? `(${ride.driver.averageRating})` : 'New Driver'}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider sx={{ my: 1 }} />
          </>
        )}
        
        {/* Locations */}
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
        
        {/* Date and time */}
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
        
        {/* Seats and price */}
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
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default RideCard;