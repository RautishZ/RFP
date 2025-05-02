import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import velocityLogo from '../../assets/images/velocity_logo.png';
import { userState } from '../../services/userState';
import { USER_ROLES } from '../../constants';

const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const [activeItem, setActiveItem] = useState('');
  const [hoveredItem, setHoveredItem] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const location = useLocation();

  // Responsive check
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 992);
  }, []);

  // Collapse state
  const updateCollapseState = useCallback(() => {}, []);

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

  useEffect(() => {
    const path = location.pathname;
    const route = path.split('/')[1] || 'dashboard';
    setActiveItem(`/${route}`);
  }, [location]);

  // Helper for menu item style
  const getMenuItemStyle = (path) => {
    const isActive = activeItem === path;
    const isHovered = hoveredItem === path;
    let style = {
      color: '#fff',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.3s',
      background: isActive || isHovered ? '#414d59' : 'transparent',
      borderLeft: isActive || isHovered ? '3px solid #38a0f2' : '3px solid transparent',
      fontWeight: isActive ? 'bold' : 'normal',
    };
    return style;
  };

  // Unavailable page handler
  const handleUnavailablePage = (pageName, e) => {
    e.preventDefault();
    toast.info(`${pageName} functionality will be available soon.`, { position: 'top-right', autoClose: 3000 });
  };

  // Sidebar visibility logic based on screen size and showSidebar state
  const shouldShowSidebar = isMobile ? showSidebar : true;
  const isCollapsed = !isMobile && document.body.classList.contains('vertical-collpsed');
  
  // Sidebar style based on visibility and screen size
  const sidebarStyle = {
    display: shouldShowSidebar ? 'block' : 'none',
    width: isMobile && showSidebar ? 250 : (isCollapsed ? 70 : 250), // Always full width (250px) when toggled open on mobile
    left: shouldShowSidebar ? 0 : '-250px',
    transition: 'left 0.2s, width 0.2s',
    zIndex: 2000,
    position: 'fixed',
    top: 0,
    height: '100vh',
    background: '#505d69',
    overflowY: 'auto',
    boxShadow: shouldShowSidebar ? '0 0 15px rgba(0,0,0,0.2)' : 'none',
    scrollbarWidth: 'none', /* Firefox */
    msOverflowStyle: 'none', /* IE and Edge */
  };

  // Apply scrollbar hiding for webkit browsers
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .vertical-menu::-webkit-scrollbar {
        display: none;
      }
      .vertical-menu {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Overlay only for mobile devices
  const overlay = isMobile && showSidebar ? (
    <div
      onClick={() => setShowSidebar(false)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.5)',
        zIndex: 1999,
        transition: 'opacity 0.2s',
      }}
    />
  ) : null;

  // Logo box style based on sidebar visibility and collapse state
  const logoBoxStyle = {
    display: shouldShowSidebar ? 'flex' : 'none',
    background: '#37424a',
    position: 'fixed',
    top: 0,
    left: 0,
    width: isMobile && showSidebar ? 250 : (isCollapsed ? 70 : 250), // Always full width when toggled open on mobile
    zIndex: 2001,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'width 0.2s',
  };

  // Logo size based on sidebar state
  const logoSize = isCollapsed ? 30 : 45;

  // Render
  return (
    <>
      {overlay}
      <div className="navbar-brand-box" style={logoBoxStyle}>
        <Link to="/dashboard" className="logo">
          <img src={velocityLogo} alt="Velocity" height={logoSize} />
        </Link>
      </div>
      <nav className="vertical-menu" style={sidebarStyle}>
        <div style={{ height: 70 }} />
        <div className="h-100">
          <div id="sidebar-menu">
            <ul className="metismenu list-unstyled" id="side-menu">
              <li>
                <Link to="/dashboard" className="waves-effect" style={getMenuItemStyle('/dashboard')}
                  onMouseEnter={() => setHoveredItem('/dashboard')}
                  onMouseLeave={() => setHoveredItem('')}
                >
                  <i className="mdi mdi-file-document-box-outline" style={{ color: '#fff', marginRight: 10, fontSize: 18 }}></i>
                  <span style={{ marginLeft: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Dashboard</span>
                </Link>
              </li>
              {userState.getUserType() === USER_ROLES.ADMIN && (
                <li>
                  <Link to="/vendors" className="waves-effect" style={getMenuItemStyle('/vendors')}
                    onMouseEnter={() => setHoveredItem('/vendors')}
                    onMouseLeave={() => setHoveredItem('')}
                  >
                    <i className="mdi mdi-receipt" style={{ color: '#fff', marginRight: 10, fontSize: 18 }}></i>
                    <span style={{ marginLeft: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Vendors</span>
                  </Link>
                </li>
              )}
              <li>
                <Link to="/rfp" className="waves-effect" style={getMenuItemStyle('/rfp')}
                  onMouseEnter={() => setHoveredItem('/rfp')}
                  onMouseLeave={() => setHoveredItem('')}
                >
                  <i className="mdi mdi-flip-vertical" style={{ color: '#fff', marginRight: 10, fontSize: 18 }}></i>
                  <span style={{ marginLeft: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {userState.getUserType() === USER_ROLES.VENDOR ? 'RFP for Quotes' : 'RFP Lists'}
                  </span>
                </Link>
              </li>
              {userState.getUserType() === USER_ROLES.ADMIN && (
                <>
                  <li>
                    <a href="#" className="waves-effect" style={getMenuItemStyle('/users')}
                      onMouseEnter={() => setHoveredItem('/users')}
                      onMouseLeave={() => setHoveredItem('')}
                      onClick={(e) => handleUnavailablePage('User Management', e)}
                    >
                      <i className="mdi mdi-apps" style={{ color: '#fff', marginRight: 10, fontSize: 18 }}></i>
                      <span style={{ marginLeft: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>User Management</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="waves-effect" style={getMenuItemStyle('/categories')}
                      onMouseEnter={() => setHoveredItem('/categories')}
                      onMouseLeave={() => setHoveredItem('')}
                      onClick={(e) => handleUnavailablePage('Categories', e)}
                    >
                      <i className="mdi mdi-weather-night" style={{ color: '#fff', marginRight: 10, fontSize: 18 }}></i>
                      <span style={{ marginLeft: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Categories</span>
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;