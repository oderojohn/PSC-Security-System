
import React from 'react';
import { FiPlus, FiList } from 'react-icons/fi';

const LostFoundStats = ({
  activeTab,
  setActiveTab,
  lostItems,
  foundItems,
  setShowAddLostModal,
  setShowAddFoundModal
}) => {
  return (
    <div className="dashboard-toolbar">
      <div className="stats-summary">
        <div
          className={`stat ${activeTab === 'lost' ? 'active' : ''}`}
          onClick={() => setActiveTab('lost')}
        >
          <span>Lost</span>
          <strong>{lostItems.length}</strong>
        </div>
        <div
          className={`stat ${activeTab === 'found' ? 'active' : ''}`}
          onClick={() => setActiveTab('found')}
        >
          <span>Found </span>
          <strong>{foundItems.length}</strong>
        </div>
        <div className="stat">
          <span>Pending</span>
          <strong>{lostItems.filter(i => i.status === 'pending').length}</strong>
        </div>
      </div>

      <div className="right-controls">
        <div className="tab-controls">
          <button
            className={`tab-button ${activeTab === 'lost' ? 'active' : ''}`}
            onClick={() => setActiveTab('lost')}
          >
            <FiList size={16} /> Lost
          </button>
          <button
            className={`tab-button ${activeTab === 'found' ? 'active' : ''}`}
            onClick={() => setActiveTab('found')}
          >
            <FiList size={16} /> Found
          </button>
        </div>
        <div className="action-buttons">
          <button
            className={`add-button ${activeTab === 'lost' ? 'primary' : 'secondary'}`}
            onClick={() => setShowAddLostModal(true)}
          >
            <FiPlus size={16} /> Report Lost
          </button>
          <button
            className={`add-button ${activeTab === 'found' ? 'primary' : 'secondary'}`}
            onClick={() => setShowAddFoundModal(true)}
          >
            <FiPlus size={16} /> Report Found
          </button>
        </div>
      </div>
    </div>
  );
};

export default LostFoundStats;
