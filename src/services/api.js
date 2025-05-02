/**
 * Base API configuration file
 * Configures axios with interceptors for authentication and error handling
 */
import axios from 'axios';
import { userState } from './userState';
import { 
  isAuthorizationError, 
  handleAuthorizationFailure 
} from './utils';

// API endpoint configuration
export const API_BASE_URL = 'https://rfpdemo.velsof.com/api';

/**
 * Create axios instance with default configuration
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Request interceptor
 * Adds authentication token to outgoing requests if user is logged in
 */
api.interceptors.request.use(
  (config) => {
    const token = userState.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handles API responses and standardizes error handling
 * Converts API error responses into rejected promises with consistent format
 */
api.interceptors.response.use(
  (response) => {
    // Check if the response indicates an error
    if (response.data.response === 'error' || response.data.response === 'Error') {
      const errorMessage = Array.isArray(response.data.error) 
        ? response.data.error[0] 
        : response.data.message || response.data.error || response.data.errors || 'Something went wrong';
      
      // Check for authorization failure
      if ((response.data.errors && isAuthorizationError(response.data.errors)) || 
          isAuthorizationError(errorMessage)) {
        handleAuthorizationFailure();
      }
      
      return Promise.reject({ message: errorMessage, response: response.data });
    }
    return response;
  },
  (error) => {
    // Handle network errors and other HTTP errors
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.error 
      || error.response?.data?.errors
      || error.message 
      || 'Network error occurred';
    
    // Check for authorization failure in error response
    if ((error.response?.data?.errors && isAuthorizationError(error.response.data.errors.toString())) ||
        (error.response?.data?.error && isAuthorizationError(error.response.data.error.toString())) ||
        isAuthorizationError(errorMessage) ||
        error.response?.status === 401) {
      handleAuthorizationFailure();
    }
    
    return Promise.reject({ message: errorMessage, response: error.response?.data });
  }
);

export default api;