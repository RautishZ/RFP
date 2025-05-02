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
 * @param {Object} vendorData - Vendor registration data
 * @returns {Promise<Object>} Response data on successful registration
 * @throws {Error} If registration fails
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
      showSuccessToast('Registration successful! You can now login.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
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
 * @returns {Promise<Array>} List of vendors
 * @throws {Error} If fetching fails or user is not authenticated
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
 * @returns {Promise<Array>} List of categories
 * @throws {Error} If fetching fails
 */
export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    const { data } = response;
    
    if (data.response === 'success') {
      return data.categories;
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
 * @param {number} userId - The ID of the vendor to update
 * @param {string} status - The new status (approved, rejected, pending)
 * @returns {Promise<Object>} Response data on successful update
 * @throws {Error} If update fails
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
    const response = await api.put('/approveVendor', {
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