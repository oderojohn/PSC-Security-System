import React, { useState } from 'react';
import { FiPlus, FiList, FiCreditCard, FiBriefcase, FiCheckSquare } from 'react-icons/fi';
import { ReportFoundForm } from './forms/ReportFoundForm';
import { ReportLostForm } from './forms/ReportLostForm';

const LostFoundStats = ({
  activeTab,
  setActiveTab,
  setShowMatches,
  onFoundSubmit
}) => {
  const [showLostModal, setShowLostModal] = useState(false);
  const [showFoundModal, setShowFoundModal] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowMatches(false);
  };


  const handleLostSubmit = (newItem) => {
    console.log("New lost item submitted:", newItem);
    // update state or refetch list
  };

  const handleFoundSubmit = (formData) => {
    onFoundSubmit(formData);
    setShowFoundModal(false);
  };

  return (
    <>
      <div className="dashboard-toolbar">
        <div className="stats-summary">
          
        </div>

        <div className="right-controls">
          <div className="tab-controls">
            <button
              className={`tab-button ${activeTab === 'matches' ? 'active' : ''}`}
              onClick={() => handleTabClick('matches')}
            >
              <FiList size={16} /> Matches
            </button>
            <button
              className={`tab-button ${activeTab === 'lost-cards' ? 'active' : ''}`}
              onClick={() => handleTabClick('lost-cards')}
            >
              <FiCreditCard size={16} /> Lost Cards 
            </button>
            <button
              className={`tab-button ${activeTab === 'lost-items' ? 'active' : ''}`}
              onClick={() => handleTabClick('lost-items')}
            >
              <FiBriefcase size={16} /> Lost Items
            </button>
            <button
              className={`tab-button ${activeTab === 'found-cards' ? 'active' : ''}`}
              onClick={() => handleTabClick('found-cards')}
            >
              <FiCreditCard size={16} /> Found Cards
            </button>
            <button
              className={`tab-button ${activeTab === 'found-items' ? 'active' : ''}`}
              onClick={() => handleTabClick('found-items')}
            >
              <FiBriefcase size={16} /> Found Items
            </button>
            <button
              className={`tab-button ${activeTab === 'picked' ? 'active' : ''}`}
              onClick={() => handleTabClick('picked')}
            >
              <FiCheckSquare size={16} /> Picked
            </button>
          </div>
          <div className="action-buttons">
            <button
              className="add-button primary"
              onClick={() => setShowLostModal(true)}
            >
              <FiPlus size={16} /> Report Lost
            </button>
            <button
              className="add-button secondary"
              onClick={() => setShowFoundModal(true)}
            >
              <FiPlus size={16} /> Report Found
            </button>
          </div>
        </div>
      </div>

      {showLostModal && (
        <ReportLostForm 
          onClose={() => setShowLostModal(false)}
          onSubmit={handleLostSubmit}
        />
      )}

      {showFoundModal && (
        <ReportFoundForm 
          onClose={() => setShowFoundModal(false)}
          onSubmit={handleFoundSubmit}
        />
      )}
    </>
  );
};

export default LostFoundStats;