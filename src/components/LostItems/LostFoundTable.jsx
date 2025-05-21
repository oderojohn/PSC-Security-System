import React, { useState } from 'react';
import { FiCheck, FiEye, FiX, FiAlertTriangle } from 'react-icons/fi';

const LostFoundTable = ({
  activeTab,
  filteredLostItems = [],
  filteredFoundItems = [],
  markAsFound,
  searchTerm,
  setSearchTerm,
  onViewDetails,
  showMatches,
  fetchPotentialMatches,
  setShowMatches,
  potentialMatches,
  loadingMatches = false
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [refreshingMatches, setRefreshingMatches] = useState(false);

  const safeText = (val, fallback = 'N/A') => {
    if (val === null || val === undefined) return fallback;
    return typeof val === 'string' ? val : 
           typeof val === 'object' ? JSON.stringify(val) : 
           String(val);
  };

  const handleMarkAsFound = async (itemId) => {
    setSelectedItemId(itemId);
    setShowConfirmModal(true);
  };

  const confirmMarkAsFound = async () => {
  setShowConfirmModal(false); // Close modal immediately
  setRefreshingMatches(true);

  try {
    await markAsFound(selectedItemId);

    if (showMatches) {
      await fetchPotentialMatches(); // Refresh matches list
    }
  } catch (error) {
    console.error('Error confirming mark as found:', error);
  } finally {
    setRefreshingMatches(false);
  }
};


  const sortItemsByDate = (items) => {
    if (!items || !Array.isArray(items)) return [];
    return [...items].sort((a, b) => {
      const dateA = a.date_reported ? new Date(a.date_reported).getTime() : 0;
      const dateB = b.date_reported ? new Date(b.date_reported).getTime() : 0;
      return dateB - dateA;
    });
  };

  const renderMatchRow = (match, index) => {
    if (!match) return null;
    const lostItem = match.lost_item || {};
    const foundItem = match.found_item || {};
    const matchScore = match.match_score || 0;
    const matchReasons = match.match_reasons || [];

    return (
      <tr key={`match-${index}`}>
        <td colSpan="9">
          <div className="match-row-container">
            <div className="match-row-header">
              <span className="match-score">
                {Math.round(matchScore * 100)}% Match
              </span>
              <div className="match-reasons">
                {matchReasons.map((reason, i) => (
                  <span key={`reason-${i}`} className="reason-badge">
                    {reason}
                  </span>
                ))}
              </div>
              <div className="match-actions">
                {lostItem.status === 'pending' && (
                  <button
                    className="btn btn-success"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsFound(lostItem.id);
                    }}
                    disabled={refreshingMatches}
                  >
                    <FiCheck /> {refreshingMatches ? 'Processing...' : 'Mark as Found'}
                  </button>
                )}
                <button
                  className="btn btn-outline-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(foundItem);
                  }}
                >
                  <FiEye /> Found Item
                </button>
                <button
                  className="btn btn-outline-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(lostItem);
                  }}
                >
                  <FiEye /> Lost Item
                </button>
              </div>
            </div>
            <div className="match-details-container">
              <div className="match-column lost-column">
                <h4>Lost Item</h4>
                <p><strong>Type:</strong> {lostItem.type === 'card' ? 'Card' : 'Item'}</p>
                {lostItem.type === 'card' ? (
                  <>
                    <p><strong>Card Type:</strong> {safeText(lostItem.card_type)}</p>
                    <p><strong>Last 4 Digits:</strong> {safeText(lostItem.card_last_four)}</p>
                  </>
                ) : (
                  <>
                    <p><strong>Name:</strong> {safeText(lostItem.item_name)}</p>
                    <p><strong>Description:</strong> {safeText(lostItem.description)}</p>
                  </>
                )}
                <p><strong>Owner:</strong> {safeText(lostItem.owner_name, 'Unknown')}</p>
                <p><strong>Place Lost:</strong> {safeText(lostItem.place_lost)}</p>
                <p><strong>Date Reported:</strong> {lostItem.date_reported ? new Date(lostItem.date_reported).toLocaleString() : 'N/A'}</p>
                <p><strong>Status:</strong> <span className={`status-badge ${lostItem.status || 'pending'}`}>{lostItem.status || 'pending'}</span></p>
              </div>
              <div className="match-column found-column">
                <h4>Found Item</h4>
                <p><strong>Type:</strong> {foundItem.type === 'card' ? 'Card' : 'Item'}</p>
                {foundItem.type === 'card' ? (
                  <>
                    <p><strong>Card Type:</strong> {safeText(foundItem.card_type)}</p>
                    <p><strong>Last 4 Digits:</strong> {safeText(foundItem.card_last_four)}</p>
                  </>
                ) : (
                  <>
                    <p><strong>Name:</strong> {safeText(foundItem.item_name)}</p>
                    <p><strong>Description:</strong> {safeText(foundItem.description)}</p>
                  </>
                )}
                <p><strong>Owner:</strong> {safeText(foundItem.owner_name, 'Unknown')}</p>
                <p><strong>Place Found:</strong> {safeText(foundItem.place_found)}</p>
                <p><strong>Date Reported:</strong> {foundItem.date_reported ? new Date(foundItem.date_reported).toLocaleString() : 'N/A'}</p>
                <p><strong>Status:</strong> <span className={`status-badge ${foundItem.status || 'pending'}`}>{foundItem.status || 'pending'}</span></p>
              </div>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  const renderRow = (item, isLost = false) => {
    if (!item) return null;
    const rowProps = !isLost ? {
      onClick: () => onViewDetails(item),
      className: 'clickable-row'
    } : {};

    return (
      <tr key={`${isLost ? 'lost' : 'found'}-${item.id}`} {...rowProps}>
        <td>{item.type === 'card' ? '💳 Card' : '🧳 Item'}</td>
        <td>
          {item.type === 'card'
            ? `${safeText(item.card_type)} (${safeText(item.card_last_four)})`
            : `${safeText(item.item_name, 'Unnamed')} - ${safeText(item.description, 'No description')}`}
        </td>
        <td>{safeText(item.owner_name, 'Unknown')}</td>
        <td>{isLost ? safeText(item.place_lost) : safeText(item.place_found)}</td>
        <td>{isLost ? safeText(item.reporter_member_id) : safeText(item.finder_name)}</td>
        <td>{isLost ? safeText(item.reporter_phone) : safeText(item.finder_phone)}</td>
        <td>{item.date_reported ? new Date(item.date_reported).toLocaleString() : 'N/A'}</td>
        <td>
          <span className={`status-badge ${item.status || 'pending'}`}>
            {item.status || 'pending'}
          </span>
        </td>
        <td>
          <div className="action-buttons">
            {/* {isLost && item.status === 'pending' ? (
              <button
                className="btn btn-sm btn-success"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAsFound(item.id);
                }}
                disabled={refreshingMatches}
              >
                <FiCheck /> {refreshingMatches ? '...' : 'Foundxx'}
              </button>
              
            ) : ( */}
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(item);
                }}
              >
                <FiEye /> Details
              </button>
            
          </div>
        </td>
      </tr>
    );
  };

  const renderMatchesTable = () => {
    const hasMatches = potentialMatches && potentialMatches.length > 0;
    const sortedMatches = hasMatches ? [...potentialMatches].sort((a, b) => {
      const dateA = Math.max(
        a.lost_item?.date_reported ? new Date(a.lost_item.date_reported).getTime() : 0,
        a.found_item?.date_reported ? new Date(a.found_item.date_reported).getTime() : 0
      );
      const dateB = Math.max(
        b.lost_item?.date_reported ? new Date(b.lost_item.date_reported).getTime() : 0,
        b.found_item?.date_reported ? new Date(b.found_item.date_reported).getTime() : 0
      );
      return dateB - dateA;
    }) : [];

    return (
      <>
        <div className="table-header">
        </div>
        <div className="table-container" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <table className="items-table matches-table">
            <thead>
              <tr>
                <th colSpan="9">Match Details</th>
              </tr>
            </thead>
            <tbody>
              {loadingMatches ? (
                <tr><td colSpan="9" className="loading-message">Loading matches...</td></tr>
              ) : hasMatches ? (
                sortedMatches.map((match, index) => renderMatchRow(match, index))
              ) : (
                <tr><td colSpan="9" className="no-data-message">No matches found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h4>
                  <FiAlertTriangle className="text-warning me-2" />
                  Confirm Mark as Found
                </h4>
                <button 
                  className="close-btn"
                  onClick={() => setShowConfirmModal(false)}
                >
                  <FiX />
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to mark this item as found?</p>
                <p>This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={refreshingMatches}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={confirmMarkAsFound}
                  disabled={refreshingMatches}
                >
                  {refreshingMatches ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // ... rest of the component remains the same ...
const renderTable = (items, isLost) => {
    const hasItems = items && items.length > 0;
    const sortedItems = sortItemsByDate(items);

    return (
      <>
        <div className="table-container" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <table className="items-table">
            <colgroup>
              <col style={{ width: '10%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '7%' }} />
            </colgroup>
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
              {hasItems ? (
                sortedItems.map(item => renderRow(item, isLost))
              ) : (
                <tr>
                  <td colSpan="9" className="no-data-message">
                    No {isLost ? 'lost' : 'found'} items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  if (showMatches) {
    return renderMatchesTable();
  }

  if (activeTab === 'lost') {
    return renderTable(filteredLostItems, true);
  }

  if (activeTab === 'found') {
    return renderTable(filteredFoundItems, false);
  }

  return (
    <div className="no-data-message">
      <div className="sad-emoji">😞</div>
      <h3>No items found</h3>
      <p>Please select a tab to view items.</p>
    </div>
  );
};

export default LostFoundTable;