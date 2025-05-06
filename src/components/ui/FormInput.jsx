/**
 * FormInput component
 * Reusable form input component with label and validation
 */
import React from "react";

/**
 * FormInput component
 */
const FormInput = ({
  id,
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
  error = "",
  className = "",
  disabled = false,
  ...rest
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className={required ? "required" : ""}>
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`form-control ${error ? "is-invalid" : ""} ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        {...rest}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default FormInput;
