/**
 * LoadingSpinner component
 * Reusable loading spinner with customizable text
 */
import React from "react";

/**
 * LoadingSpinner component
 */
const LoadingSpinner = ({
  size = "",
  color = "primary",
  text = "Loading...",
  className = "",
}) => {
  const spinnerClasses = [
    "spinner-border",
    size ? `spinner-border-${size}` : "",
    `text-${color}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="text-center py-4">
      <div className={spinnerClasses} role="status">
        <span className="sr-only">Loading...</span>
      </div>
      {text && <p className="mt-2">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
