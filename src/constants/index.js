/**
 * Application constants
 * Centralizes route paths and other constants for reuse
 */

// Route paths
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  VENDORS: '/vendors',
  RFP: '/rfp',
  ADD_RFP: '/add-rfp',
  RFP_QUOTES: '/rfp-quotes/:id',
  HOME: '/'
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  VENDOR: 'vendor'
};

// API status
export const API_STATUS = {
  APPROVED: 'Approved',
  PENDING: 'Pending',
  REJECTED: 'Rejected'
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_ITEMS_PER_PAGE: 10
};