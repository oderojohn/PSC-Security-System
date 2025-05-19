
import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import '../../assets/css/Dashboard.css'
// Register Chart.js components
Chart.register(...registerables);

const Dashboard = () => {
  // Refs for chart canvases
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const doughnutChartRef = useRef(null);

  // Sample data
  const dashboardData = {
    lostItems: {
      total: 42,
      monthly: [12, 19, 15, 8, 7, 10, 13],
      categories: ['ID Cards', 'Wallets', 'Keys', 'Phones', 'Others']
    },
    dropPackages: {
      total: 128,
      weekly: [25, 32, 28, 35, 22, 30, 28],
      locations: ['Main Gate', 'Security', 'Reception', 'Mail Room']
    },
    todaysEvents: [
      { time: '09:00', title: 'Security Briefing', location: 'Room A' },
      { time: '11:30', title: 'Vendor Meeting', location: 'Room B' },
      { time: '14:00', title: 'Facility Tour', location: 'Lobby' }
    ],
    securityAlerts: {
      total: 18,
      types: ['Unauthorized Access', 'Camera Offline', 'Door Forced', 'Other'],
      counts: [8, 5, 3, 2]
    }
  };

  // Initialize charts when component mounts
useEffect(() => {
  const charts = [];

  const lineChart = new Chart(lineChartRef.current, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [{
        label: 'Lost Items Reported',
        data: dashboardData.lostItems.monthly,
        borderColor: '#4361ee',
        backgroundColor: 'rgba(67, 97, 238, 0.1)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  });
  charts.push(lineChart);

  const barChart = new Chart(barChartRef.current, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Packages Received',
        data: dashboardData.dropPackages.weekly,
        backgroundColor: 'rgba(67, 97, 238, 0.7)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  });
  charts.push(barChart);

  const pieChart = new Chart(pieChartRef.current, {
    type: 'pie',
    data: {
      labels: dashboardData.lostItems.categories,
      datasets: [{
        data: [15, 10, 8, 5, 4],
        backgroundColor: ['#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
  charts.push(pieChart);

  const doughnutChart = new Chart(doughnutChartRef.current, {
    type: 'doughnut',
    data: {
      labels: dashboardData.securityAlerts.types,
      datasets: [{
        data: dashboardData.securityAlerts.counts,
        backgroundColor: ['#4361ee', '#3f37c9', '#4895ef', '#4cc9f0']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%'
    }
  });
  charts.push(doughnutChart);

  // Cleanup
  return () => {
    charts.forEach(chart => chart.destroy());
  };
}, []);

  return (
    <div className="lost-items-dashboard">
    <div className="dashboard">
      {/* Lost Items Card with Line Chart */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon">🔍</div>
          <h3 className="card-title">Lost Items</h3>
        </div>
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-value">{dashboardData.lostItems.total}</div>
            <div className="stat-label">Total Items</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">12</div>
            <div className="stat-label">This Month</div>
          </div>
        </div>
        <div className="chart-container">
          <canvas ref={lineChartRef}></canvas>
        </div>
      </div>

      {/* Package Delivery Card with Bar Chart */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon">📦</div>
          <h3 className="card-title">Package Delivery</h3>
        </div>
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-value">{dashboardData.dropPackages.total}</div>
            <div className="stat-label">Total Packages</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">28</div>
            <div className="stat-label">This Week</div>
          </div>
        </div>
        <div className="chart-container">
          <canvas ref={barChartRef}></canvas>
        </div>
      </div>

      {/* Lost Items Categories with Pie Chart */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon">📊</div>
          <h3 className="card-title">Lost Items Categories</h3>
        </div>
        <div className="chart-container">
          <canvas ref={pieChartRef}></canvas>
        </div>
      </div>

      {/* Today's Events Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon">📅</div>
          <h3 className="card-title">Today's Events</h3>
        </div>
        <div style={{ marginTop: '15px' }}>
          {dashboardData.todaysEvents.map((event, index) => (
            <div key={index} style={{ 
              padding: '10px 0',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontWeight: '500' }}>{event.title}</div>
                <div style={{ fontSize: '14px', color: '#7f8c8d' }}>{event.location}</div>
              </div>
              <div style={{ color: '#4361ee', fontWeight: '500' }}>{event.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Alerts with Doughnut Chart */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon">🛡️</div>
          <h3 className="card-title">Security Alerts</h3>
        </div>
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-value">{dashboardData.securityAlerts.total}</div>
            <div className="stat-label">Total Alerts</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">3</div>
            <div className="stat-label">Today</div>
          </div>
        </div>
        <div className="chart-container">
          <canvas ref={doughnutChartRef}></canvas>
        </div>
      </div>

      {/* Announcements Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon">📢</div>
          <h3 className="card-title">Announcements</h3>
        </div>
        <div style={{ marginTop: '15px' }}>
          <div style={{ 
            padding: '12px',
            borderRadius: '8px',
            background: 'rgba(67, 97, 238, 0.05)',
            marginBottom: '10px'
          }}>
            <div style={{ fontWeight: '500', color: '#4361ee' }}>New Security Protocol</div>
            <div style={{ fontSize: '14px', marginTop: '5px' }}>Starting next week, all visitors must register at reception.</div>
          </div>
          <div style={{ 
            padding: '12px',
            borderRadius: '8px',
            background: 'rgba(248, 150, 30, 0.05)',
            marginBottom: '10px'
          }}>
            <div style={{ fontWeight: '500', color: '#f8961e' }}>Parking Lot Maintenance</div>
            <div style={{ fontSize: '14px', marginTop: '5px' }}>East parking lot will be closed tomorrow for resurfacing.</div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;