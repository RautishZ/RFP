/**
 * RFP Service
 * Handles API calls related to RFP functionalities
 */
import api, { API_BASE_URL } from './api';
import { userState } from './userState';
import { 
  isAuthorizationError,
  handleAuthorizationFailure
} from './utils';

/**
 * Get RFP list by user ID or RFP details with quotes by RFP ID
 * @param {number} id - User ID to fetch RFPs for or RFP ID to fetch details with quotes
 * @param {boolean} isSingleRfp - If true, treats the ID as an RFP ID instead of a user ID
 * @returns {Promise} - Promise with RFP data or RFP with quotes
 */
export const getRFPsByUserId = async (id, isSingleRfp = false) => {
  try {
    if (!userState.getToken()) {
      throw new Error('Authentication token not found');
    }
    
    const endpoint = `/rfp/getrfp/${id}`;
    const response = await api.get(endpoint);
    
    // If it's a request for a specific RFP, get quotes from the response
    if (isSingleRfp && response.data.rfps?.[0]?.quotes) {
      return response.data.rfps[0].quotes || [];
    }

    return response.data.rfps || [];
  } catch (error) {
    console.error('Error fetching RFP data:', error);
    
    // Check for auth error
    if (isAuthorizationError(error.message)) {
      handleAuthorizationFailure();
      return [];
    }
    
    throw error;
  }
};

/**
 * Get all RFPs (Admin only)
 * @param {number} adminId - Admin ID to fetch RFPs for
 * @returns {Promise} - Promise with all RFPs data
 */
export const getAllRFPs = async (adminId) => {
  try {
    if (!userState.getToken()) {
      throw new Error('Authentication token not found');
    }
    
    if (!adminId) {
      // Fallback to current user ID if adminId is not provided
      adminId = userState.userInfo?.id;
      if (!adminId) {
        throw new Error('Admin ID is required');
      }
    }
    // const endpoint = `/rfp/getadminrfp/${adminId}`;
    // Use the admin-specific endpoint for fetching all RFPs
    const endpoint = `/rfp/getrfp/${adminId}`;
    const response = await api.get(endpoint);
    
    return response.data.rfps || [];
  } catch (error) {
    console.error('Error fetching all RFPs:', error);
    
    if (isAuthorizationError(error.message)) {
      handleAuthorizationFailure();
      return [];
    }
    
    throw error;
  }
};

/**
 * Close an RFP
 * @param {number} rfpId - ID of the RFP to close
 * @returns {Promise} - Promise with the operation result
 */
export const closeRFP = async (rfpId) => {
  try {
    if (!userState.getToken()) {
      throw new Error('Authentication token not found');
    }
    
    const response = await api.put(`/rfp/closerfp/${rfpId}`, {});
    return response.data;
  } catch (error) {
    console.error('Error closing RFP:', error);
    
    // Check for auth error
    if (isAuthorizationError(error.message)) {
      handleAuthorizationFailure();
      return {};
    }
    
    throw error;
  }
};

/**
 * Get all available categories
 * @returns {Promise} - Promise with categories data as an array
 */
export const getCategories = async () => {
  try {
    if (!userState.getToken()) {
      throw new Error('Authentication token not found');
    }
    
    const response = await api.get('/categories');
    
    // The API returns categories as an object with IDs as keys like:
    // { "49": { "id": 49, "name": "VelocitySof", "status": "Active" }, ... }
    if (response.data.categories && typeof response.data.categories === 'object') {
      try {
        // Convert the object to an array of category objects
        const categoriesArray = Object.values(response.data.categories).map(category => ({
          id: parseInt(category.id, 10),
          name: category.name,
          status: category.status
        }));
        
        return categoriesArray;
      } catch (parseError) {
        console.error('Error parsing categories:', parseError);
        return [];
      }
    }
    
    // Fallback to empty array if no categories or unexpected format
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    // Check for auth error
    if (isAuthorizationError(error.message)) {
      handleAuthorizationFailure();
      return [];
    }
    
    throw error;
  }
};

/**
 * Get vendors by category ID
 * @param {number} categoryId - Category ID to fetch vendors for
 * @returns {Promise} - Promise with vendors data (only approved vendors)
 */
export const getVendorsByCategory = async (categoryId) => {
  try {
    if (!categoryId) {
      throw new Error('Category ID is required');
    }

    if (!userState.getToken()) {
      throw new Error('Authentication token not found');
    }
    
    const response = await api.get(`/vendorlist/${categoryId}`);
    
    // Log the full API response to console
    console.log(`Vendors for Category ID ${categoryId} - API Response:`, response.data);

    // If there's a message saying no vendors are mapped, return an empty array
    if (response.data.message && response.data.message.includes('No vendors mapped')) {
      console.log(`No vendors mapped with category ID ${categoryId}`);
      return [];
    }

    // Process vendors data, ensuring user_id is a number not a string
    // And filter to only include vendors with status 'approved'
    const vendors = Array.isArray(response.data.vendors) 
      ? response.data.vendors
          .map(vendor => ({
            ...vendor,
            user_id: parseInt(vendor.user_id, 10), // Ensure user_id is parsed as a number
            status: vendor.status?.toLowerCase() // Normalize status to lowercase for comparison
          }))
          .filter(vendor => vendor.status === 'approved') // Only include approved vendors
      : [];
    
    console.log(`Found ${vendors.length} approved vendors for category ID ${categoryId}:`, vendors);
    return vendors;
  } catch (error) {
    console.error('Error fetching vendors by category:', error);
    
    // Check for auth error
    if (isAuthorizationError(error.message)) {
      handleAuthorizationFailure();
      return [];
    }
    
    throw error;
  }
};

/**
 * Create a new RFP
 * @param {Object} rfpData - Data for creating a new RFP
 * @returns {Promise} - Promise with the operation result
 */
export const createRFP = async (rfpData) => {
  try {
    if (!userState.getToken()) {
      throw new Error('Authentication token not found');
    }

    // Validate required fields before making the API call
    const requiredFields = [
      'item_name', 'rfp_no', 'quantity', 'last_date',
      'minimum_price', 'maximum_price', 'categories', 'vendors', 'item_description'
    ];
    
    const missingFields = requiredFields.filter(field => !rfpData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Format the date correctly if it's not already in the right format
    if (rfpData.last_date && !rfpData.last_date.includes(':')) {
      const date = new Date(rfpData.last_date);
      if (!isNaN(date.getTime())) {
        rfpData.last_date = date.toISOString().replace('T', ' ').substring(0, 19);
      }
    }

    // Ensure numeric fields are properly formatted
    if (typeof rfpData.quantity === 'string') {
      rfpData.quantity = parseInt(rfpData.quantity, 10);
    }
    if (typeof rfpData.minimum_price === 'string') {
      rfpData.minimum_price = parseFloat(rfpData.minimum_price);
    }
    if (typeof rfpData.maximum_price === 'string') {
      rfpData.maximum_price = parseFloat(rfpData.maximum_price);
    }
    
    const response = await api.post('/createrfp', rfpData);
    return response.data;
  } catch (error) {
    console.error('Error creating RFP:', error);
    
    // Check for auth error
    if (isAuthorizationError(error.message)) {
      handleAuthorizationFailure();
      return {};
    }
    
    throw error;
  }
};

/**
 * Apply for an RFP (Vendor Action)
 * @param {number} rfpId - ID of the RFP to apply for
 * @param {Object} quoteData - Quote data submitted by vendor
 * @returns {Promise} - Promise with the operation result
 */
export const applyForRFP = async (rfpId, quoteData) => {
  try {
    if (!rfpId) {
      throw new Error('RFP ID is required');
    }

    if (!userState.getToken()) {
      throw new Error('Authentication token not found');
    }

    // Ensure quoteData contains required fields
    const requiredFields = ['item_price', 'total_cost'];
    const missingFields = requiredFields.filter(field => !quoteData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Format the data for API request - no need to include rfp_id in body since it's in the URL
    const requestData = {
      item_price: parseFloat(quoteData.item_price),
      total_cost: parseFloat(quoteData.total_cost)
    };

    // Make API request to submit quote - using PUT method with rfpId in URL path
    const response = await api.put(`/rfp/apply/${rfpId}`, requestData);
    return response.data;
  } catch (error) {
    console.error('Error applying for RFP:', error);
    
    // Check for auth error
    if (isAuthorizationError(error.message)) {
      handleAuthorizationFailure();
      return {};
    }
    
    throw error;
  }
};

/**
 * Get quotes for a specific RFP
 * @param {number} rfpId - ID of the RFP to fetch quotes for
 * @returns {Promise} - Promise with quotes data
 */
export const getRFPQuotes = async (rfpId) => {
  try {
    if (!rfpId) {
      throw new Error('RFP ID is required');
    }

    if (!userState.getToken()) {
      throw new Error('Authentication token not found');
    }

    const response = await api.get(`/rfp/quotes/${rfpId}`);
    return response.data.quotes || [];
  } catch (error) {
    console.error('Error fetching RFP quotes:', error);
    
    // Check for auth error
    if (isAuthorizationError(error.message)) {
      handleAuthorizationFailure();
      return [];
    }
    
    throw error;
  }
};

export default {
  getRFPsByUserId,
  getAllRFPs,
  closeRFP,
  getCategories,
  getVendorsByCategory,
  createRFP,
  applyForRFP,
  getRFPQuotes
};