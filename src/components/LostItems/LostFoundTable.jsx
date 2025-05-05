// File: LostFoundTable.jsx
import React, { useState, useEffect } from 'react';
import { FiCheck, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const LostFoundTable = ({
  activeTab,
  filteredLostItems,
  filteredFoundItems,
  markAsFound,
  searchTerm,
  setSearchTerm,
  onViewDetails
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const getPaginatedItems = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const renderPagination = (items) => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          <FiChevronLeft />
        </button>
        <span className="page-indicator">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-button"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          <FiChevronRight />
        </button>
      </div>
    );
  };

  const renderRow = (item, isLost = false) => {
    const rowProps = !isLost ? { 
      onClick: () => onViewDetails(item), 
      className: 'clickable-row' 
    } : {};
    
    return (
      <tr key={item.id} {...rowProps}>
        <td>{item.type === 'card' ? '💳 Card' : '🧳 Item'}</td>
        <td>{item.type === 'card' ? item.number : `${item.name} - ${item.description}`}</td>
        <td>{item.owner || 'Unknown'}</td>
        <td>{isLost ? item.placeLost : item.placeFound}</td>
        <td>{isLost ? item.reportedBy : item.foundBy}</td>
        <td>{isLost ? item.reporterPhone : item.finderPhone}</td>
        <td>{item.date}</td>
        <td>
          <span className={`status-badge ${item.status}`}>
            {item.status}
          </span>
        </td>
        <td>
          {isLost && item.status === 'pending' ? (
            <button
              className="found-button"
              onClick={(e) => {
                e.stopPropagation();
                markAsFound(item.id);
              }}
            >
              <FiCheck /> Found
            </button>
          ) : (
            <button
              className="view-button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(item);
              }}
            >
              <FiEye /> Details
            </button>
          )}
        </td>
      </tr>
    );
  };

  const renderTable = (items, isLost) => (
    <>
      <div className="table-container">
         <colgroup>
          <col style={{ width: '10%' }} /> {/* Type */}
          <col style={{ width: '15%' }} /> {/* Details */}
          <col style={{ width: '12%' }} /> {/* Owner */}
          <col style={{ width: '12%' }} /> {/* Place Lost/Found */}
          <col style={{ width: '12%' }} /> {/* Reported/Found By */}
          <col style={{ width: '10%' }} /> {/* Phone */}
          <col style={{ width: '12%' }} /> {/* Date & Time */}
          <col style={{ width: '10%' }} /> {/* Status */}
          <col style={{ width: '7%' }} />  {/* Actions */}
        </colgroup>
        <table className="items-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Details</th>
              <th>Owner</th>
              <th>{isLost ? 'Place Lost' : 'Place Found'}</th>
              <th>{isLost ? 'Member No' : 'Found By'}</th>
              <th>Phone</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getPaginatedItems(items).map(item => renderRow(item, isLost))}
          </tbody>
        </table>
      </div>
      {renderPagination(items)}
    </>
  );

  const renderNoDataMessage = () => (
    <div className="no-data-message">
      <div className="sad-emoji">😞</div>
      <h3>No items found</h3>
      <p>We couldn't find any {activeTab === 'lost' ? 'lost' : 'found'} items matching your search.</p>
      {searchTerm && (
        <button className="clear-search" onClick={() => setSearchTerm('')}>
          Clear search
        </button>
      )}
    </div>
  );

  const currentItems = activeTab === 'lost' ? filteredLostItems : filteredFoundItems;
  
  return currentItems.length 
    ? renderTable(currentItems, activeTab === 'lost')
    : renderNoDataMessage();
};

export default LostFoundTable;