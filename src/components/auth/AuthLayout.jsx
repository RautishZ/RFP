/**
 * AuthLayout component
 * Provides consistent layout for authentication pages (login/register)
 */
import React from "react";

/*
 * AuthLayout component
 */
const AuthLayout = ({ children }) => {
  return (
    <div className="account-pages my-5 pt-sm-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
