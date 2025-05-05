import React, { useState } from 'react';
import { FiAlertCircle, FiPlus, FiPaperclip } from 'react-icons/fi';

const ReportIssue = () => {
  const [issues, setIssues] = useState([
    {
      id: 1,
      title: 'Broken gym equipment',
      category: 'Facilities',
      description: 'Treadmill #3 is not working properly',
      status: 'Open',
      reportedBy: 'John M.',
      date: '2024-06-15 09:30',
      priority: 'High'
    },
    {
      id: 2,
      title: 'Leaking pipe',
      category: 'Maintenance',
      description: 'Water leak in men\'s locker room',
      status: 'In Progress',
      reportedBy: 'Sarah K.',
      date: '2024-06-14 14:15',
      priority: 'Urgent'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newIssue, setNewIssue] = useState({
    title: '',
    category: 'General',
    description: '',
    priority: 'Medium',
    attachments: []
  });
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleAddIssue = () => {
    const issue = {
      ...newIssue,
      id: Date.now(),
      status: 'Open',
      reportedBy: 'Current User', // Replace with actual user
      date: new Date().toISOString()
    };
    setIssues([...issues, issue]);
    setShowAddModal(false);
    setNewIssue({
      title: '',
      category: 'General',
      description: '',
      priority: 'Medium',
      attachments: []
    });
  };

  const updateIssueStatus = (id, newStatus) => {
    setIssues(issues.map(issue => 
      issue.id === id ? { ...issue, status: newStatus } : issue
    ));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewIssue({
      ...newIssue,
      attachments: [...newIssue.attachments, ...files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      }))]
    });
  };

  return (
    <div className="lost-items-dashboard">
      <div className="dashboard-header">
        <h2><FiAlertCircle size={18} /> Report an Issue</h2>
        <div className="header-controls">
          <button className="add-button primary" onClick={() => setShowAddModal(true)}>
            <FiPlus size={16} /> New Issue
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="items-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Reported By</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map(issue => (
              <tr key={issue.id}>
                <td>{issue.title}</td>
                <td>{issue.category}</td>
                <td>
                  <span className={`status-badge ${issue.status.toLowerCase().replace(' ', '-')}`}>
                    {issue.status}
                  </span>
                </td>
                <td>
                  <span className={`priority-badge ${issue.priority.toLowerCase()}`}>
                    {issue.priority}
                  </span>
                </td>
                <td>{issue.reportedBy}</td>
                <td>{issue.date}</td>
                <td>
                  <button 
                    className="view-button"
                    onClick={() => {
                      setSelectedIssue(issue);
                      setShowDetailsModal(true);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Issue Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="add-modal">
            <h3>Report New Issue</h3>
            <input
              type="text"
              placeholder="Issue Title"
              value={newIssue.title}
              onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
            />
            <select
              value={newIssue.category}
              onChange={(e) => setNewIssue({...newIssue, category: e.target.value})}
            >
              <option value="General">General</option>
              <option value="Facilities">Facilities</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Security">Security</option>
              <option value="IT">IT</option>
              <option value="Other">Other</option>
            </select>
            <select
              value={newIssue.priority}
              onChange={(e) => setNewIssue({...newIssue, priority: e.target.value})}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
            <textarea
              placeholder="Detailed description of the issue..."
              value={newIssue.description}
              onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
              rows={5}
            />
            <div className="file-upload">
              <label>
                <FiPaperclip /> Attach Files
                <input 
                  type="file" 
                  multiple 
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
              {newIssue.attachments.length > 0 && (
                <div className="attachments-list">
                  {newIssue.attachments.map((file, index) => (
                    <div key={index} className="attachment-item">
                      {file.name} ({Math.round(file.size / 1024)} KB)
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="primary" onClick={handleAddIssue}>Submit Issue</button>
            </div>
          </div>
        </div>
      )}

      {/* Issue Details Modal */}
      {showDetailsModal && selectedIssue && (
        <div className="modal-overlay">
          <div className="add-modal">
            <h3>{selectedIssue.title}</h3>
            <div className="issue-details-grid">
              <div className="detail-field"><strong>Category:</strong> {selectedIssue.category}</div>
              <div className="detail-field"><strong>Status:</strong> 
                <span className={`status-badge ${selectedIssue.status.toLowerCase().replace(' ', '-')}`}>
                  {selectedIssue.status}
                </span>
              </div>
              <div className="detail-field"><strong>Priority:</strong> 
                <span className={`priority-badge ${selectedIssue.priority.toLowerCase()}`}>
                  {selectedIssue.priority}
                </span>
              </div>
              <div className="detail-field"><strong>Reported By:</strong> {selectedIssue.reportedBy}</div>
              <div className="detail-field"><strong>Date Reported:</strong> {selectedIssue.date}</div>
              <div className="detail-field full-width"><strong>Description:</strong> 
                <div className="description-text">{selectedIssue.description}</div>
              </div>
            </div>

            <div className="status-actions">
              <h4>Update Status:</h4>
              <div className="status-buttons">
                <button 
                  className={`status-button ${selectedIssue.status === 'Open' ? 'active' : ''}`}
                  onClick={() => updateIssueStatus(selectedIssue.id, 'Open')}
                >
                  Open
                </button>
                <button 
                  className={`status-button ${selectedIssue.status === 'In Progress' ? 'active' : ''}`}
                  onClick={() => updateIssueStatus(selectedIssue.id, 'In Progress')}
                >
                  In Progress
                </button>
                <button 
                  className={`status-button ${selectedIssue.status === 'Resolved' ? 'active' : ''}`}
                  onClick={() => updateIssueStatus(selectedIssue.id, 'Resolved')}
                >
                  Resolved
                </button>
                <button 
                  className={`status-button ${selectedIssue.status === 'Closed' ? 'active' : ''}`}
                  onClick={() => updateIssueStatus(selectedIssue.id, 'Closed')}
                >
                  Closed
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowDetailsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportIssue;