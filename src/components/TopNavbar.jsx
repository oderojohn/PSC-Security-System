import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthService } from '../service/api/api';
import '../assets/css/TopNavbar.css';
import { useAuth } from '../service/auth/AuthContext';

const TopNavbar = () => {
  const [mobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // ✅ get user and logout from context

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    const confirmLogout = window.confirm(`Are you sure you want to logout${user?.username ? `, ${user.username}` : ''}?`);
    if (!confirmLogout) return;

    try {
      await AuthService.logout(); // Optional: call backend logout
    } catch (error) {
      console.warn('Backend logout failed, proceeding anyway');
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <header className="navbar">
      <nav className={`navbar__navigation ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <ul className="navbar__list">
          <li className={`navbar__item ${isActive('/') ? 'navbar__item--active' : ''}`}>
            <Link to="/">Dashboard</Link>
          </li>
         
          <li className={`navbar__item ${isActive('/ReportsDashboard') ? 'navbar__item--active' : ''}`}>
            <Link to="/ReportsDashboard">Reports</Link>
          </li>
          <li className={`navbar__item ${isActive('/PhoneExtensionsDashboard') ? 'navbar__item--active' : ''}`}>
            <Link to="/PhoneExtensionsDashboard">Directory</Link>
          </li>
        </ul>
      </nav>

      <div className="navbar__user">
        <button className="navbar__action">
          <span className="navbar__icon">🔄</span>
          <span className="navbar__action-text">Refresh</span>
        </button>

        <div className="navbar__notifications">
          <span className="navbar__icon">🔔</span>
          <span className="navbar__badge">3</span>
        </div>

        <div className="navbar__profile">
          <img 
            src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740" 
            alt="User Profile" 
            className="navbar__avatar" 
          />
          <div className="navbar__user-info">
            <span className="navbar__user-role">{user?.username || 'User'}</span> {/* ✅ Show username */}
          </div>
          <div className="navbar__dropdown">
            <button 
              className="navbar__logout-button" 
              onClick={handleLogout}
              title="Logout"
            >
              🔌 Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
