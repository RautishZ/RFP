/**
 * Register component
 * Handles vendor registration with form validation and error handling
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerVendor, getCategories } from '../services/vendorService';
import '../assets/css/bootstrap.min.css';
import '../assets/css/icons.min.css';
import '../assets/css/app.min.css';

const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    revenue: '',
    no_of_employees: '',
    category: [],
    pancard_no: '',
    gst_no: '',
    mobile: ''
  });

  /**
   * Fetch categories when component mounts
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoriesData = await getCategories();
        
        // Convert the object of categories to an array format that matches our existing structure
        const categoriesArray = Object.keys(categoriesData).map(key => ({
          id: categoriesData[key].id.toString(),
          name: categoriesData[key].name,
          status: categoriesData[key].status
        }));
        
        setCategories(categoriesArray);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories. Using default categories instead.');
        // If fetching fails, use default categories
        setCategories([
          { id: "1", name: "Software", status: "Active" },
          { id: "2", name: "Hardware", status: "Active" },
          { id: "3", name: "Office Furniture", status: "Active" },
          { id: "4", name: "Stationery", status: "Active" }
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  /**
   * Handles input field changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'category') {
      // Handle multiple select for categories using checkboxes
      const selectedCategoryId = value;
      let updatedCategories;
      
      if (formData.category.includes(selectedCategoryId)) {
        // If already selected, remove it (uncheck)
        updatedCategories = formData.category.filter(id => id !== selectedCategoryId);
      } else {
        // If not selected, add it (check)
        updatedCategories = [...formData.category, selectedCategoryId];
      }
      
      setFormData({
        ...formData,
        category: updatedCategories
      });

      // Clear category error if at least one is selected
      if (updatedCategories.length > 0 && errors.category) {
        setErrors({
          ...errors,
          category: ''
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
      
      // Clear field-specific error when user starts typing
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: ''
        });
      }
    }
  };

  /**
   * Checks if a category is selected
   */
  const isCategorySelected = (categoryId) => {
    return formData.category.includes(categoryId);
  };

  /**
   * Validates form data before submission
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.firstname) {
      newErrors.firstname = 'First name is required';
    }
    
    if (!formData.lastname) {
      newErrors.lastname = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.revenue) {
      newErrors.revenue = 'Revenue is required';
    } else if (!formData.revenue.includes(',') || formData.revenue.split(',').length < 3) {
      newErrors.revenue = 'Enter last three years revenue, separated by commas';
    }
    
    if (!formData.no_of_employees) {
      newErrors.no_of_employees = 'Number of employees is required';
    } else if (isNaN(formData.no_of_employees) || Number(formData.no_of_employees) <= 0) {
      newErrors.no_of_employees = 'Enter a valid number of employees';
    }
    
    if (formData.category.length === 0) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.pancard_no) {
      newErrors.pancard_no = 'PAN card number is required';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pancard_no)) {
      newErrors.pancard_no = 'Enter a valid PAN card number (e.g., ABCDE1234F)';
    }
    
    if (!formData.gst_no) {
      newErrors.gst_no = 'GST number is required';
    } 
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }
    
    setErrors(newErrors);
    
    // Display validation errors as toasts
    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach(error => {
        toast.error(error);
      });
      return false;
    }
    
    return true;
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare data for API
      const apiData = {
        ...formData,
        category: formData.category.join(',') // Convert array to comma-separated string for API
      };
      
      // Remove confirmPassword as it's not needed for the API
      delete apiData.confirmPassword;
      
      // Call API to register vendor
      await registerVendor(apiData);
      
      
      // Reset form after successful registration
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
        revenue: '',
        no_of_employees: '',
        category: [],
        pancard_no: '',
        gst_no: '',
        mobile: ''
      });
      
      // Redirect to login page after short delay to allow user to see the success message
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      // Errors are handled by the API service with toast, but we can add a general error message here as a fallback
      toast.error('An error occurred during registration. Please try again.', {
        position: "top-center"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark"><i className="fas fa-home h2"></i></Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-xl-8">
              <div className="card overflow-hidden">
                <div className="bg-soft-primary">
                  <div className="row">
                    <div className="col-12">
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Welcome to RFP System!</h5>
                        <p>Register as Vendor</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body pt-0"> 
                  <div className="p-4">
                    <form className="form-horizontal" onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group">
                            <label htmlFor="firstname">First name*</label>
                            <input 
                              type="text" 
                              className={`form-control ${errors.firstname ? 'is-invalid' : ''}`}
                              id="firstname" 
                              name="firstname"
                              placeholder="Enter Firstname"
                              value={formData.firstname}
                              onChange={handleChange}
                              required
                            />
                            {errors.firstname && <div className="invalid-feedback">{errors.firstname}</div>}
                          </div>
                        </div>
                        <div className="col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group">
                            <label htmlFor="lastname">Last Name<em>*</em></label>
                            <input 
                              type="text" 
                              className={`form-control ${errors.lastname ? 'is-invalid' : ''}`}
                              id="lastname" 
                              name="lastname"
                              placeholder="Enter Lastname"
                              value={formData.lastname}
                              onChange={handleChange}
                              required
                            />
                            {errors.lastname && <div className="invalid-feedback">{errors.lastname}</div>}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="email">Email*</label>
                            <input 
                              type="email" 
                              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                              id="email" 
                              name="email"
                              placeholder="Enter Email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                          </div>
                        </div>
                        
                        <div className="col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group">
                            <label htmlFor="password">Password*</label>
                            <input 
                              type="password" 
                              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                              id="password" 
                              name="password"
                              placeholder="Enter Password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                          </div>
                        </div>
                        <div className="col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password*</label>
                            <input 
                              type="password" 
                              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                              id="confirmPassword" 
                              name="confirmPassword"
                              placeholder="Enter Confirm Password"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              required
                            />
                            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                          </div>
                        </div>

                        <div className="col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group">
                            <label htmlFor="revenue">Revenue (Last 3 Years in Lacks)*</label>
                            <input 
                              type="text" 
                              className={`form-control ${errors.revenue ? 'is-invalid' : ''}`}
                              id="revenue" 
                              name="revenue"
                              placeholder="Format: 1000,2000,3000"
                              value={formData.revenue}
                              onChange={handleChange}
                              required
                            />
                            {errors.revenue && <div className="invalid-feedback">{errors.revenue}</div>}
                            <small className="form-text text-muted">Enter comma-separated values for last 3 years</small>
                          </div>
                        </div>
                        <div className="col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group">
                            <label htmlFor="no_of_employees">No of Employees*</label>
                            <input 
                              type="number" 
                              className={`form-control ${errors.no_of_employees ? 'is-invalid' : ''}`}
                              id="no_of_employees" 
                              name="no_of_employees"
                              placeholder="No of Employees"
                              value={formData.no_of_employees}
                              onChange={handleChange}
                              required
                            />
                            {errors.no_of_employees && <div className="invalid-feedback">{errors.no_of_employees}</div>}
                          </div>
                        </div>

                        <div className="col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group">
                            <label htmlFor="gst_no">GST No*</label>
                            <input 
                              type="text" 
                              className={`form-control ${errors.gst_no ? 'is-invalid' : ''}`}
                              id="gst_no" 
                              name="gst_no"
                              placeholder="Enter GST No"
                              value={formData.gst_no}
                              onChange={handleChange}
                              required
                            />
                            {errors.gst_no && <div className="invalid-feedback">{errors.gst_no}</div>}
                          </div>
                        </div>
                        <div className="col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group">
                            <label htmlFor="pancard_no">PAN No*</label>
                            <input 
                              type="text" 
                              className={`form-control ${errors.pancard_no ? 'is-invalid' : ''}`}
                              id="pancard_no" 
                              name="pancard_no"
                              placeholder="Enter PAN No"
                              value={formData.pancard_no}
                              onChange={handleChange}
                              required
                            />
                            {errors.pancard_no && <div className="invalid-feedback">{errors.pancard_no}</div>}
                          </div>
                        </div>
                        <div className="col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group">
                            <label htmlFor="mobile">Phone No*</label>
                            <input 
                              type="text" 
                              className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                              id="mobile" 
                              name="mobile"
                              placeholder="Enter Phone No"
                              value={formData.mobile}
                              onChange={handleChange}
                              required
                            />
                            {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                          </div>
                        </div>
                        <div className="col-md-12 col-lg-6 col-xl-6">
                          <div className="form-group">
                            <label>Categories*</label>
                            <div className={`category-scrollbox ${errors.category ? 'border-danger' : ''}`} style={{
                              maxHeight: '150px', 
                              overflowY: 'auto', 
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem',
                              padding: '10px'
                            }}>
                              {loadingCategories ? (
                                <div className="text-center">
                                  <span>Loading categories...</span>
                                </div>
                              ) : (
                                categories.map(option => (
                                  <div key={option.id} className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={`category-${option.id}`}
                                      name="category"
                                      value={option.id}
                                      checked={isCategorySelected(option.id)}
                                      onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor={`category-${option.id}`}>
                                      {option.name}
                                      {option.status !== "Active" && <span className="text-muted"> ({option.status})</span>}
                                    </label>
                                  </div>
                                ))
                              )}
                            </div>
                            {errors.category && <div className="text-danger small mt-1">{errors.category}</div>}
                            {categories.length === 0 && !loadingCategories && (
                              <small className="text-danger">No categories available. Please contact administrator.</small>
                            )}
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="p-2 mt-3">
                            <button 
                              className="btn btn-primary btn-block waves-effect waves-light" 
                              type="submit"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? 'Registering...' : 'Register'}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 text-center">
                        <p>Already have an account? <Link to="/" className="text-muted"><i className="mdi mdi-lock mr-1"></i> Login</Link></p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="mt-5 text-center">
                <div>
                  <p>&copy; Copyright <i className="mdi mdi-heart text-danger"></i> RFP System</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Register;