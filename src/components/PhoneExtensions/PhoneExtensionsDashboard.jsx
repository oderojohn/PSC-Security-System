// src/components/PhoneExtensionsDashboard.jsx
import React, { useState } from 'react';
import { FiPhone, FiPlus, FiEye, FiTrash2 } from 'react-icons/fi';

const PhoneExtensionsDashboard = () => {
  const [extensions, setExtensions] = useState([
    { id: 1, name: 'ICT', number: '144', location: 'Office 1', description: 'IT support' },
    { id: 2, name: 'Security', number: '100', location: 'Front Gate', description: 'Security team' },
    { id: 3, name: 'Lilac', number: '300', location: 'Lilac Bar', description: 'lilac' },
    { id: 4, name: 'Mainbar', number: '100', location: 'Main Bar', description: 'Main bar area' },
    { id: 5, name: 'Coach', number: '0754434208', location: 'Field', description: 'Football coach' },
    { id: 6, name: 'Intern John', number: '0754434208', location: 'Admin', description: 'Temporary intern' }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedExtension, setSelectedExtension] = useState(null);
  const [newExtension, setNewExtension] = useState({
    name: '', number: '', location: '', description: ''
  });

  const handleAddExtension = () => {
    setExtensions([...extensions, { ...newExtension, id: Date.now() }]);
    setShowAddModal(false);
    setNewExtension({ name: '', number: '', location: '', description: '' });
  };

  const handleDeleteExtension = (id) => {
    setExtensions(extensions.filter(ext => ext.id !== id));
  };

  return (
    <div className="lost-items-dashboard">
      <div className="dashboard-header">
        <h2><FiPhone size={18} /> Phone Extensions</h2>
        <div className="header-controls">
          <button className="add-button primary" onClick={() => setShowAddModal(true)}>
            <FiPlus size={16} /> Add Extension
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="items-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Number</th>
              <th>Location</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {extensions.map(extension => (
              <tr key={extension.id} className="clickable-row">
                <td onClick={() => { setSelectedExtension(extension); setShowViewModal(true); }}>
                  {extension.name}
                </td>
                <td>{extension.number}</td>
                <td>{extension.location}</td>
                <td>{extension.description}</td>
                <td>
                  <button className="icon-button" onClick={() => { setSelectedExtension(extension); setShowViewModal(true); }}>
                    <FiEye />
                  </button>
                  <button className="icon-button" onClick={() => handleDeleteExtension(extension.id)}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="add-modal">
            <h3>Add New Extension</h3>
            <input
              type="text"
              placeholder="Name"
              value={newExtension.name}
              onChange={(e) => setNewExtension({ ...newExtension, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Extension Number"
              value={newExtension.number}
              onChange={(e) => setNewExtension({ ...newExtension, number: e.target.value })}
            />
            <input
              type="text"
              placeholder="Location"
              value={newExtension.location}
              onChange={(e) => setNewExtension({ ...newExtension, location: e.target.value })}
            />
            <textarea
              placeholder="Description"
              rows={3}
              value={newExtension.description}
              onChange={(e) => setNewExtension({ ...newExtension, description: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="primary" onClick={handleAddExtension}>Save Extension</button>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedExtension && (
        <div className="modal-overlay">
          <div className="add-modal">
            <h3>{selectedExtension.name}</h3>
            <div className="announcement-meta">
              <span className="date">Number: {selectedExtension.number}</span><br />
              <span className="priority">Location: {selectedExtension.location}</span><br />
              <span className="priority">Description: {selectedExtension.description}</span>
            </div>
            <div className="modal-actions single">
              <button onClick={() => setShowViewModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneExtensionsDashboard;
