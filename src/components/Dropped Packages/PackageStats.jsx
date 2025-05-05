import React from 'react';
import { FiPlus, FiList } from 'react-icons/fi';

const PackageStats = ({
  activeTab,
  setActiveTab,
  droppedPackages,
  pickedPackages,
  setShowDropModal,
  setShowPickModal
}) => {
  return (
    <div className="dashboard-toolbar">
      <div className="stats-summary">
        <div
          className={`stat ${activeTab === 'drop' ? 'active' : ''}`}
          onClick={() => setActiveTab('drop')}
        >
          <span>Dropped </span>
          <strong>{droppedPackages.length}</strong>
        </div>
        <div
          className={`stat ${activeTab === 'pick' ? 'active' : ''}`}
          onClick={() => setActiveTab('pick')}
        >
          <span>Picked </span>
          <strong>{pickedPackages.length}</strong>
        </div>
        <div className="stat">
          <span>Pending</span>
          <strong>{droppedPackages.filter(p => p.status === 'pending').length}</strong>
        </div>
      </div>

      <div className="right-controls">
        <div className="tab-controls">
          <button
            className={`tab-button ${activeTab === 'drop' ? 'active' : ''}`}
            onClick={() => setActiveTab('drop')}
          >
            <FiList size={16} /> Dropped
          </button>
          <button
            className={`tab-button ${activeTab === 'pick' ? 'active' : ''}`}
            onClick={() => setActiveTab('pick')}
          >
            <FiList size={16} /> Picked
          </button>
        </div>
        <div className="action-buttons">
          <button
            className={`add-button ${activeTab === 'drop' ? 'primary' : 'secondary'}`}
            onClick={() => setShowDropModal(true)}
          >
            <FiPlus size={16} /> Drop Package
          </button>
          {/* <button
            className={`add-button ${activeTab === 'pick' ? 'primary' : 'secondary'}`}
            onClick={() => setShowPickModal(true)}
          >
            <FiPlus size={16} /> Pick Package
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default PackageStats;