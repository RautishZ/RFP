/**
 * RFPQuotes component
 * Displays quotes for a specific RFP
 */
import React, { useState, useEffect } from 'react';
import { Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { userState } from '../services/userState';
import { getRFPQuotes } from '../services/rfpService';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const RFPQuotes = () => {
  const { id } = useParams(); // Get RFP ID from URL
  const navigate = useNavigate();
  const [quotesData, setQuotesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check authentication
  const isAuthenticated = userState.isAuthenticated();

  // Fetch quotes data on component mount
  useEffect(() => {
    // Only fetch data if authenticated
    if (!isAuthenticated || !id) {
      return;
    }
    
    const fetchQuotesData = async () => {
      try {
        setLoading(true);
        
        // Use the dedicated quotes API endpoint now
        const quotes = await getRFPQuotes(id);
        setQuotesData(quotes);
        setError(null);
      } catch (err) {
      
        
        // Check if this is the specific "No quotes available" error
        if (err.message && err.message.includes('No quotes available')) {
          // Set quotesData to empty array but don't set error
          // This will show the "No quotes" message in the UI only once
          setQuotesData([]);
          setError(null);
          // No toast here to avoid duplication
        } 
      } finally {
        setLoading(false);
      }
    };

    fetchQuotesData();
  }, [isAuthenticated, id]);

  // Handle redirect for unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Handle back button click
  const handleBackClick = () => {
    navigate('/rfp');
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  return (
    <MainLayout pageTitle="RFP Quotes">
      <div className="row">
        <div className="col-12 mb-3">
          <button 
            className="btn btn-secondary" 
            onClick={handleBackClick}
          >
            <i className="mdi mdi-arrow-left mr-1"></i> Back to RFP List
          </button>
        </div>
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="TableHeader">
                <div className="row">
                  <div className="col-lg-12">
                    <h4 className="card-title">Quotes for RFP #{id}</h4>
                  </div>
                </div>
              </div>
              
              {loading ? (
                <LoadingSpinner />
              ) : error ? (
                <div className="alert alert-danger">
                  <p className="mb-0">
                    <i className="mdi mdi-alert-circle-outline mr-2"></i>
                    {error}
                  </p>
                </div>
              ) : quotesData.length === 0 ? (
                <div className="alert alert-info">
                  <p className="mb-0">
                    <i className="mdi mdi-information-outline mr-2"></i>
                    No quotes have been submitted for this RFP yet.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table mb-0 dt-responsive">
                    <thead>
                      <tr>
                        <th>Vendor Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Item Price</th>
                        <th>Total Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotesData.map((quote, index) => (
                        <tr key={index}>
                          <td>{quote.name}</td>
                          <td>{quote.email}</td>
                          <td>{quote.mobile}</td>
                          <td>{formatCurrency(quote.item_price)}</td>
                          <td>{formatCurrency(quote.total_cost)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RFPQuotes;