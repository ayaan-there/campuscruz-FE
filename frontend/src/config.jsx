// Configuration constants for the application

// Use environment variable for API URL, fallback to production URL
export const API_URL = import.meta.env.VITE_API_URL || 'https://campuscruz.onrender.com';

// Google Maps API Key
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Make sure these status values match exactly what comes from the API
export const RIDE_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const PASSENGER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed'
};
