/**
 * Card component
 * Reusable card component for consistent UI elements
 */
import React from "react";

/**
 * Card component
 */
const Card = ({
  title,
  children,
  className = "",
  isLoading = false,
  headerClassName = "",
  bodyClassName = "",
  headerActions,
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

export default Card;
