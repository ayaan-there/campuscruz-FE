import axios from 'axios';
import { API_URL } from '../config';

/**
 * Fetch user notifications with built-in cache busting
 * @returns {Promise<Array>} Array of notifications
 */
export const fetchUserNotifications = async () => {
  try {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const response = await axios.get(
      `${API_URL}/api/users/me/notifications?_t=${timestamp}`,
      { withCredentials: true }
    );
    
    if (response.data.success) {
      return response.data.notifications;
    }
    return [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param {string} notificationId The ID of the notification to mark as read
 * @returns {Promise<boolean>} Success status
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/users/me/notifications/${notificationId}/read`,
      {},
      { withCredentials: true }
    );
    
    return response.data.success || false;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

/**
 * Format notification message for display
 * @param {Object} notification The notification object
 * @returns {string} Formatted message
 */
export const formatNotificationMessage = (notification) => {
  // Add your custom formatting logic here
  return notification.message;
};
