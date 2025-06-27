import apiClient from '../utils/apiClient';

/**
 * Offer a new ride
 * 
 * @param {Object} rideData - The ride data
 * @param {string} rideData.startLocation - Starting location
 * @param {string} rideData.endLocation - End location
 * @param {string} rideData.route - Route description
 * @param {Date} rideData.departureTime - Departure time
 * @param {number} rideData.totalSeats - Total seats available
 * @param {number} rideData.price - Price per seat
 * @param {string} rideData.additionalNotes - Additional notes
 * @returns {Promise} - API response
 */
export const offerRide = async (rideData) => {
  try {
    const response = await apiClient.post('/api/rides', rideData);
    return response.data;
  } catch (error) {
    console.error('Error offering ride:', error);
    throw error;
  }
};

/**
 * Get all available rides
 * 
 * @param {Object} filters - Optional filters
 * @returns {Promise} - API response
 */
export const getAllRides = async (filters = {}) => {
  try {
    const response = await apiClient.get('/api/rides', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching rides:', error);
    throw error;
  }
};

/**
 * Get a specific ride by ID
 * 
 * @param {string} rideId - The ride ID
 * @returns {Promise} - API response
 */
export const getRideById = async (rideId) => {
  try {
    const response = await apiClient.get(`/api/rides/${rideId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ride details:', error);
    throw error;
  }
};

/**
 * Request to join a ride
 * 
 * @param {string} rideId - The ride ID
 * @param {Object} requestData - Request data
 * @param {string} requestData.pickupLocation - Pickup location
 * @returns {Promise} - API response
 */
export const joinRide = async (rideId, pickupLocation) => {
  try {
    const response = await apiClient.post(`/api/rides/${rideId}/join`, { pickupLocation });
    return response.data;
  } catch (error) {
    console.error('Error joining ride:', error);
    throw error;
  }
};

/**
 * Update passenger status (for drivers)
 * 
 * @param {string} rideId - The ride ID
 * @param {string} passengerId - The passenger user ID
 * @param {string} status - The new status (accepted/rejected)
 * @returns {Promise} - API response
 */
export const updatePassengerStatus = async (rideId, passengerId, status) => {
  try {
    const response = await apiClient.put(`/api/rides/${rideId}/passengers/${passengerId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating passenger status:', error);
    throw error;
  }
};

/**
 * Complete a ride (for drivers)
 * 
 * @param {string} rideId - The ride ID
 * @returns {Promise} - API response
 */
export const completeRide = async (rideId) => {
  try {
    const response = await apiClient.put(`/api/rides/${rideId}/complete`);
    return response.data;
  } catch (error) {
    console.error('Error completing ride:', error);
    throw error;
  }
};

/**
 * Rate a ride
 * 
 * @param {string} rideId - The ride ID
 * @param {Object} ratingData - Rating data
 * @param {number} ratingData.rating - Rating (1-5)
 * @param {string} ratingData.comment - Optional comment
 * @returns {Promise} - API response
 */
export const rateRide = async (rideId, rating, comment) => {
  try {
    const response = await apiClient.post(`/api/rides/${rideId}/rate`, { rating, comment });
    return response.data;
  } catch (error) {
    console.error('Error rating ride:', error);
    throw error;
  }
};
