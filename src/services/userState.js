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
   */
  isAuthenticated() {
    return !!this.token;
  },
  
  /**
   * Gets the user type (admin/vendor)
   */
  getUserType() {
    return this.userInfo?.type;
  },

  /**
   * Gets the authentication token
   */
  getToken() {
    return this.token;
  }
};