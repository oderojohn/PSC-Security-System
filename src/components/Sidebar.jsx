import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome,FaTag, FaFileAlt,
  FaBars, FaTimes, FaChevronLeft
} from 'react-icons/fa';//FaEnvelope,FaExclamationTriangle, FaShieldAlt,
import '../assets/css/Sidebar.css';

const Sidebar = () => {
  const [isActive, setIsActive] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsActive(!isActive);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <button className="menu-toggle" onClick={toggleSidebar}>
        {isActive ? <FaTimes /> : <FaBars />}
      </button>

      <aside className={`sidebar ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-heading">
          <div className='divtext'>
            {isCollapsed ? '' : <><FaHome /> <span>Dashboard</span></>}
          </div>
          <button className="collapse-btn" onClick={toggleCollapse}>
            {isCollapsed ? <FaChevronLeft /> : <FaChevronLeft />}
          </button>
        </div>
        <nav className="nav-links">
          <ul>
            {/* <li>
              <Link to="/lost-items">
                <FaClipboardList /> <span>Lost Items/Cards</span>
              </Link>
            </li> */}
            <li>
              <Link to="/dropped-packages">
                <FaTag /> <span>Drop Package</span>
              </Link>
            </li>
            {/* <li>
              <Link to="/events">
                <FaEnvelope /> <span>Today's Events</span>
              </Link>
            </li>
            <li>
              <Link to="/ClampingDashboard">
                <FaShieldAlt /> <span>Car Clamping</span>
              </Link>
            </li>
            <li>
              <Link to="/AnnouncementsDashboard">
                <FaExclamationTriangle /> <span>Announcements</span>
              </Link>
            </li>
            <li>
              <Link to="/SecurityControlDashboard">
                <FaShieldAlt /> <span>Security Control</span>
              </Link>
            </li> */}
            <li>
              <Link to="/ReportsDashboard">
                <FaFileAlt /> <span>Reports</span>
              </Link>
            </li>
            {/* <li>
              <Link to="/ReportIssue">
                <FaExclamationTriangle /> <span>Report an Issue</span>
              </Link>
            </li> */}
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
