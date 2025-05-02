/**
 * Vendors component
 * Displays vendor list for admins and profile info for vendors
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import VendorTable from '../components/ui/VendorTable';
import Pagination from '../components/ui/Pagination';
import { userState } from '../services/userState';
import { getVendorList } from '../services/vendorService';
import { toast } from 'react-toastify';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [allVendors, setAllVendors] = useState([]);
  const itemsPerPage = 10;

  /**
   * Fetch vendors data
   */
  const fetchVendors = useCallback(async () => {
    if (!userState.isAuthenticated()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (userState.getUserType() === 'admin') {
        // If admin, fetch all vendors
        const vendorData = await getVendorList();
        setAllVendors(vendorData);
        
        // Set initial page of vendors for display
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        setVendors(vendorData.slice(indexOfFirstItem, indexOfLastItem));
      } else {
        // If vendor, filter for current user's info only
        const vendorData = await getVendorList();
        const currentUserEmail = userState.userInfo?.email;
        
        const filteredVendor = vendorData.filter(vendor => 
          vendor.email === currentUserEmail
        );
        
        setVendors(filteredVendor);
        setAllVendors(filteredVendor);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setError('Failed to load vendors. Please try again later.');
      toast.error('Failed to load vendors. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  /**
   * Handle vendor status change by updating only the affected vendor in the state
   * @param {number} userId - ID of the vendor whose status changed
   * @param {string} newStatus - The new status value
   */
  const handleVendorStatusChange = useCallback((userId, newStatus) => {
    // Update local state without fetching from server again
    setVendors(prevVendors => {
      return prevVendors.map(vendor => {
        if (vendor.user_id === userId) {
          return { ...vendor, status: newStatus };
        }
        return vendor;
      });
    });
    
    // Also update allVendors state
    setAllVendors(prevVendors => {
      return prevVendors.map(vendor => {
        if (vendor.user_id === userId) {
          return { ...vendor, status: newStatus };
        }
        return vendor;
      });
    });
  }, []);

  /**
   * Fetch vendors data on component mount
   */
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  /**
   * Handle pagination page change
   * @param {number} pageNumber - New page number
   */
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    
    // Calculate new page of vendors
    const indexOfLastItem = pageNumber * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setVendors(allVendors.slice(indexOfFirstItem, indexOfLastItem));
  };

  // Redirect if not authenticated
  if (!userState.isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  // Calculate total pages for pagination
  const totalItems = allVendors.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <MainLayout pageTitle="Vendors">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="TableHeader">
                <div className="row">
                  <div className="col-lg-3">
                    <h4 className="card-title">
                      {userState.getUserType() === 'admin' ? 'Vendors' : 'My Profile'}
                    </h4>
                  </div>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p className="mt-2">Loading vendor data...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger" role="alert">
                  {error}
                  <button 
                    className="btn btn-sm btn-outline-danger ml-3"
                    onClick={() => fetchVendors()}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  {vendors.length === 0 ? (
                    <div className="alert alert-info" role="alert">
                      No vendors found
                    </div>
                  ) : (
                    <>
                      <VendorTable 
                        vendors={vendors} 
                        onVendorStatusChange={handleVendorStatusChange}
                      />
                      
                      {userState.getUserType() === 'admin' && totalItems > itemsPerPage && (
                        <Pagination 
                          currentPage={currentPage}
                          totalPages={totalPages}
                          totalItems={totalItems}
                          itemsPerPage={itemsPerPage}
                          onPageChange={handlePageChange}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Vendors;