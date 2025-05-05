import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Logo from './components/Logo';
import './App.css';

// Import page components
import Dashboard from './components/pages/Dashboard';
import GuestRegistration from './components/Guest/GuestDashboard';
import LostItemsDashboard from './components/LostItemsDashboard'; 
import EventsDashboard from './components/events/Event';
import AnnouncementsDashboard from './components/Announcements/Announcements';
import SecurityControlDashboard from './components/Security Control/SecurityControl';
import ReportsDashboard from './components/Reports/Reports';
import ReportIssue from './components/reportIssue/ReportIssue';
import TopNavbar from './components/TopNavbar';
import ClampingDashboard from './components/Clamping Records/ClampingRecords'
import PackageDashboard  from './components/Dropped Packages/PackageDashboard'
import PhoneExtensionsDashboard  from './components/PhoneExtensions/PhoneExtensionsDashboard'



const App = () => {
  return (
    <Router>
      <div className="app">
        <Logo />
        <TopNavbar/>
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/GuestRegistration" element={<GuestRegistration />} />
            <Route path="/lost-items" element={<LostItemsDashboard />} />
            <Route path="/dropped-packages" element={<PackageDashboard  />} />
            <Route path="/events" element={<EventsDashboard />} />
            <Route path="/AnnouncementsDashboard" element={<AnnouncementsDashboard />} />
            <Route path="/ClampingDashboard" element={<ClampingDashboard />} />
            <Route path="/SecurityControlDashboard" element={<SecurityControlDashboard />} />
            <Route path="/ReportsDashboard" element={<ReportsDashboard />} />
            <Route path="/ReportIssue" element={<ReportIssue />} />
            <Route path="/PhoneExtensionsDashboard" element={<PhoneExtensionsDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
