/**
 * Utility functions for services
 * Contains common helpers for error handling and request processing
 */
import { toast } from 'react-toastify';
import { userState } from './userState';

/**
 * Common auth errors that indicate authorization failure
 */
export const AUTH_ERROR_PATTERNS = [
  "authorization failled",
  "authorization failed",
  "auth failed",
  "auth failled",
  "unauthorized"
];

/**
 * Handles authorization failure by clearing user data and redirecting to home page
 */
export const handleAuthorizationFailure = () => {
  userState.clearUserData();
  window.location.href = '/';
};

/**
 * Checks if an error message indicates an authorization failure
 */
export const isAuthorizationError = (message) => {
  if (!message || typeof message !== 'string') return false;
  const lowerCaseMsg = message.toLowerCase();
  return AUTH_ERROR_PATTERNS.some(pattern => lowerCaseMsg.includes(pattern));
};

/**
 * Extracts error message from API error response
 */
export const extractErrorMessage = (error) => {
  // First check for structured error response
  if (error.response?.data) {
    if (Array.isArray(error.response.data.error)) {
      return error.response.data.error[0];
    }
    return error.response.data.message || 
           error.response.data.error || 
           error.response.data.errors || 
           'An error occurred';
  }
  
  // Then check for error object with message property
  if (error.message) {
    return error.message;
  }
  
  // Fallback to generic error
  return 'An unexpected error occurred';
};

/**
 * Displays an error toast with the given message
 */
export const showErrorToast = (message, options = {}) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    ...options
  });
};

/**
 * Displays a success toast with the given message
 */
export const showSuccessToast = (message, options = {}) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    ...options
  });
};

/**
 * Handles common API errors, including authorization failures
 */
export const handleApiError = (error) => {
  const errorMessage = extractErrorMessage(error);
  
  // Check if it's an authorization error
  if (isAuthorizationError(errorMessage) || error.response?.status === 401) {
    handleAuthorizationFailure();
  }
  
  return errorMessage;
};