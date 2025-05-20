// Dashboard.js
import React from 'react';
import PackageDashboard from './PackageDashboard';
import LostFoundDashboard from './LostFoundDashboard';
import '../../assets/css/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="lost-items-dashboard">
    <div className="dashboard-container">
      <div className="dashboard-section">
        <h1>Package Delivery Dashboard</h1>
        <PackageDashboard />
      </div>
      
      <div className="dashboard-section">
        <h1>Lost & Found Dashboard</h1>
        <LostFoundDashboard />
      </div>
    </div>
    </div>
  );
};

export default Dashboard;