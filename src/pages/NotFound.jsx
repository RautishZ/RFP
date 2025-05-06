import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <h1 className="text-primary mb-4">404</h1>
      <h2 className="mb-4">Page Not Found</h2>
      <p className="text-muted mb-4">The page you are looking for might have been removed or is temporarily unavailable.</p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;