import React, { useState } from 'react';
import '../assets/css/TopNavbar.css';
import { Link } from 'react-router-dom';


const TopNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <button 
        className="navbar__menu-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        ☰
      </button>
      
      <nav className={`navbar__navigation ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <ul className="navbar__list">
          <li className="navbar__item navbar__item--active">Dashboard</li>
          <li className="navbar__item">Expected Guests</li>
          <li className="navbar__item">Checked-in Guests</li>
          <li className="navbar__item">Reports</li>
          <div className="navbar__item">
          <li ><Link to="/PhoneExtensionsDashboard">Directory</Link></li>
          </div>
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
            <div className="navbar__dropdown-menu">
              <a href="hello" className="navbar__dropdown-item">Profile</a>
              <a href="hello" className="navbar__dropdown-item">Settings</a>
              <a href="hello" className="navbar__dropdown-item">Logout</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;