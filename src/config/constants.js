// src/config/constants.js

/**
 * Base URL for the API
 * Different URLs are used based on the environment
 */
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Application settings
 */
export const APP_SETTINGS = {
  SITE_NAME: 'TransitBooking',
  COMPANY_NAME: 'TransitBooking Ltd.',
  CONTACT_EMAIL: 'support@transitbooking.com',
  CONTACT_PHONE: '+234 800 123 4567',
};

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
};

/**
 * API endpoints
 */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  BOOKINGS: {
    LIST: '/bookings',
    DETAILS: (id) => `/bookings/${id}`,
    CREATE: '/bookings',
    CANCEL: (id) => `/bookings/${id}/cancel`,
  },
  FLEET: {
    LIST: '/fleet',
    BY_ROUTE: (route) => `/fleet/route/${route}`,
    DETAILS: (id) => `/fleet/${id}`,
  },
  ROUTES: {
    LIST: '/routes',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
  },
  NOTIFICATIONS: {
    ADMIN: '/notifications/admin',
    USER: '/notifications/user',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },
};

/**
 * Notification types
 */
export const NOTIFICATION_TYPES = {
  NEW_BOOKING: 'NEW_BOOKING',
  BOOKING_APPROVED: 'BOOKING_APPROVED',
  BOOKING_REJECTED: 'BOOKING_REJECTED',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  TRIP_REMINDER: 'TRIP_REMINDER',
  SYSTEM: 'SYSTEM',
};

/**
 * Booking statuses
 */
export const BOOKING_STATUS = {
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
};

/**
 * Payment statuses
 */
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

/**
 * User roles
 */
export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
};

/**
 * Theme options
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

/**
 * Supported languages
 */
export const LANGUAGES = {
  ENGLISH: 'en',
  FRENCH: 'fr',
  SPANISH: 'es',
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};