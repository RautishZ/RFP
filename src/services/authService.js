/**
 * Authentication service
 * Handles user login and logout operations
 */
import { toast } from 'react-toastify';
import api from './api';
import { userState } from './userState';
import { showErrorToast, showSuccessToast } from './utils';

/**
 * Authenticates a user with email and password
 */
export const login = async (email, password) => {
  try {
    // Validate inputs before making API call
    if (!email || !email.trim()) {
      showErrorToast('Email is required');
      throw new Error('Email is required');
    }
    
    if (!password || !password.trim()) {
      showErrorToast('Password is required');
      throw new Error('Password is required');
    }
    
    // Send login request to API
    const response = await api.post('/login', { email, password });
    const { data } = response;
    
    if (data.response === 'success') {
      // Store user data in local state
      console.log('Login successful:', data);
      userState.setUserData(data);
      showSuccessToast('Login successful!');
      return data;
    } else {
      const errorMsg = data.error || 'Login failed';
      showErrorToast(errorMsg);
      throw new Error(errorMsg);
    }
  } catch (error) {
    // Format and display error message
    const errorMessage = error.message || 'Login failed. Please try again.';
    
    // Only show toast if it wasn't already shown (in the validation section)
    if (!['Email is required', 'Password is required'].includes(errorMessage)) {
      showErrorToast(errorMessage);
    }
    
    // Re-throw error so calling function can handle it
    throw error;
  }
};

/**
 * Logs out the current user
 * Clears local storage and displays confirmation message
 */
export const logout = () => {
  userState.clearUserData();
  toast.info('Logged out successfully', {
    position: "top-right",
    autoClose: 3000,
  });
};