/**
 * Card component
 * Reusable card component for consistent UI elements
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card component
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.isLoading - Whether card is in loading state
 * @param {string} props.headerClassName - Additional CSS classes for card header
 * @param {string} props.bodyClassName - Additional CSS classes for card body
 * @param {React.ReactNode} props.headerActions - Additional elements to render in card header
 */
const Card = ({
  title,
  children,
  className = '',
  isLoading = false,
  headerClassName = '',
  bodyClassName = '',
  headerActions
}) => {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className={`card-header ${headerClassName}`}>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="card-title mb-0">{title}</h4>
            {headerActions && <div>{headerActions}</div>}
          </div>
        </div>
      )}
      <div className={`card-body ${bodyClassName}`}>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-2">Loading...</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  headerActions: PropTypes.node
};

export default Card;