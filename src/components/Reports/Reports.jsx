import React, { useState } from 'react';
import { FiPrinter, FiDownload, FiFileText } from 'react-icons/fi';

const ReportsDashboard = () => {
  // Sample report data - in a real app, this would come from your API
  const [reports] = useState([
    { 
      id: 1,
      module: 'Lost Items/Cards',
      type: 'Daily Summary',
      description: 'Summary of all lost items reported today',
      dateRange: 'Today'
    },
    { 
      id: 2,
      module: 'Lost Items/Cards',
      type: 'Weekly Summary',
      description: 'Summary of all lost items reported this week',
      dateRange: 'This Week'
    },
    { 
      id: 3,
      module: 'Drop Package',
      type: 'Pending Packages',
      description: 'List of all pending package deliveries',
      dateRange: 'Current'
    },
    { 
      id: 4,
      module: 'Today\'s Events',
      type: 'Daily Events',
      description: 'List of all events scheduled for today',
      dateRange: 'Today'
    },
    { 
      id: 5,
      module: 'Clamping Records',
      type: 'Active Clamps',
      description: 'List of all currently clamped vehicles',
      dateRange: 'Current'
    },
    { 
      id: 6,
      module: 'Clamping Records',
      type: 'Monthly Summary',
      description: 'Summary of all clamping activities this month',
      dateRange: 'This Month'
    },
    { 
      id: 7,
      module: 'Announcements',
      type: 'Recent Announcements',
      description: 'List of all announcements in the last 7 days',
      dateRange: 'Last 7 Days'
    },
    { 
      id: 8,
      module: 'Security Control',
      type: 'Key Checkout Log',
      description: 'Log of all key checkouts and returns',
      dateRange: 'Custom'
    },
    { 
      id: 9,
      module: 'Report an Issue',
      type: 'Open Issues',
      description: 'List of all currently open issues',
      dateRange: 'Current'
    }
  ]);

  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedModule, setSelectedModule] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });

  // Filter reports based on selections
  const filteredReports = reports.filter(report => {
    const matchesModule = selectedModule === 'all' || report.module === selectedModule;
    const matchesDate = selectedDateRange === 'all' || 
                       report.dateRange.toLowerCase().includes(selectedDateRange.toLowerCase()) ||
                       (selectedDateRange === 'custom' && report.dateRange === 'Custom');
    return matchesModule && matchesDate;
  });

  // Function to handle printing a report
  const handlePrintReport = (report) => {
    // In a real app, this would generate the actual report
    alert(`Printing report: ${report.module} - ${report.type}`);
    // window.print() could be used here for actual printing
  };

  // Function to handle downloading a report
  const handleDownloadReport = (report) => {
    alert(`Downloading report: ${report.module} - ${report.type}`);
    // Actual download logic would go here
  };

  return (
    <div className="lost-items-dashboard">
      <div className="dashboard-header">
        <h2><FiFileText size={18} /> Generate Reports</h2>
      </div>

      <div className="report-filters">
        <div className="filter-group">
          <label>Module:</label>
          <select 
            value={selectedModule} 
            onChange={(e) => setSelectedModule(e.target.value)}
          >
            <option value="all">All Modules</option>
            <option value="Lost Items/Cards">Lost Items/Cards</option>
            <option value="Drop Package">Drop Package</option>
            <option value="Today's Events">Today's Events</option>
            <option value="Clamping Records">Clamping Records</option>
            <option value="Announcements">Announcements</option>
            <option value="Security Control">Security Control</option>
            <option value="Report an Issue">Report an Issue</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Date Range:</label>
          <select 
            value={selectedDateRange} 
            onChange={(e) => setSelectedDateRange(e.target.value)}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {selectedDateRange === 'custom' && (
          <div className="custom-date-range">
            <input
              type="date"
              placeholder="Start Date"
              value={customDateRange.start}
              onChange={(e) => setCustomDateRange({...customDateRange, start: e.target.value})}
            />
            <span>to</span>
            <input
              type="date"
              placeholder="End Date"
              value={customDateRange.end}
              onChange={(e) => setCustomDateRange({...customDateRange, end: e.target.value})}
            />
          </div>
        )}
      </div>

      <div className="table-container">
        <table className="items-table">
          <thead>
            <tr>
              <th>Module</th>
              <th>Report Type</th>
              <th>Description</th>
              <th>Date Range</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map(report => (
                <tr key={report.id}>
                  <td>{report.module}</td>
                  <td>{report.type}</td>
                  <td>{report.description}</td>
                  <td>{report.dateRange}</td>
                  <td>
                    <button 
                      className="icon-button"
                      onClick={() => handlePrintReport(report)}
                      title="Print Report"
                    >
                      <FiPrinter />
                    </button>
                    <button 
                      className="icon-button"
                      onClick={() => handleDownloadReport(report)}
                      title="Download Report"
                    >
                      <FiDownload />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">
                  No reports match your selected filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Report Preview Modal - would be shown when a user clicks to view a report */}
      {/* Print styles would be included in your CSS for proper printing */}
    </div>
  );
};

export default ReportsDashboard;