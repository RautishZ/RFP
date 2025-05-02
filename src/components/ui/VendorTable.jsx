import React, { useState } from 'react';
import { updateVendorStatus } from '../../services/vendorService';

const VendorTable = ({ vendors = [], onVendorStatusChange }) => {
  // Track which vendor's status is being updated
  const [updatingVendor, setUpdatingVendor] = useState(null);

  /**
   * Handles status change for a vendor
   * @param {Event} e - Click event
   * @param {number} userId - ID of the vendor
   * @param {string} newStatus - New status to set (approved, rejected, pending)
   */
  const handleStatusChange = async (e, userId, newStatus) => {
    e.preventDefault();
    
    try {
      // Confirm before changing status
      if (window.confirm(`Are you sure you want to change vendor status to ${newStatus}?`)) {
        // Show loading state for this vendor
        setUpdatingVendor(userId);
        
        await updateVendorStatus(userId, newStatus);
        
        // Call the callback function to update just this vendor's status
        if (onVendorStatusChange) {
          onVendorStatusChange(userId, newStatus);
        }
        
        // Clear loading state
        setUpdatingVendor(null);
      }
    } catch (error) {
      console.error(`Error updating vendor status to ${newStatus}:`, error);
      // Clear loading state even on error
      setUpdatingVendor(null);
    }
  };

  // Helper function to get badge color based on status
  const getStatusBadgeColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  // Helper function to get first name with fallback options
  const getFirstName = (vendor) => {
    // Check multiple possible property names for first name
    return vendor.firstname || vendor.first_name || 
           (vendor.name ? vendor.name.split(' ')[0] : 'N/A');
  };

  // Helper function to get last name with fallback options
  const getLastName = (vendor) => {
    // Check multiple possible property names for last name
    return vendor.lastname || vendor.last_name || 
           (vendor.name ? vendor.name.split(' ').slice(1).join(' ') : 'N/A');
  };

  // Render action buttons based on vendor status
  const renderActionButtons = (vendor) => {
    if (vendor.status?.toLowerCase() === 'approved') {
      // No buttons for approved vendors
      return null;
    }
    
    // Show loading spinner if this vendor's status is being updated
    if (updatingVendor === vendor.user_id) {
      return (
        <div className="text-center">
          <i className="mdi mdi-loading mdi-spin text-primary"></i>
          <span className="ml-1 small">Updating...</span>
        </div>
      );
    }
    
    return (
      <div className="btn-group" role="group">
        {/* Approve button shown for both pending and rejected vendors */}
        <button 
          type="button"
          className="btn btn-outline-success btn-action-square mr-2" 
          title="Approve Vendor"
          onClick={(e) => handleStatusChange(e, vendor.user_id, 'approved')}
          style={{ width: '30px', height: '30px', padding: '0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <i className="mdi mdi-check-circle-outline"></i>
        </button>
        
        {/* Show pending button only if the vendor is rejected */}
        {vendor.status?.toLowerCase() === 'rejected' && (
          <button 
            type="button"
            className="btn btn-outline-warning btn-action-square mr-2" 
            title="Mark as Pending"
            onClick={(e) => handleStatusChange(e, vendor.user_id, 'pending')}
            style={{ width: '30px', height: '30px', padding: '0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <i className="mdi mdi-clock-outline"></i>
          </button>
        )}
        
        {/* Show reject button only if the vendor is pending */}
        {vendor.status?.toLowerCase() === 'pending' && (
          <button 
            type="button"
            className="btn btn-outline-danger btn-action-square" 
            title="Reject Vendor"
            onClick={(e) => handleStatusChange(e, vendor.user_id, 'rejected')}
            style={{ width: '30px', height: '30px', padding: '0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <i className="mdi mdi-close-circle-outline"></i>
          </button>
        )}
      </div>
    );
  };

  // Show visual feedback for status transition
  const renderStatusCell = (vendor) => {
    const statusColor = getStatusBadgeColor(vendor.status);
    
    return (
      <span className={`badge badge-pill badge-${statusColor}`}>
        {vendor.status || 'Unknown'}
      </span>
    );
  };

  return (
    <div className="table-responsive">
      <table className="table mb-0 listingData dt-responsive" id="datatable">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Contact No</th>
            <th>No. of Employees</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor.user_id}>
              <th scope="row">{vendor.user_id}</th>
              <td>{getFirstName(vendor)}</td>
              <td>{getLastName(vendor)}</td>
              <td>{vendor.email || 'N/A'}</td>
              <td>{vendor.mobile || 'N/A'}</td>
              <td>{vendor.no_of_employees || 'N/A'}</td>
              <td id={`status-${vendor.user_id}`}>
                {renderStatusCell(vendor)}
              </td>
              <td id={`action-${vendor.user_id}`}>
                {renderActionButtons(vendor)}
              </td>
            </tr>
          ))}
          {vendors.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center">No vendors found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VendorTable;