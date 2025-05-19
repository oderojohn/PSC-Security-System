import React from 'react';
import { FiPlus, FiList } from 'react-icons/fi';

const LostFoundStats = ({
  activeTab,
  setActiveTab,
  lostItems,
  foundItems,
  pendingItems,
  matchesCount = 0,
  setShowAddLostModal,
  setShowAddFoundModal,
  showMatches,
  setShowMatches,
  fetchPotentialMatches,
}) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowMatches(false);
  };

  const handleMatchClick = () => {
    setShowMatches(true);
    setActiveTab('matches'); // Optional: use 'matches' to signify selection
    fetchPotentialMatches();
  };

  return (
    <div className="dashboard-toolbar">
      <div className="stats-summary">
        <div
          className={`stat ${activeTab === 'lost' && !showMatches ? 'active' : ''}`}
          onClick={() => handleTabClick('lost')}
        >
          <span>Lost</span>
          {/* <strong>{lostItems}</strong> */}
        </div>
        <div
          className={`stat ${activeTab === 'found' && !showMatches ? 'active' : ''}`}
          onClick={() => handleTabClick('found')}
        >
          <span>Found</span>
          <strong>{foundItems}</strong>
        </div>
        {/* <div className="stat">
          <span>Pending</span>
          <strong>{pendingItems}</strong>
        </div> */}
        <div
          className={`stat ${showMatches ? 'active' : ''}`}
          onClick={handleMatchClick}
        >
          <span>Matches</span>
        </div>
      </div>

      <div className="right-controls">
        <div className="tab-controls">
          <button
            className={`tab-button ${activeTab === 'lost' && !showMatches ? 'active' : ''}`}
            onClick={() => handleTabClick('lost')}
          >
            <FiList size={16} /> Lost
          </button>
          <button
            className={`tab-button ${activeTab === 'found' && !showMatches ? 'active' : ''}`}
            onClick={() => handleTabClick('found')}
          >
            <FiList size={16} /> Found
          </button>
        </div>
        <div className="action-buttons">
          <button
            className={`add-button ${activeTab === 'lost' && !showMatches ? 'primary' : 'secondary'}`}
            onClick={() => setShowAddLostModal(true)}
          >
            <FiPlus size={16} /> Report Lost
          </button>
          <button
            className={`add-button ${activeTab === 'found' && !showMatches ? 'primary' : 'secondary'}`}
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
