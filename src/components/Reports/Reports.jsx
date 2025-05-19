import React, { useState, useEffect } from 'react';
import { FiPrinter, FiDownload, FiFileText } from 'react-icons/fi';
import { AuthService } from '../../service/api/api'; 

const ReportsDashboard = () => {
  const [reports, setReports] = useState([]);
  const [eventLogs, setEventLogs] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedModule, setSelectedModule] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });

  // Fetch Event Logs on mount
  useEffect(() => {
 const fetchLogs = async () => {
  try {
    const logs = await AuthService.getEventLogs();
    console.log('Raw event logs response:', logs);

    const formattedLogs = logs.map((log, index) => ({
      id: `log-${index}`,
      module: 'System Logs',
      type: log.action,
      description:
        `${log.user?.username || 'User #' + log.user || 'System'} ` +
        `${log.action.toLowerCase()}` +
        `${log.object_type ? ` ${log.object_type}` : ''}` +
        `${log.object_id ? ` #${log.object_id}` : ''}`,
      dateRange: new Date(log.timestamp).toLocaleDateString(),
    }));

    setEventLogs(formattedLogs);
  } catch (error) {
    console.error('Failed to load event logs:', error);
  }
};


    fetchLogs();
  }, []);

  // Static sample reports
  const staticReports = [
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
    // ... keep your other existing report objects here
  ];

  // Merge static reports and dynamic event logs
  useEffect(() => {
    setReports([...staticReports, ...eventLogs]);
  }, [eventLogs]);

  const filteredReports = reports.filter(report => {
    const matchesModule = selectedModule === 'all' || report.module === selectedModule;
    const matchesDate =
      selectedDateRange === 'all' ||
      report.dateRange.toLowerCase().includes(selectedDateRange.toLowerCase()) ||
      (selectedDateRange === 'custom' && report.dateRange === 'Custom');
    return matchesModule && matchesDate;
  });

  const handlePrintReport = (report) => {
    alert(`Printing report: ${report.module} - ${report.type}`);
  };

  const handleDownloadReport = (report) => {
    alert(`Downloading report: ${report.module} - ${report.type}`);
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
            <option value="System Logs">System Logs</option> {/* 👈 new option */}
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
              value={customDateRange.start}
              onChange={(e) =>
                setCustomDateRange({ ...customDateRange, start: e.target.value })
              }
            />
            <span>to</span>
            <input
              type="date"
              value={customDateRange.end}
              onChange={(e) =>
                setCustomDateRange({ ...customDateRange, end: e.target.value })
              }
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
              filteredReports.map((report) => (
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
    </div>
  );
};

export default ReportsDashboard;
