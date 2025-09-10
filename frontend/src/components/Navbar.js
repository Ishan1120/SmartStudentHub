import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Don't show navbar on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-brand">
          Smart Student Hub
        </Link>
        
        <div className="nav-links">
          {user.role === 'student' && (
            <>
              <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
                Dashboard
              </Link>
              <Link to="/activities" className={location.pathname === '/activities' ? 'active' : ''}>
                Activities
              </Link>
              <Link to="/portfolio" className={location.pathname === '/portfolio' ? 'active' : ''}>
                Portfolio
              </Link>
            </>
          )}
          
          {(user.role === 'faculty' || user.role === 'admin') && (
            <>
              <Link to="/faculty" className={location.pathname === '/faculty' ? 'active' : ''}>
                Faculty Dashboard
              </Link>
              <Link to="/faculty/approvals" className={location.pathname === '/faculty/approvals' ? 'active' : ''}>
                Approvals
              </Link>
              <Link to="/faculty/analytics" className={location.pathname === '/faculty/analytics' ? 'active' : ''}>
                Analytics
              </Link>
            </>
          )}
        </div>
        
        <div className="nav-user">
          <span className="user-name">{user.name}</span>
          <span className="user-role">({user.role})</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
