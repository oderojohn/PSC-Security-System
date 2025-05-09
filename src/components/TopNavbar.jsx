
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/css/TopNavbar.css';

const TopNavbar = () => {
  const [mobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="navbar">
      <nav className={`navbar__navigation ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <ul className="navbar__list">
          <li className={`navbar__item ${isActive('/') ? 'navbar__item--active' : ''}`}>
            <Link to="/">Dashboard</Link>
          </li>
           <li className={`navbar__item ${isActive('/Expected') ? 'navbar__item--active' : ''}`}>
            <Link to="/Expected">Expected Guests</Link>
          </li>
          <li className={`navbar__item ${isActive('/Checked-in') ? 'navbar__item--active' : ''}`}>
            <Link to="/Checked-in">Checked-in Guests</Link>
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
            <span className="navbar__user-role">User Name</span>
          </div>
          <div className="navbar__dropdown">
            <button className="navbar__dropdown-toggle">▼</button>
            
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;