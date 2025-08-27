import React, { useState } from 'react';
import { FiCheck, FiEye } from 'react-icons/fi';
import ConfirmationModal from '../ConfirmationModal';

const MatchesTable = ({
  potentialMatches,
  loadingMatches,
  markAsFound,
  onViewDetails
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

  const handleMarkAsFound = (itemId) => {
    setSelectedItemId(itemId);
    setShowConfirmModal(true);
  };

  const confirmMarkAsFound = async () => {
    setShowConfirmModal(false);
    setRefreshingMatches(true);
    await markAsFound(selectedItemId);
    setRefreshingMatches(false);
  };

  const sortedMatches = [...(potentialMatches || [])].sort((a, b) => {
    const dateA = Math.max(
      a.lost_item?.date_reported ? new Date(a.lost_item.date_reported).getTime() : 0,
      a.found_item?.date_reported ? new Date(a.found_item.date_reported).getTime() : 0
    );
    const dateB = Math.max(
      b.lost_item?.date_reported ? new Date(b.lost_item.date_reported).getTime() : 0,
      b.found_item?.date_reported ? new Date(b.found_item.date_reported).getTime() : 0
    );
    return dateB - dateA;
  });

  return (
    <>
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
            ) : sortedMatches.length > 0 ? (
              sortedMatches.map((match, index) => (
                <MatchRow
                  key={`match-${index}`}
                  match={match}
                  onMarkAsFound={handleMarkAsFound}
                  onViewDetails={onViewDetails}
                  refreshingMatches={refreshingMatches}
                  safeText={safeText}
                />
              ))
            ) : (
              <tr><td colSpan="9" className="no-data-message">No matches found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmMarkAsFound}
        title="Confirm Mark as Found"
        message="Are you sure you want to mark this item as found? This action cannot be undone."
        isLoading={refreshingMatches}
      />
    </>
  );
};

const MatchRow = ({ match, onMarkAsFound, onViewDetails, refreshingMatches, safeText }) => {
  const lostItem = match.lost_item || {};
  const foundItem = match.found_item || {};
  const matchScore = match.match_score || 0;
  const matchReasons = match.match_reasons || [];

  return (
    <tr>
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
                    onMarkAsFound(lostItem.id);
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

export default MatchesTable;