// src/services/notificationService.js

import axios from "axios";
import { getAuthToken } from "../services/authService";
import { API_BASE_URL } from "../config/constants";

/**
 * Send a notification to admin users
 * @param {Object} notificationData - The notification data
 * @param {string} notificationData.type - Type of notification (e.g., 'NEW_BOOKING', 'PAYMENT_RECEIVED')
 * @param {string} notificationData.bookingId - ID of the booking (if applicable)
 * @param {string} notificationData.route - Route information (if applicable)
 * @param {string} notificationData.departureDate - Departure date (if applicable)
 * @param {string} notificationData.fleetId - Fleet ID (if applicable)
 * @param {string} notificationData.seatNumber - Seat number (if applicable)
 * @param {number} notificationData.amount - Amount (if applicable)
 * @param {string} notificationData.status - Status of the related entity
 * @param {string} notificationData.timestamp - ISO string timestamp of when the notification was created
 * @returns {Promise<Object>} - Response from the notification API
 */
export const sendNotificationToAdmin = async (notificationData) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.post(
      `${API_BASE_URL}/notifications/admin`,
      notificationData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to send notification to admin:", error);
    // Still return success - we don't want booking to fail if notifications fail
    return { success: false, error: error.message };
  }
};

/**
 * Get all notifications for the current user
 * @param {Object} options - Query options
 * @param {number} options.page - Page number for pagination
 * @param {number} options.limit - Number of items per page
 * @param {boolean} options.unreadOnly - If true, only fetch unread notifications
 * @returns {Promise<Object>} - Response containing notifications and pagination info
 */
export const getUserNotifications = async (options = {}) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const { page = 1, limit = 10, unreadOnly = false } = options;

    const response = await axios.get(`${API_BASE_URL}/notifications/user`, {
      params: { page, limit, unreadOnly },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch user notifications:", error);
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param {string} notificationId - ID of the notification to mark as read
 * @returns {Promise<Object>} - Response from the notification API
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.patch(
      `${API_BASE_URL}/notifications/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    throw error;
  }
};

/**
 * Mark all notifications as read for the current user
 * @returns {Promise<Object>} - Response from the notification API
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.patch(
      `${API_BASE_URL}/notifications/read-all`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    throw error;
  }
};

/**
 * Subscribe to real-time notifications
 * @param {Function} callback - Function to call when new notifications arrive
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToNotifications = (callback) => {
  // This would typically use WebSockets or Server-Sent Events
  // For this example, we'll simulate with a polling mechanism
  let isSubscribed = true;

  const poll = async () => {
    if (!isSubscribed) return;

    try {
      const { notifications } = await getUserNotifications({
        limit: 5,
        unreadOnly: true,
      });

      if (notifications.length > 0) {
        callback(notifications);
      }
    } catch (error) {
      console.error("Notification polling error:", error);
    } finally {
      if (isSubscribed) {
        setTimeout(poll, 30000); // Poll every 30 seconds
      }
    }
  };

  // Start polling
  poll();

  // Return unsubscribe function
  return () => {
    isSubscribed = false;
  };
};
