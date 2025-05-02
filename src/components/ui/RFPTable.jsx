import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import Pagination from './Pagination';
import ApplyRFPModal from './ApplyRFPModal';
import { userState } from '../../services/userState';
import { USER_ROLES } from '../../constants';

const RFPTable = ({ 
  rfpData, 
  loading, 
  error, 
  onCloseRFP,
  onApplyRFP,
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 10,
  onPageChange,
  applyingForRfp = false
}) => {
  // State for modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedRfp, setSelectedRfp] = useState(null);
  const navigate = useNavigate();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <p className="mb-0">
          <i className="mdi mdi-alert-circle-outline mr-2"></i>
          {error}
        </p>
      </div>
    );
  }

  if (!rfpData || rfpData.length === 0) {
    return (
      <div className="alert alert-info mt-4">
        <p className="mb-0">
          <i className="mdi mdi-information-outline mr-2"></i>
          No RFPs available at the moment. Click "Add RFP" to create a new request for proposal.
        </p>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get the appropriate status badge
  const getStatusBadge = (rfpStatus) => {
    let badgeClass = '';
    let statusText = '';

    // Check the RFP status - only show Open or Closed
    if (rfpStatus === 'open') {
      badgeClass = 'success';
      statusText = 'Open';
    } else if (rfpStatus === 'closed') {
      badgeClass = 'danger';
      statusText = 'Closed';
    }

    return (
      <span className={`badge badge-pill badge-${badgeClass}`}>
        {statusText}
      </span>
    );
  };

  // Handle close RFP click
  const handleCloseClick = (e, rfpId) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to close this RFP?')) {
      onCloseRFP(rfpId);
    }
  };

  // Handle apply for RFP click
  const handleApplyClick = (e, rfp) => {
    e.preventDefault();
    setSelectedRfp(rfp);
    setShowApplyModal(true);
  };
  
  // Handle form submission from the apply modal
  const handleApplySubmit = (rfpId, quoteData) => {
    onApplyRFP(rfpId, quoteData);
    setShowApplyModal(false);
  };

  const totalItems = rfpData.length;
  const userType = userState.getUserType();

  return (
    <>
      <div className="table-responsive">
        <table className="table mb-0 listingData dt-responsive" id="datatable">
          <thead>
            <tr>
              <th>RFP ID</th>
              <th>RFP Title</th>
              <th>RFP Last Date</th>
              <th>Min Amount</th>
              <th>Max Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rfpData.map((rfp) => (
              <tr key={rfp.rfp_id || rfp.id}>
                <th scope="row">{rfp.rfp_id}</th>
                <td>{rfp.item_name}</td>
                <td>{formatDate(rfp.last_date)}</td>
                <td>{formatCurrency(rfp.minimum_price)}</td>
                <td>{formatCurrency(rfp.maximum_price)}</td>
                <td>
                  {getStatusBadge(rfp.rfp_status || rfp.status, rfp.applied_status)}
                </td>
                <td>
                  <div className="d-flex">
                    {userType === USER_ROLES.ADMIN && (
                      <>
                        {(rfp.rfp_status === 'open' || rfp.status === 'open') && (
                          <button 
                            className="btn btn-sm btn-danger mr-2"
                            title="Close RFP" 
                            onClick={(e) => handleCloseClick(e, rfp.rfp_id || rfp.id)}
                          >
                            Close
                          </button>
                        )}
                        <button 
                          className="btn btn-sm btn-info mr-2"
                          title="View Quotes" 
                          onClick={() => navigate(`/rfp-quotes/${rfp.rfp_id || rfp.id}`)}
                        >
                          Quotes
                        </button>
                      </>
                    )}
                    
                    {userType === USER_ROLES.VENDOR && (
                      <>
                        {(rfp.rfp_status === 'open' || rfp.status === 'open') && rfp.applied_status !== 'applied' ? (
                          <button 
                            className="btn btn-sm btn-primary mr-2"
                            title="Apply for RFP" 
                            onClick={(e) => handleApplyClick(e, rfp)}
                            disabled={applyingForRfp}
                          >
                            {applyingForRfp ? (
                              <>
                                Applying...
                              </>
                            ) : (
                              <>
                                Apply
                              </>
                            )}
                          </button>
                        ) : rfp.applied_status === 'applied' && (
                          <span className="text-success mr-2 d-flex align-items-center">
                            <i className="mdi mdi-check-circle mr-1"></i> Applied
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />

      {/* Use the dedicated ApplyRFPModal component */}
      <ApplyRFPModal 
        show={showApplyModal}
        onHide={() => setShowApplyModal(false)}
        selectedRfp={selectedRfp}
        onSubmit={handleApplySubmit}
        isSubmitting={applyingForRfp}
      />
    </>
  );
};

export default RFPTable;