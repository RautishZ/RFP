// filepath: c:\Users\rauti\OneDrive\Desktop\VelocityHr\src\components\ui\ApplyRFPModal.jsx
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

/**
 * A dedicated modal component for applying to RFPs
 * @param {Object} props Component props
 * @param {boolean} props.show Whether the modal is visible
 * @param {Function} props.onHide Function to close the modal
 * @param {Object} props.selectedRfp The RFP data for which the quote is being submitted
 * @param {Function} props.onSubmit Function to submit the quote
 * @param {boolean} props.isSubmitting Whether a submission is in progress
 */
const ApplyRFPModal = ({ 
  show, 
  onHide, 
  selectedRfp, 
  onSubmit, 
  isSubmitting = false 
}) => {
  // State for form data
  const [quoteData, setQuoteData] = useState({
    item_price: '',
    total_cost: ''
  });
  
  // State for validation errors
  const [formErrors, setFormErrors] = useState({});

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

  // Handle input change for the quote form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuoteData({
      ...quoteData,
      [name]: value
    });
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    const itemPrice = parseFloat(quoteData.item_price);
    const minPrice = parseFloat(selectedRfp?.minimum_price || 0);
    const maxPrice = parseFloat(selectedRfp?.maximum_price || 0);

    if (!quoteData.item_price) {
      errors.item_price = 'Quote price is required';
    } else if (itemPrice < minPrice) {
      errors.item_price = `Price cannot be less than ${minPrice}`;
    } else if (itemPrice > maxPrice) {
      errors.item_price = `Price cannot exceed ${maxPrice}`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare the data to submit
    const dataToSubmit = { ...quoteData };
    
    // Calculate total cost if only item price is provided
    if (dataToSubmit.item_price && !dataToSubmit.total_cost && selectedRfp) {
      const itemPrice = parseFloat(dataToSubmit.item_price);
      const quantity = parseInt(selectedRfp.quantity || 1, 10);
      dataToSubmit.total_cost = (itemPrice * quantity).toString();
    }
    
    onSubmit(selectedRfp.rfp_id, dataToSubmit);
    
    // Reset form after submission
    setQuoteData({
      item_price: '',
      total_cost: ''
    });
    setFormErrors({});
  };

  // Reset form when modal is opened with a new RFP
  React.useEffect(() => {
    if (show) {
      setQuoteData({
        item_price: '',
        total_cost: ''
      });
      setFormErrors({});
    }
  }, [show, selectedRfp]);

  return (
    <Modal 
      show={show} 
      onHide={onHide}
      centered
      className="custom-modal"
    >
      <div className="modal-header-custom">
        <h5 className="modal-title">
          <i className="mdi mdi-file-document-outline mr-2"></i>
          Apply for RFP: {selectedRfp?.item_name}
        </h5>
        <button 
          type="button" 
          className="close" 
          onClick={onHide}
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body-custom">
        {selectedRfp && (
          <div className="rfp-summary mb-4">
            <div className="card bg-light">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>RFP ID:</strong> {selectedRfp.rfp_id}</p>
                    <p className="mb-1"><strong>Item Name:</strong> {selectedRfp.item_name}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Quantity:</strong> {selectedRfp.quantity || 1}</p>
                    <p className="mb-1"><strong>Deadline:</strong> {formatDate(selectedRfp.last_date)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className={`form-group ${formErrors.item_price ? 'has-error' : ''}`}>
            <label htmlFor="item_price">
              <i className="mdi mdi-cash-multiple mr-1"></i>
              Quote Price Per Item <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">₹</span>
              </div>
              <input
                type="number"
                className={`form-control ${formErrors.item_price ? 'is-invalid' : ''}`}
                id="item_price"
                name="item_price"
                value={quoteData.item_price}
                onChange={handleInputChange}
                min={selectedRfp?.minimum_price || 0}
                max={selectedRfp?.maximum_price || 99999999}
                step="0.01"
                required
              />
            </div>
            {formErrors.item_price ? (
              <div className="error">{formErrors.item_price}</div>
            ) : (
              <small className="form-text text-muted">
                <i className="mdi mdi-information-outline mr-1"></i>
                Price should be between {formatCurrency(selectedRfp?.minimum_price || 0)} and {formatCurrency(selectedRfp?.maximum_price || 0)}
              </small>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="total_cost">
              <i className="mdi mdi-calculator mr-1"></i>
              Total Cost <span className="text-info">(Optional)</span>
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">₹</span>
              </div>
              <input
                type="number"
                className="form-control"
                id="total_cost"
                name="total_cost"
                value={quoteData.total_cost}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="Will be calculated automatically"
              />
            </div>
            <small className="form-text text-muted">
              <i className="mdi mdi-information-outline mr-1"></i>
              If left empty, this will be calculated as Item Price × Quantity ({selectedRfp?.quantity || 1})
            </small>
          </div>
          
          <div className="modal-footer-custom">
            <div className="action-buttons">
              <button 
                type="button" 
                className="btn btn-light waves-effect mr-3" 
                onClick={onHide}
              >
                <i className="mdi mdi-close mr-1"></i> Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary waves-effect waves-light" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="mdi mdi-loading mdi-spin mr-1"></i> Submitting...
                  </>
                ) : (
                  <>
                    <i className="mdi mdi-send mr-1"></i> Submit Quote
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .custom-modal .modal-content {
          border: none;
          border-radius: 0.5rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .modal-header-custom {
          background: linear-gradient(to right, #3d8ef8, #11c46e);
          color: #fff;
          padding: 1rem;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .modal-header-custom .modal-title {
          margin: 0;
          font-weight: 600;
          display: flex;
          align-items: center;
          font-size: 1.1rem;
        }
        
        .modal-header-custom .close {
          color: #fff;
          opacity: 0.8;
          text-shadow: none;
          font-size: 1.5rem;
          padding: 0;
          margin: 0;
        }
        
        .modal-header-custom .close:hover {
          opacity: 1;
        }
        
        .modal-body-custom {
          padding: 1.5rem;
        }
        
        .modal-footer-custom {
          border-top: 1px solid #eff2f7;
          padding-top: 1.5rem;
          margin-top: 1rem;
          display: flex;
          justify-content: flex-end;
        }
        
        .action-buttons {
          display: flex;
          align-items: center;
        }

        .rfp-summary {
          border-left: 3px solid #3d8ef8;
        }
        
        .input-group-text {
          background-color: #eff2f7;
          border-color: #ced4da;
          color: #505d69;
        }
        
        .has-error .form-control {
          border-color: #fb4d53;
        }
        
        .error {
          color: #fb4d53;
          font-size: 12px;
          margin-top: 5px;
        }
      `}</style>
    </Modal>
  );
};

export default ApplyRFPModal;