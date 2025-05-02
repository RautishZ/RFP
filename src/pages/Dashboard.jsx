/**
 * Dashboard component
 * Main landing page after authentication
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { userState } from '../services/userState';

const Dashboard = () => {
  // Redirect if not authenticated
  if (!userState.isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return (
    <MainLayout pageTitle="Dashboard">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Welcome to RFP System</h4>
              <div className="alert alert-info">
                <p className="mb-0">
                  You are logged in as <strong>{userState.userInfo?.name || 'User'}</strong> ({userState.getUserType() === 'admin' ? 'Administrator' : 'Vendor'})
                </p>
              </div>
              <div className="row mt-4">
                <div className="col-md-6">
                  <div className="card bg-primary text-white mb-4">
                    <div className="card-body">
                      <h5 className="card-title text-white">Quick Navigation</h5>
                      <p className="card-text">Access key features of the system from the sidebar menu.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card bg-success text-white mb-4">
                    <div className="card-body">
                      <h5 className="card-title text-white">Need Help?</h5>
                      <p className="card-text">Contact support at support@velsof.com for assistance.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;