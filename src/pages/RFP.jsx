/**
 * RFP component
 * Displays RFP list with data fetched from API
 * Supports both admin and vendor views
 */
import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import RFPTable from '../components/ui/RFPTable';
import { userState } from '../services/userState';
import { getRFPsByUserId, getAllRFPs, closeRFP, applyForRFP } from '../services/rfpService';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { USER_ROLES } from '../constants';

const RFP = () => {
  const navigate = useNavigate();
  const [rfpData, setRfpData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyingForRfp, setApplyingForRfp] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Check authentication and user type
  const isAuthenticated = userState.isAuthenticated();
  const userType = userState.getUserType();

  // Fetch RFP data on component mount
  useEffect(() => {
    // Only fetch data if authenticated
    if (!isAuthenticated) {
      return;
    }
    
    const fetchRFPData = async () => {
      try {
        setLoading(true);
        
        let rfps = [];
        // Use different API endpoints based on user role
        if (userType === USER_ROLES.ADMIN) {
          // For admin users, get RFPs using the admin-specific endpoint with the admin's ID
          const adminId = userState.userInfo?.id;
          rfps = await getAllRFPs(adminId);
        } else {
          // For vendor users, get only their RFPs
          const userId = userState.userInfo?.id || 2;
          rfps = await getRFPsByUserId(userId);
        }
        
        setRfpData(rfps);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch RFP data:', err);
        setError('Failed to load RFP data. Please try again later.');
        toast.error('Failed to load RFP data', {
          position: "top-right"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRFPData();
  }, [isAuthenticated, userType]);

  // Apply pagination to the data
  useEffect(() => {
    if (rfpData.length > 0) {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      setFilteredData(rfpData.slice(indexOfFirstItem, indexOfLastItem));
    } else {
      setFilteredData([]);
    }
  }, [rfpData, currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total pages
  const totalPages = Math.ceil(rfpData.length / itemsPerPage);

  // Handle redirect for unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  /**
   * Handle closing an RFP
   * @param {number} rfpId - ID of the RFP to close
   */
  const handleCloseRFP = async (rfpId) => {
    try {
      await closeRFP(rfpId);
      
      // Update local state to reflect change
      setRfpData(prevData => 
        prevData.map(rfp => 
          (rfp.rfp_id === rfpId || rfp.id === rfpId) 
            ? { ...rfp, rfp_status: 'closed', status: 'closed' } 
            : rfp
        )
      );
      
      toast.success('RFP closed successfully', {
        position: "top-right"
      });
    } catch (err) {
      console.error('Failed to close RFP:', err);
      toast.error('Failed to close RFP. Please try again.', {
        position: "top-right"
      });
    }
  };

  /**
   * Handle applying for an RFP (vendor action)
   * @param {number} rfpId - ID of the RFP to apply for
   * @param {Object} quoteData - Quote data with item price and total cost
   */
  const handleApplyRFP = async (rfpId, quoteData) => {
    if (applyingForRfp) return; // Prevent multiple submissions
    
    try {
      setApplyingForRfp(true);
      
      // Submit application to API
      await applyForRFP(rfpId, quoteData);
      
      toast.success('Quote submitted successfully', {
        position: "top-right"
      });
      
      // Refresh RFP data to reflect changes based on user type
      let rfps = [];
      if (userType === USER_ROLES.ADMIN) {
        const adminId = userState.userInfo?.id;
        rfps = await getAllRFPs(adminId);
      } else {
        const userId = userState.userInfo?.id || 2;
        rfps = await getRFPsByUserId(userId);
      }
      setRfpData(rfps);
      
    } catch (err) {
      console.error('Failed to apply for RFP:', err);
      toast.error(err.message || 'Failed to submit quote. Please try again.', {
        position: "top-right"
      });
    } finally {
      setApplyingForRfp(false);
    }
  };

  /**
   * Handle creating a new RFP
   * Navigate to Add RFP page
   */
  const handleAddRFP = () => {
    navigate('/add-rfp');
  };

  /**
   * Handle viewing quotes for an RFP
   * @param {number} rfpId - ID of the RFP to view quotes for
   */
 

  // Render vendor view for RFP (quotes view)
  const renderVendorView = () => {
    return (
      <MainLayout pageTitle="RFP for Quotes">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="TableHeader">
                  <div className="row">
                    <div className="col-lg-12">
                      <h4 className="card-title">Available Quotes Requests</h4>
                    </div>
                  </div>
                </div>
                
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <RFPTable 
                    rfpData={filteredData} 
                    loading={loading} 
                    error={error}
                    onApplyRFP={handleApplyRFP}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    applyingForRfp={applyingForRfp}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  };

  // Render admin view for RFP
  const renderAdminView = () => {
    return (
      <MainLayout pageTitle="RFP List">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="TableHeader">
                  <div className="row">
                    <div className="col-lg-3">
                      <h4 className="card-title">RFP</h4>
                    </div>
                    <div className="col-lg-9 text-right">
                      <div className="headerButtons">
                        <button
                          type="button"
                          className="btn btn-sm btn-success"
                          onClick={handleAddRFP}
                        >
                          <i className="mdi mdi-plus"></i> Add RFP
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <RFPTable 
                    rfpData={filteredData} 
                    loading={loading} 
                    error={error}
                    onCloseRFP={handleCloseRFP}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  };

  // Return the appropriate view based on user type
  return userType === USER_ROLES.ADMIN ? renderAdminView() : renderVendorView();
};

export default RFP;