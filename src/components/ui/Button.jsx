/**
 * Button component
 * Reusable button component with various styles and sizes
 */
import React from "react";

/**
 * Button component
 */
const Button = ({
  variant = "primary",
  size = "",
  className = "",
  outline = false,
  block = false,
  disabled = false,
  onClick,
  children,
  ...rest
}) => {
  // Build button classes
  const buttonClasses = [
    "btn",
    outline ? `btn-outline-${variant}` : `btn-${variant}`,
    size ? `btn-${size}` : "",
    block ? "btn-block" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

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

export default Button;
