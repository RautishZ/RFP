/**
 * Button component
 * Reusable button component with various styles and sizes
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button component
 */
const Button = ({
  variant = 'primary',
  size = '',
  className = '',
  outline = false,
  block = false,
  disabled = false,
  onClick,
  children,
  ...rest
}) => {
  // Build button classes
  const buttonClasses = [
    'btn',
    outline ? `btn-outline-${variant}` : `btn-${variant}`,
    size ? `btn-${size}` : '',
    block ? 'btn-block' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', '']),
  className: PropTypes.string,
  outline: PropTypes.bool,
  block: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired
};

export default Button;