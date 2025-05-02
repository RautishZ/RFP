/**
 * AuthLayout component
 * Provides consistent layout for authentication pages (login/register)
 */
import React from 'react';

// CSS imports
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/icons.min.css';
import '../../assets/css/app.min.css';
import '../../assets/css/style.css';

/**
 * AuthLayout component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Authentication form content to render
 */
const AuthLayout = ({ children }) => {
  return (
    <div className="account-pages my-5 pt-sm-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;