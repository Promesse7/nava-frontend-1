// src/services/authService.js

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../config/constants";

const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

/**
 * Handle user login
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - User data and token
 */
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });

    const { token, user } = response.data;

    // Store token and user data
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return { token, user };
  } catch (error) {
    console.error("Login failed:", error);
    throw error.response?.data || error;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Registration response
 */
export const register = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error.response?.data || error;
  }
};

/**
 * Log out the current user
 */
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Get the authentication token
 * @returns {string|null} - The authentication token or null if not logged in
 */
export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get the current user's data
 * @returns {Object|null} - User data or null if not logged in
 */
export const getCurrentUser = () => {
  const userString = localStorage.getItem(USER_KEY);

  if (!userString) {
    return null;
  }

  try {
    return JSON.parse(userString);
  } catch (error) {
    console.error("Failed to parse user data:", error);
    return null;
  }
};

/**
 * Check if the current user is authenticated
 * @returns {boolean} - True if user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
  const token = getAuthToken();

  if (!token) {
    return false;
  }

  try {
    // Check if token is expired
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decodedToken.exp > currentTime;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
};

/**
 * Check if current user has admin role
 * @returns {boolean} - True if user is an admin, false otherwise
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === "ADMIN";
};

/**
 * Request password reset for a user
 * @param {string} email - Email of the user requesting password reset
 * @returns {Promise<Object>} - Response from the password reset API
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Password reset request failed:", error);
    throw error.response?.data || error;
  }
};

/**
 * Reset password with reset token
 * @param {string} token - Password reset token
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} - Response from the password reset API
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Password reset failed:", error);
    throw error.response?.data || error;
  }
};

/**
 * Update the current user's profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} - Updated user data
 */
export const updateProfile = async (profileData) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.put(
      `${API_BASE_URL}/users/profile`,
      profileData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Update stored user data
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    console.error("Profile update failed:", error);
    throw error.response?.data || error;
  }
};
