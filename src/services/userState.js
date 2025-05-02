/**
 * User state management service
 * Handles user authentication state, storage and retrieval of user data
 */

// Initialize user state from localStorage if available
export const userState = {
  token: localStorage.getItem('token'),
  userInfo: JSON.parse(localStorage.getItem('userInfo')),
  
  /**
   * Sets user data in state and persists to localStorage
   * @param {Object} data - User data from API response
   * @param {string} data.token - Authentication token
   * @param {string} data.user_id - User ID
   * @param {string} data.type - User type (admin/vendor)
   * @param {string} data.name - User's name
   * @param {string} data.email - User's email
   */
  setUserData(data) {
    this.token = data.token;
    this.userInfo = {
      id: data.user_id,
      type: data.type,
      name: data.name,
      email: data.email
    };
    
    // Persist in localStorage
    localStorage.setItem('token', this.token);
    localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
  },
  
  /**
   * Clears user data from state and localStorage
   * Used during logout
   */
  clearUserData() {
    this.token = null;
    this.userInfo = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  },
  
  /**
   * Checks if user is authenticated
   * @returns {boolean} True if user has a valid token
   */
  isAuthenticated() {
    return !!this.token;
  },
  
  /**
   * Gets the user type (admin/vendor)
   * @returns {string|null} User type or null if not authenticated
   */
  getUserType() {
    return this.userInfo?.type;
  },

  /**
   * Gets the authentication token
   * @returns {string|null} Token or null if not authenticated
   */
  getToken() {
    return this.token;
  }
};