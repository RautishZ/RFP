import React from 'react';
import { userState } from '../../services/userState';
import { logout } from '../../services/authService';

const Header = ({ isSidebarCollapsed, setShowSidebar, isMobile, showSidebar }) => {
  const headerStyles = {
    header: {
      position: 'fixed',
      top: 0,
      right: 0,
      left: isMobile ? '0' : (isSidebarCollapsed ? '70px' : '250px'),
      zIndex: 1009,
      backgroundColor: '#ffffff',
      transition: 'left 0.2s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
      height: '70px',
      width: isMobile ? '100%' : 'auto',
    },
    toggleButton: {
      background: 'transparent',
      border: 'none',
      color: '#505d69',
      fontSize: '24px',
      cursor: 'pointer',
      padding: '0 15px',
      display: 'flex',
      alignItems: 'center',
      height: '70px',
      outline: 'none',
    },
    navbarHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      height: '70px',
      padding: '0 15px',
      alignItems: 'center',
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
    },
    username: {
      marginRight: '15px',
    },
    logoutLink: {
      color: '#3d8ef8',
      textDecoration: 'none',
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    window.location.href = '/login';
  };

  // Toggle sidebar: always show full sidebar on toggle click
  const handleToggleSidebar = () => {
    if (isMobile) {
      // On mobile, simply show/hide the sidebar overlay
      setShowSidebar(!showSidebar); // Toggle the sidebar state
    } else {
      // On desktop, toggle between hidden and full sidebar (not collapsed)
      if (document.body.classList.contains('vertical-collpsed')) {
        document.body.classList.remove('vertical-collpsed');
      } else {
        document.body.classList.add('vertical-collpsed');
      }
    }
  };

  return (
    <header id="page-topbar" style={headerStyles.header}>
      <div style={headerStyles.navbarHeader}>
        <div>
          {/* Toggle button for sidebar */}
          <button
            type="button"
            className="sidebar-toggle-btn"
            style={headerStyles.toggleButton}
            onClick={handleToggleSidebar}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-label={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <i className={`mdi ${isSidebarCollapsed ? 'mdi-menu' : 'mdi-backburger'}`}></i>
          </button>
        </div>
        <div style={headerStyles.userSection}>
          <span style={headerStyles.username} className="d-none d-md-inline-block">
            Welcome {userState.userInfo?.name || 'User'}
          </span>
          <a href="#" style={headerStyles.logoutLink} onClick={handleLogout}>
            <i className="mdi mdi-logout mr-1"></i>
            <span className="d-none d-md-inline-block">Logout</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;