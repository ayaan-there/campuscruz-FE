// Create this file: c:\Users\ASUS\Desktop\ALL-PROJECTS\Campuscruz\frontend\src\utils\errorHandler.js

/**
 * Safely handles errors for user display
 * @param {Error} error - The error object
 * @param {string} defaultMessage - Default user-friendly message
 * @returns {string} Safe error message for display
 */
export const getSafeErrorMessage = (error, defaultMessage = 'An error occurred') => {
  // Check if it's an axios error with a response from our API
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  // For network errors
  if (error?.message === 'Network Error') {
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  
  // Return generic message for all other cases
  return defaultMessage;
};

/**
 * Logs errors safely to console in development only
 */
export const logError = (context, error) => {
  if (import.meta.env.DEV) {
    console.error(`Error in ${context}:`, error);
  }
};