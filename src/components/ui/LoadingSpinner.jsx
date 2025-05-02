/**
 * LoadingSpinner component
 * Reusable loading spinner with customizable text
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * LoadingSpinner component
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the spinner (sm, md, lg)
 * @param {string} props.color - Color of the spinner (primary, secondary, success, etc.)
 * @param {string} props.text - Text to display below spinner
 * @param {string} props.className - Additional CSS classes
 */
const LoadingSpinner = ({
  size = '',
  color = 'primary',
  text = 'Loading...',
  className = ''
}) => {
  const spinnerClasses = [
    'spinner-border',
    size ? `spinner-border-${size}` : '',
    `text-${color}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="text-center py-4">
      <div className={spinnerClasses} role="status">
        <span className="sr-only">Loading...</span>
      </div>
      {text && <p className="mt-2">{text}</p>}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', '']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']),
  text: PropTypes.string,
  className: PropTypes.string
};

export default LoadingSpinner;