/**
 * Vendor services
 * Handles vendor registration, listing, and category operations
 */
import api from './api';
import { userState } from './userState';
import { 
  showErrorToast, 
  showSuccessToast, 
  isAuthorizationError, 
  handleAuthorizationFailure 
} from './utils';

/**
 * Registers a new vendor
 */
export const registerVendor = async (vendorData) => {
  try {
    // Validate required fields
    const requiredFields = ['firstname', 'lastname', 'email', 'password', 'mobile', 'no_of_employees', 'category', 'pancard_no', 'gst_no'];
    for (const field of requiredFields) {
      if (!vendorData[field]) {
        const errorMessage = `${field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')} is required`;
        showErrorToast(errorMessage);
        throw new Error(errorMessage);
      }
    }

    // Send registration request
    const response = await api.post('/registervendor', vendorData);
    const { data } = response;
    
    if (data.response === 'success') {
      // Clear any existing localStorage data to ensure a clean state for login
      localStorage.clear();
      
      showSuccessToast('Registration successful! Redirecting to login page...', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      
      // After a short delay, redirect to login with page reload
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      
      return data;
    } else {
      const errorMessages = Array.isArray(data.error) ? data.error : [data.error || 'Registration failed'];
      errorMessages.forEach(msg => showErrorToast(msg));
      throw new Error(errorMessages[0] || 'Registration failed');
    }
  } catch (error) {
    // Don't display error toast if it's already shown from field validation
    if (error.response?.data && !error.message.includes('is required')) {
      const errorMessages = Array.isArray(error.response.data.error) 
        ? error.response.data.error 
        : [error.response.data.error || 'Registration failed'];
      errorMessages.forEach(msg => showErrorToast(msg));
    } else if (!error.message.includes('is required')) {
      showErrorToast(error.message || 'Registration failed. Please try again.');
    }
    throw error;
  }
};

/**
 * Fetches the list of vendors
 */
export const getVendorList = async () => {
  try {
    // Check for token before making the request
    if (!userState.getToken()) {
      const errorMessage = 'No authorization token available';
      showErrorToast(errorMessage);
      throw new Error(errorMessage);
    }

    const response = await api.get('/vendorlist');
    const { data } = response;
    
    if (data.response === 'success') {
      return data.vendors;
    } else {
      const errorMessage = data.message || data.errors || 'Failed to fetch vendors';
      showErrorToast(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    // Check for auth error
    if (isAuthorizationError(error.message)) {
      handleAuthorizationFailure();
      return [];
    }
    
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.errors 
      || error.message 
      || 'Failed to fetch vendors';
    showErrorToast(errorMessage);
    throw error;
  }
};

/**
 * Fetches available categories for vendors
 */
export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    const { data } = response;
    
    if (data.response === 'success') {
      
      const activeCategories = Array.isArray(data.categories) 
        ? data.categories.filter(category => 
            category.status && category.status === 'active')
        : Object.values(data.categories).filter(category => 
            category.status && category.status.toLowerCase() === 'active');
            
      return activeCategories;
    } else {
      const errorMessage = data.message || data.errors || 'Failed to fetch categories';
      showErrorToast(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    // Check for auth error
    if (isAuthorizationError(error.message)) {
      handleAuthorizationFailure();
      return [];
    }
    
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.errors 
      || error.message 
      || 'Failed to fetch categories';
    showErrorToast(errorMessage);
    throw error;
  }
};

/**
 * Updates a vendor's status (approve, reject, or pending)
 */
export const updateVendorStatus = async (userId, status) => {
  try {
    // Check for token before making the request
    if (!userState.getToken()) {
      const errorMessage = 'No authorization token available';
      showErrorToast(errorMessage);
      throw new Error(errorMessage);
    }

    // Validate input
    if (!userId) {
      throw new Error('Vendor ID is required');
    }
    
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      throw new Error('Invalid status value');
    }

    // First fetch the current vendor status to check if it's already approved
    const vendors = await getVendorList();
    const currentVendor = vendors.find(vendor => vendor.user_id === userId);
    
    if (currentVendor && currentVendor.status?.toLowerCase() === 'approved') {
      const errorMessage = 'Cannot change status: Vendor is already approved';
      showErrorToast(errorMessage);
      throw new Error(errorMessage);
    }

    console.log('Sending status update request:', { user_id: userId, status });

    // Make API request to update vendor status using PUT method with correct endpoint
    const response = await api.post('/approveVendor', {
      user_id: userId,
      status: status
    });
    
    console.log('Status update response:', response.data);
    
    const { data } = response;
    
    if (data.response === 'success') {
      showSuccessToast(`Vendor status updated to ${status} successfully`);
      return data;
    } else {
      const errorMessage = data.message || data.errors || `Failed to update vendor status to ${status}`;
      showErrorToast(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    // Check for auth error
    if (isAuthorizationError(error.message)) {
      handleAuthorizationFailure();
      return {};
    }
    
    console.error('Error updating vendor status:', error);
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.errors 
      || error.message 
      || 'Failed to update vendor status';
    showErrorToast(errorMessage);
    throw error;
  }
};