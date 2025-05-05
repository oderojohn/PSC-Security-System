import React from 'react';
import { FiPackage, FiSearch } from 'react-icons/fi';

const LostFoundHeader = ({ searchTerm, setSearchTerm, activeTab }) => (
  <div className="dashboard-header">
    <h2>
      <FiPackage size={18} /> Lost & Found Dashboard
    </h2>
    <div className="header-controls">
      <div className="search-bar">
        <FiSearch />
        <input
          type="text"
          placeholder={`Search ${activeTab === 'lost' ? 'lost' : 'found'} items...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* <span className="active-tab-indicator">
        {activeTab === 'lost' ? 'Viewing Lost Items' : 'Viewing Found Items'}
      </span> */}
    </div>
  </div>
);

export default LostFoundHeader;
