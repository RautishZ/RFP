/**
 * MainLayout component
 * Provides consistent layout structure for authenticated pages
 * Includes header, sidebar, and footer components
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { userState } from '../../services/userState';

// CSS imports
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/icons.min.css';
import '../../assets/css/app.min.css';
import '../../assets/css/style.css';
import '../../assets/libs/datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';

/**
 * MainLayout component for authenticated pages
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render in layout
 * @param {string} props.pageTitle - Title of the page to display in header and breadcrumbs
 */
const MainLayout = ({ children, pageTitle = 'Dashboard' }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const isAuthenticated = userState.isAuthenticated();

  // Responsive check
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 992);
    if (window.innerWidth >= 992) setShowSidebar(false);
  }, []);

  // Collapse state
  const updateCollapseState = useCallback(() => {
    setIsSidebarCollapsed(document.body.classList.contains('vertical-collpsed'));
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    updateCollapseState();
    const observer = new MutationObserver(updateCollapseState);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [updateCollapseState]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Center main content, no right-side space
  const mainContentStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: isMobile ? 0 : (isSidebarCollapsed ? 70 : 250),
    marginRight: 0,
    width: isMobile ? '100%' : `calc(100% - ${(isSidebarCollapsed ? 70 : 250)}px)`,
    transition: 'all 0.2s',
    position: 'relative',
    zIndex: 1001
  };

  return (
    <div id="layout-wrapper" data-sidebar="dark" style={{ background: '#fff' }}>
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <Header
        isSidebarCollapsed={isSidebarCollapsed}
        setShowSidebar={setShowSidebar}
        showSidebar={showSidebar}
        isMobile={isMobile}
      />
      <div className="main-content" style={mainContentStyle}>
        <div className="page-content" style={{ paddingTop: '90px', width: '100%', maxWidth: 1200 }}>
          <div className="container-fluid">
            {/* start page title */}
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                  <h4 className="mb-0 font-size-18">{pageTitle}</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                      {pageTitle !== 'Dashboard' && (
                        <li className="breadcrumb-item active">{pageTitle}</li>
                      )}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            {/* end page title */}
            {children}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;