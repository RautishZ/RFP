/**
 * Login component
 * Handles user authentication and redirection to dashboard
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../services/authService';
import AuthLayout from '../components/auth/AuthLayout';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles input field changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
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
  };

  /**
   * Validates form data before submission
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    // Validate form
    if (!validateForm()) {
      // Display validation errors as toasts
      Object.values(errors).forEach(error => {
        if (error) toast.error(error);
      });
      return;
    }

    try {
      setIsSubmitting(true);
       
      await login(formData.email, formData.password);
      // After successful login, navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      // Error is already handled by API service with toast
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles forgot password link click
   */
  const handleForgotPassword = (e) => {
    e.preventDefault();
    toast.info('Password reset functionality will be available soon!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  return (
    <AuthLayout>
      <div className="card overflow-hidden">
        <div className="bg-soft-primary">
          <div className="row">
            <div className="col-12">
              <div className="text-primary p-4">
                <h5 className="text-primary">Welcome to RFP System!</h5>
                <p>Sign in to continue</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          <div className="p-2">
            <form className="form-horizontal" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
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
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
              <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" id="customControlInline" />
                <label className="custom-control-label" htmlFor="customControlInline">Remember me</label>
              </div>
              <div className="mt-3">
                <button 
                  className="btn btn-primary btn-block waves-effect waves-light" 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Log In'}
                </button>
              </div>
              <div className="mt-4 text-center">
                <Link to="/register" className="text-muted"><i className="mdi mdi-lock mr-1"></i> Register as Vendor</Link>
              </div>
              <div className="mt-4 text-center">
                <a href="#" onClick={handleForgotPassword} className="text-muted">
                  <i className="mdi mdi-lock mr-1"></i> Forgot your password?
                </a>
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
    </AuthLayout>
  );
};

export default Login;