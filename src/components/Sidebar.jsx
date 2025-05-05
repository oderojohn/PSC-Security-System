import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome, FaClipboardList, FaTag, FaEnvelope,
  FaExclamationTriangle, FaShieldAlt, FaFileAlt,
  FaBars, FaTimes
} from 'react-icons/fa';
import '../assets/css/Sidebar.css';

const Sidebar = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleSidebar = () => {
    setIsActive(!isActive);
  };

  return (
    <>
      <button className="menu-toggle" onClick={toggleSidebar}>
        {isActive ? <FaTimes /> : <FaBars />}
      </button>

      <aside className={`sidebar ${isActive ? 'active' : ''}`}>
        <div className="sidebar-heading">
          <div className='divtext'>
            <FaHome /> Dashboard
          </div>
        </div>
        <nav className="nav-links">
          <ul>
            <li><Link className="link-button" to="/GuestRegistration"><FaClipboardList /> Register Guest</Link></li>
            <li><Link className="link-button" to="/lost-items"><FaTag /> Lost Items/Cards</Link></li>
            <li><Link className="link-button" to="/dropped-packages"><FaTag /> Drop Package</Link></li>
            <li><Link className="link-button" to="/events"><FaEnvelope /> Today's Events</Link></li>
            <li><Link className="link-button" to="/ClampingDashboard"><FaShieldAlt />Car Clamping</Link></li>
            <li><Link className="link-button" to="/AnnouncementsDashboard"><FaExclamationTriangle /> Announcements</Link></li>
            <li><Link className="link-button" to="/SecurityControlDashboard"><FaShieldAlt /> Security Control</Link></li>
            <li><Link className="link-button" to="/ReportsDashboard"><FaFileAlt /> Reports</Link></li>
            <li><Link className="link-button" to="/ReportIssue"><FaExclamationTriangle /> Report an Issue</Link></li>
          </ul>
        </nav>
        <div className="user-profile">
          <span>User Name</span>
          <small>View profile</small>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
