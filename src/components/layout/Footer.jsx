import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6">
            2022 &copy; Copyright.
          </div>
          <div className="col-sm-6">
            <div className="text-sm-right d-none d-sm-block">
              Support Email:<a href="#" target="_blank" className="text-muted"> support@velsof.com </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;