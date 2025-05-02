/**
 * AddRFP component
 * Allows admin to create a new RFP with multi-step form
 */
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { userState } from '../services/userState';
import { getCategories, getVendorsByCategory, createRFP } from '../services/rfpService';
import { toast } from 'react-toastify';

const AddRFP = () => {
  const navigate = useNavigate();
  
  // State for the multi-step form
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Category selection state
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  // RFP form data state
  const [rfpData, setRfpData] = useState({
    item_name: '',
    rfp_no: '',
    quantity: '',
    last_date: '',
    minimum_price: '',
    maximum_price: '',
    item_description: '',
    categories: '',
    vendors: '' // Comma-separated list of vendor user_ids
  });
  
  // Vendors state
  const [availableVendors, setAvailableVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  
  // Loading state for vendor fetch operation
  const [loadingVendors, setLoadingVendors] = useState(false);
  
  // Check authentication and user type
  const isAuthenticated = userState.isAuthenticated();
  const userType = userState.getUserType();
  
  // Fetch categories on component mount
  useEffect(() => {
    // Only fetch data if authenticated and admin
    if (!isAuthenticated) {
      return;
    }
    
    if (userType !== 'admin') {
      toast.error('Access denied. Only administrators can access this page.', {
        position: "top-right",
        autoClose: 5000
      });
      return;
    }
    
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCategories();
        // Ensure categories is always an array even if API returns something else
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories. Please try again later.');
        toast.error('Failed to load categories', {
          position: "top-right"
        });
        // Set categories as empty array on error
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [isAuthenticated, userType]);
  
  // Fetch vendors when categories are selected and moving to step 2
  useEffect(() => {
    if (currentStep === 2 && selectedCategories.length > 0) {
      fetchVendorsByCategories();
    }
  }, [currentStep, selectedCategories]);
  
  // Format date for the date input (YYYY-MM-DD)
  const formatDateForInput = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prevSelected => {
      if (prevSelected.includes(categoryId)) {
        return prevSelected.filter(id => id !== categoryId);
      } else {
        return [...prevSelected, categoryId];
      }
    });
  };
  
  // Fetch vendors for selected categories
  const fetchVendorsByCategories = async () => {
    try {
      setLoadingVendors(true);
      console.log('Fetching vendors for selected categories:', selectedCategories);
      
      const vendorPromises = selectedCategories.map(categoryId => 
        getVendorsByCategory(categoryId)
      );
      
      const vendorsResults = await Promise.all(vendorPromises);
      
      // Flatten and deduplicate vendors based on user_id
      const allVendors = vendorsResults.flat();
      const uniqueVendors = Array.from(
        new Map(allVendors.map(vendor => [vendor.user_id, vendor])).values()
      );
      
      console.log('All vendors from all categories:', allVendors);
      console.log('Unique vendors after deduplication:', uniqueVendors);
      
      setAvailableVendors(uniqueVendors);
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
      toast.error('Failed to load vendors', {
        position: "top-right"
      });
    } finally {
      setLoadingVendors(false);
    }
  };
  
  // Handle vendor selection
  const handleVendorChange = (vendorId) => {
    setSelectedVendors(prevSelected => {
      if (prevSelected.includes(vendorId)) {
        return prevSelected.filter(id => id !== vendorId);
      } else {
        return [...prevSelected, vendorId];
      }
    });
  };
  
  // Handle RFP form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRfpData({
      ...rfpData,
      [name]: value
    });
  };
  
  // Move to the next step
  const handleNextStep = () => {
    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category', {
        position: "top-right"
      });
      return;
    }
    
    // Set categories in the form data
    setRfpData(prev => ({
      ...prev,
      categories: selectedCategories.join(',')
    }));
    
    setCurrentStep(2);
  };
  
  // Go back to the previous step
  const handlePrevStep = () => {
    setCurrentStep(1);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (selectedVendors.length === 0) {
      toast.error('Please select at least one vendor', {
        position: "top-right"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare final form data - ensure IDs are integers
      const finalData = {
        ...rfpData,
        vendors: selectedVendors.map(id => parseInt(id, 10)).join(',')
      };
      
      console.log('Final RFP data to be submitted:', finalData);
      
      // Submit to API
      const result = await createRFP(finalData);
      
      // Log API response
      console.log('RFP created successfully. API Response:', result);
      
      toast.success('RFP created successfully', {
        position: "top-right"
      });
      
      // Redirect back to RFP list
      navigate('/rfp');
    } catch (err) {
      console.error('Failed to create RFP:', err);
      
      // Log the error details
      console.log('RFP creation error details:', {
        message: err.message,
        response: err.response
      });
      
      toast.error(err.message || 'Failed to create RFP. Please try again.', {
        position: "top-right"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle redirect for unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Handle redirect for non-admin users
  if (userType !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  // Render step 1: Category Selection
  const renderCategorySelectionStep = () => {
    return (
      <div className="card">
        <div className="card-body">
          <h4 className="card-title mb-4">Select Categories</h4>
          
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {error ? (
                <div className="alert alert-danger">
                  <p className="mb-0">
                    <i className="mdi mdi-alert-circle-outline mr-2"></i>
                    {error}
                  </p>
                </div>
              ) : (
                <>
                  <div className="row">
                    {categories.length === 0 ? (
                      <div className="col-12">
                        <div className="alert alert-info">
                          <p className="mb-0">
                            <i className="mdi mdi-information-outline mr-2"></i>
                            No categories available.
                          </p>
                        </div>
                      </div>
                    ) : (
                      categories.map(category => (
                        <div className="col-md-4" key={category.id}>
                          <div className="custom-control custom-checkbox mb-3">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={`category-${category.id}`}
                              checked={selectedCategories.includes(category.id)}
                              onChange={() => handleCategoryChange(category.id)}
                            />
                            <label className="custom-control-label" htmlFor={`category-${category.id}`}>
                              {category.name}
                            </label>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="form-group mt-4 text-right">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNextStep}
                      disabled={selectedCategories.length === 0}
                    >
                      Next <i className="mdi mdi-arrow-right ml-1"></i>
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    );
  };
  
  // Render step 2: RFP Form
  const renderRFPFormStep = () => {
    return (
      <div className="card">
        <div className="card-body">
          <h4 className="card-title mb-4">Create RFP</h4>
          
          {loading ? (
            <LoadingSpinner />
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="item_name">Item Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      id="item_name"
                      name="item_name"
                      value={rfpData.item_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="rfp_no">RFP Number <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      id="rfp_no"
                      name="rfp_no"
                      value={rfpData.rfp_no}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="quantity">Quantity <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      className="form-control"
                      id="quantity"
                      name="quantity"
                      value={rfpData.quantity}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="last_date">Last Date <span className="text-danger">*</span></label>
                    <input
                      type="date"
                      className="form-control"
                      id="last_date"
                      name="last_date"
                      value={rfpData.last_date}
                      onChange={handleInputChange}
                      required
                      min={formatDateForInput()}
                    />
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="minimum_price">Minimum Price <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      className="form-control"
                      id="minimum_price"
                      name="minimum_price"
                      value={rfpData.minimum_price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="maximum_price">Maximum Price <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      className="form-control"
                      id="maximum_price"
                      name="maximum_price"
                      value={rfpData.maximum_price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="item_description">Item Description <span className="text-danger">*</span></label>
                <textarea
                  className="form-control"
                  id="item_description"
                  name="item_description"
                  rows="4"
                  value={rfpData.item_description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>Selected Categories</label>
                <div className="selected-categories">
                  {selectedCategories.map(categoryId => {
                    const category = categories.find(c => c.id === categoryId);
                    return (
                      <span key={categoryId} className="badge badge-primary mr-2 mb-2">
                        {category ? category.name : `Category ${categoryId}`}
                      </span>
                    );
                  })}
                </div>
              </div>
              
              <div className="form-group">
                <label>
                  <i className="mdi mdi-account-check mr-1"></i>
                  Select Approved Vendors <span className="text-danger">*</span>
                </label>
                {loadingVendors ? (
                  <LoadingSpinner />
                ) : (
                  <div className="row">
                    {availableVendors.length === 0 ? (
                      <div className="col-12">
                        <div className="alert alert-info">
                          <p className="mb-0">
                            <i className="mdi mdi-information-outline mr-2"></i>
                            No approved vendors available for the selected categories.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="col-12 mb-3">
                          <div className="alert alert-success">
                            <p className="mb-0">
                              <i className="mdi mdi-information-outline mr-2"></i>
                              Showing only approved vendors. Total: {availableVendors.length}
                            </p>
                          </div>
                        </div>
                        
                        {availableVendors.map(vendor => (
                          <div className="col-md-4" key={vendor.user_id}>
                            <div className="custom-control custom-checkbox mb-3">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={`vendor-${vendor.user_id}`}
                                checked={selectedVendors.includes(vendor.user_id)}
                                onChange={() => handleVendorChange(vendor.user_id)}
                              />
                              <label className="custom-control-label" htmlFor={`vendor-${vendor.user_id}`}>
                                {vendor.name} ({vendor.email})
                              </label>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
              
              <div className="form-group mt-4 d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handlePrevStep}
                  disabled={loading}
                >
                  <i className="mdi mdi-arrow-left mr-1"></i> Back
                </button>
                
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading || selectedVendors.length === 0}
                >
                  {loading ? (
                    <>
                      <i className="mdi mdi-loading mdi-spin mr-1"></i> Saving RFP...
                    </>
                  ) : (
                    <>
                      <i className="mdi mdi-content-save mr-1"></i> Save RFP
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <MainLayout pageTitle="Create RFP">
      <div className="row">
        <div className="col-lg-12">
          <div className="page-title-box">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h6 className="page-title">Create New RFP</h6>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="/dashboard">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="/rfp">RFP</a>
                  </li>
                  <li className="breadcrumb-item active">Create RFP</li>
                </ol>
              </div>
            </div>
          </div>
          
          {/* Steps indicator */}
          <div className="steps-indicator mb-4">
            <div className="row">
              <div className="col-6">
                <div className={`step ${currentStep === 1 ? 'active' : 'completed'}`}>
                  <div className="step-number">1</div>
                  <div className="step-title">Select Categories</div>
                </div>
              </div>
              <div className="col-6">
                <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
                  <div className="step-number">2</div>
                  <div className="step-title">Create RFP</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Current step content */}
          {currentStep === 1 ? renderCategorySelectionStep() : renderRFPFormStep()}
        </div>
      </div>
      
      <style>
        {`
        .steps-indicator {
          margin-bottom: 20px;
        }
        .step {
          display: flex;
          align-items: center;
          padding: 10px;
          border-radius: 4px;
          background-color: #f8f9fa;
        }
        .step.active {
          background-color: #eff8ff;
          border-left: 3px solid #2c9aff;
        }
        .step.completed {
          background-color: #e8f5e9;
          border-left: 3px solid #43a047;
        }
        .step-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #e0e0e0;
          color: #616161;
          font-weight: bold;
          margin-right: 10px;
        }
        .step.active .step-number {
          background-color: #2c9aff;
          color: white;
        }
        .step.completed .step-number {
          background-color: #43a047;
          color: white;
        }
        .step-title {
          font-weight: 500;
        }
        .selected-categories {
          display: flex;
          flex-wrap: wrap;
          margin-top: 5px;
        }
        `}
      </style>
    </MainLayout>
  );
};

export default AddRFP;