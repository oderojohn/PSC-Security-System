import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthService } from '../service/api/api';
import '../assets/css/TopNavbar.css';
import { useAuth } from '../service/auth/AuthContext';
import Swal from 'sweetalert2';

const TopNavbar = () => {
  const [mobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  // Available themes
  const themes = [
    { name: 'Light', value: 'light', color: '#F3F4F6' },
    { name: 'Dark', value: 'dark', color: '#1F2937' },
    { name: 'Blue', value: 'blue', color: '#3B82F6' },
    { name: 'Green', value: 'green', color: '#10B981' },
    { name: 'Purple', value: 'purple', color: '#8B5CF6' }
  ];

  // Set theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('dashboard-theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Handle theme change
  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    document.documentElement.setAttribute('data-theme', selectedTheme);
    localStorage.setItem('dashboard-theme', selectedTheme);
    setShowThemeModal(false);
  };

  const handleLogout = async () => {
    const { isConfirmed } = await Swal.fire({
      title: `Logout Confirmation`,
      html: `
        <div>
          <p>Are you sure you want to logout${user?.username ? `, ${user.username}` : ''}?</p>
          <div class="theme-selection-container">
            <p>Change theme before logging out:</p>
            <div class="theme-buttons">
              ${themes.map(t => `
                <button 
                  class="theme-btn ${theme === t.value ? 'active' : ''}" 
                  data-theme="${t.value}"
                  style="background-color: ${t.color}"
                  aria-label="${t.name} theme"
                >
                  ${theme === t.value ? '✓' : ''}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#27427993',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',
      focusConfirm: false,
      preConfirm: () => {
        const selectedTheme = document.querySelector('.theme-btn.active')?.dataset.theme || theme;
        return selectedTheme;
      }
    });

    if (isConfirmed) {
      try {
        await AuthService.logout();
      } catch (error) {
        console.warn('Backend logout failed, proceeding anyway');
      } finally {
        logout();
        navigate('/login');
      }
    }
  };

  const openThemeModal = () => {
    Swal.fire({
      title: 'Select Theme',
      html: `
        <div class="theme-buttons">
          ${themes.map(t => `
            <button 
              class="theme-btn ${theme === t.value ? 'active' : ''}" 
              onclick="document.querySelector('.swal2-confirm').dataset.theme='${t.value}'"
              style="background-color: ${t.color}"
              aria-label="${t.name} theme"
            >
              ${t.name}
              ${theme === t.value ? '✓' : ''}
            </button>
          `).join('')}
        </div>
      `,
      showCancelButton: false,
      confirmButtonText: 'Apply Theme',
      confirmButtonColor: '#27427993',
      focusConfirm: false,
      preConfirm: () => {
        const selectedTheme = document.querySelector('.swal2-confirm').dataset.theme || theme;
        return selectedTheme;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleThemeChange(result.value);
      }
    });
  };

  return (
    <header className="navbar">
      <nav className={`navbar__navigation ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <ul className="navbar__list">
          <li className={`navbar__item ${isActive('/PhoneExtensionsDashboard') ? 'navbar__item--active' : ''}`}>
            <Link to="/PhoneExtensionsDashboard">Directory</Link>
          </li>
        </ul>
      </nav>

      <div className="navbar__user">
        {/* Theme Switcher */}
        <div className="navbar__theme-switcher">
          <button 
            className="navbar__theme-button"
            onClick={openThemeModal}
            aria-label="Change theme"
          >
            <span className="navbar__icon">🎨</span>
            <span className="navbar__action-text">Theme</span>
          </button>
        </div>

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
            <span className="navbar__user-role">{user?.username || 'User'}</span> 
          </div>
          <div className="navbar__dropdown">
            <button 
              className="navbar__logout-button" 
              onClick={handleLogout}
              title="Logout"
            >
              ⎋ 
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;