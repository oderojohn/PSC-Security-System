import React from 'react';
import '../../assets/css/LostFoundModals.css'; 
import { FiLink, FiX } from 'react-icons/fi';

const LostFoundModals = ({
  showAddLostModal,
  setShowAddLostModal,
  showAddFoundModal,
  setShowAddFoundModal,
  newLostItem,
  setNewLostItem,
  newFoundItem,
  setNewFoundItem,
  handleAddLostItem,
  handleAddFoundItem,
  showDetailsModal,
  setShowDetailsModal,
  selectedItem,
  pickedBy,
  setPickedBy,
  handlePick,
  showPickupForm,
  setShowPickupForm,
  showMatchesModal,
  setShowMatchesModal,
  potentialMatches
}) => {
  return (
    <>
      {/* Lost Item Modal */}
      {showAddLostModal && (
        <div className="lf-modal-overlay">
          <div className="lf-modal-container">
            <div className="lf-modal-header">
              <h3>Report Lost Item</h3>
              <button 
                className="lf-modal-close-btn"
                onClick={() => setShowAddLostModal(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="lf-modal-body">
              <div className="lf-form-group">
                <label>Item Type</label>
                <select
                  className="lf-form-control"
                  value={newLostItem.type}
                  onChange={(e) => setNewLostItem({ ...newLostItem, type: e.target.value })}
                >
                  <option value="card">Card</option>
                  <option value="item">Item</option>
                </select>
              </div>

              {newLostItem.type === 'card' ? (
                <div className="lf-form-group">
                  <label>Last 4 Digits</label>
                  <input
                    className="lf-form-control"
                    type="text"
                    placeholder="e.g., 4242"
                    value={newLostItem.card_last_four}
                    onChange={(e) => setNewLostItem({ ...newLostItem, card_last_four: e.target.value })}
                  />
                </div>
              ) : (
                <>
                  <div className="lf-form-group">
                    <label>Item Name</label>
                    <input
                      className="lf-form-control"
                      type="text"
                      placeholder="e.g., AirPods"
                      value={newLostItem.item_name}
                      onChange={(e) => setNewLostItem({ ...newLostItem, item_name: e.target.value })}
                    />
                  </div>
                  <div className="lf-form-group">
                    <label>Description</label>
                    <input
                      className="lf-form-control"
                      type="text"
                      placeholder="Description of the item"
                      value={newLostItem.description}
                      onChange={(e) => setNewLostItem({ ...newLostItem, description: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className="lf-form-group">
                <label>Owner Name (if known)</label>
                <input
                  className="lf-form-control"
                  type="text"
                  placeholder="Owner's name"
                  value={newLostItem.owner_name}
                  onChange={(e) => setNewLostItem({ ...newLostItem, owner_name: e.target.value })}
                />
              </div>

              <div className="lf-form-group">
                <label>Place Lost</label>
                <input
                  className="lf-form-control"
                  type="text"
                  placeholder="Where was it lost?"
                  value={newLostItem.place_lost}
                  onChange={(e) => setNewLostItem({ ...newLostItem, place_lost: e.target.value })}
                />
              </div>

              <div className="lf-form-group">
                <label>Your Member Number</label>
                <input
                  className="lf-form-control"
                  type="text"
                  placeholder="Your member ID"
                  value={newLostItem.reporter_member_id}
                  onChange={(e) => setNewLostItem({ ...newLostItem, reporter_member_id: e.target.value })}
                />
              </div>

              <div className="lf-form-group">
                <label>Your Phone Number</label>
                <input
                  className="lf-form-control"
                  type="tel"
                  placeholder="Your contact number"
                  value={newLostItem.reporter_phone}
                  onChange={(e) => setNewLostItem({ ...newLostItem, reporter_phone: e.target.value })}
                />
              </div>
            </div>

            <div className="lf-modal-footer">
              <button 
                className="lf-btn lf-btn-secondary"
                onClick={() => setShowAddLostModal(false)}
              >
                Cancel
              </button>
              <button 
                className="lf-btn lf-btn-primary"
                onClick={handleAddLostItem}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Found Item Modal */}
      {showAddFoundModal && (
        <div className="lf-modal-overlay">
          <div className="lf-modal-container">
            <div className="lf-modal-header">
              <h3>Report Found Item</h3>
              <button 
                className="lf-modal-close-btn"
                onClick={() => setShowAddFoundModal(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="lf-modal-body">
              <div className="lf-form-group">
                <label>Item Type</label>
                <select
                  className="lf-form-control"
                  value={newFoundItem.type}
                  onChange={(e) => setNewFoundItem({ ...newFoundItem, type: e.target.value })}
                >
                  <option value="card">Card</option>
                  <option value="item">Item</option>
                </select>
              </div>

              {newFoundItem.type === 'card' ? (
                <div className="lf-form-group">
                  <label>Last 4 Digits</label>
                  <input
                    className="lf-form-control"
                    type="text"
                    placeholder="e.g., 4242"
                    value={newFoundItem.card_last_four}
                    onChange={(e) => setNewFoundItem({ ...newFoundItem, card_last_four: e.target.value })}
                  />
                </div>
              ) : (
                <>
                  <div className="lf-form-group">
                    <label>Item Name</label>
                    <input
                      className="lf-form-control"
                      type="text"
                      placeholder="e.g., Wallet"
                      value={newFoundItem.item_name}
                      onChange={(e) => setNewFoundItem({ ...newFoundItem, item_name: e.target.value })}
                    />
                  </div>
                  <div className="lf-form-group">
                    <label>Description</label>
                    <input
                      className="lf-form-control"
                      type="text"
                      placeholder="Description of the item"
                      value={newFoundItem.description}
                      onChange={(e) => setNewFoundItem({ ...newFoundItem, description: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className="lf-form-group">
                <label>Owner Name (if known)</label>
                <input
                  className="lf-form-control"
                  type="text"
                  placeholder="Owner's name"
                  value={newFoundItem.owner_name}
                  onChange={(e) => setNewFoundItem({ ...newFoundItem, owner_name: e.target.value })}
                />
              </div>

              <div className="lf-form-group">
                <label>Place Found</label>
                <input
                  className="lf-form-control"
                  type="text"
                  placeholder="Where was it found?"
                  value={newFoundItem.place_found}
                  onChange={(e) => setNewFoundItem({ ...newFoundItem, place_found: e.target.value })}
                />
              </div>

              <div className="lf-form-group">
                <label>Your Name</label>
                <input
                  className="lf-form-control"
                  type="text"
                  placeholder="Finder's name"
                  value={newFoundItem.finder_name}
                  onChange={(e) => setNewFoundItem({ ...newFoundItem, finder_name: e.target.value })}
                />
              </div>

              <div className="lf-form-group">
                <label>Your Phone Number</label>
                <input
                  className="lf-form-control"
                  type="tel"
                  placeholder="Your contact number"
                  value={newFoundItem.finder_phone}
                  onChange={(e) => setNewFoundItem({ ...newFoundItem, finder_phone: e.target.value })}
                />
              </div>
            </div>

            <div className="lf-modal-footer">
              <button 
                className="lf-btn lf-btn-secondary"
                onClick={() => setShowAddFoundModal(false)}
              >
                Cancel
              </button>
              <button 
                className="lf-btn lf-btn-primary"
                onClick={handleAddFoundItem}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="lf-modal-overlay">
          <div className="lf-modal-container lf-details-modal">
            <div className="lf-modal-header">
              <h3>Item Details</h3>
              <button 
                className="lf-modal-close-btn"
                onClick={() => {
                  setShowDetailsModal(false);
                  setShowPickupForm(false);
                }}
              >
                &times;
              </button>
            </div>
            
            <div className="lf-modal-body">
              <div className="lf-details-grid">
                <div className="lf-detail-row">
                  <span className="lf-detail-label">Type:</span>
                  <span className="lf-detail-value">
                    {selectedItem.type === 'card' ? '💳 Card' : '🧳 Item'}
                  </span>
                </div>

                {selectedItem.type === 'card' ? (
                  <div className="lf-detail-row">
                    <span className="lf-detail-label">Card Number:</span>
                    <span className="lf-detail-value">{selectedItem.card_last_four}</span>
                  </div>
                ) : (
                  <>
                    <div className="lf-detail-row">
                      <span className="lf-detail-label">Item Name:</span>
                      <span className="lf-detail-value">{selectedItem.item_name}</span>
                    </div>
                    <div className="lf-detail-row">
                      <span className="lf-detail-label">Description:</span>
                      <span className="lf-detail-value">{selectedItem.description}</span>
                    </div>
                  </>
                )}

                <div className="lf-detail-row">
                  <span className="lf-detail-label">Owner:</span>
                  <span className="lf-detail-value">{selectedItem.owner_name || 'Unknown'}</span>
                </div>

                {selectedItem.place_lost && (
                  <div className="lf-detail-row">
                    <span className="lf-detail-label">Place Lost:</span>
                    <span className="lf-detail-value">{selectedItem.place_lost}</span>
                  </div>
                )}

                {selectedItem.place_found && (
                  <div className="lf-detail-row">
                    <span className="lf-detail-label">Place Found:</span>
                    <span className="lf-detail-value">{selectedItem.place_found}</span>
                  </div>
                )}

                <div className="lf-detail-row">
                  <span className="lf-detail-label">
                    {selectedItem.place_lost ? 'Reported By:' : 'Found By:'}
                  </span>
                  <span className="lf-detail-value">
                    {selectedItem.reporter_member_id || selectedItem.finder_name}
                  </span>
                </div>

                <div className="lf-detail-row">
                  <span className="lf-detail-label">Contact:</span>
                  <span className="lf-detail-value">
                    {selectedItem.reporter_phone || selectedItem.finder_phone}
                  </span>
                </div>

                <div className="lf-detail-row">
                  <span className="lf-detail-label">Status:</span>
                  <span className={`lf-status-badge lf-status-${selectedItem.status}`}>
                    {selectedItem.status}
                  </span>
                </div>

                <div className="lf-detail-row">
                  <span className="lf-detail-label">Date Reported:</span>
                  <span className="lf-detail-value">
                    {new Date(selectedItem.date_reported).toLocaleString()}
                  </span>
                </div>
              </div>

              {!showPickupForm ? (
                <button 
                  className="lf-btn lf-btn-primary lf-pickup-btn"
                  onClick={() => setShowPickupForm(true)}
                  disabled={selectedItem.status !== 'found'}
                >
                  Initiate Pickup Process
                </button>
              ) : (
                <div className="lf-pickup-form">
                  <div className="lf-scan-notice">
                    <p>Members can pick up items by scanning their Membership Card at the scanner.</p>
                  </div>
                  
                  <h4>Manual Pick Up Form</h4>
                  
                  <div className="lf-form-group">
                    <label>Member No/ID No</label>
                    <input
                      className="lf-form-control"
                      type="text"
                      placeholder="Member identification number"
                      value={pickedBy.memberId}
                      onChange={(e) => setPickedBy({ ...pickedBy, memberId: e.target.value })}
                    />
                  </div>

                  <div className="lf-form-group">
                    <label>Full Name</label>
                    <input
                      className="lf-form-control"
                      type="text"
                      placeholder="Member's full name"
                      value={pickedBy.name}
                      onChange={(e) => setPickedBy({ ...pickedBy, name: e.target.value })}
                    />
                  </div>

                  <div className="lf-form-group">
                    <label>Phone Number</label>
                    <input
                      className="lf-form-control"
                      type="tel"
                      placeholder="Member's phone number"
                      value={pickedBy.phone}
                      onChange={(e) => setPickedBy({ ...pickedBy, phone: e.target.value })}
                    />
                  </div>

                  <div className="lf-modal-footer">
                    <button 
                      className="lf-btn lf-btn-secondary"
                      onClick={() => {
                        setShowPickupForm(false);
                        setPickedBy({ memberId: '', name: '', phone: '' });
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      className="lf-btn lf-btn-primary"
                      onClick={handlePick}
                    >
                      Confirm Pickup
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showMatchesModal && (
        <div className="lf-modal-overlay">
          <div className="lf-modal-container lf-matches-modal">
            <div className="lf-modal-header">
              <h3>
                <FiLink size={18} /> Potential Matches
              </h3>
              <button 
                className="lf-modal-close-btn"
                onClick={() => setShowMatchesModal(false)}
              >
                <FiX size={18} />
              </button>
            </div>
            
            <div className="lf-modal-body">
              {potentialMatches.length > 0 ? (
                <div className="matches-list">
                  {potentialMatches.map((match, index) => (
                    <div key={index} className="match-item">
                      <div className="match-header">
                        <span className="match-score">
                          {Math.round(match.match_score * 100)}% Match
                        </span>
                        <div className="match-reasons">
                          {match.match_reasons.map((reason, i) => (
                            <span key={i} className="reason-badge">{reason}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="match-details">
                        <div className="match-column">
                          <h4>Lost Item</h4>
                          <p><strong>Type:</strong> {match.lost_item.type === 'card' ? 'Card' : 'Item'}</p>
                          {match.lost_item.type === 'card' ? (
                            <p><strong>Last 4 Digits:</strong> {match.lost_item.card_last_four}</p>
                          ) : (
                            <>
                              <p><strong>Name:</strong> {match.lost_item.item_name}</p>
                              <p><strong>Description:</strong> {match.lost_item.description}</p>
                            </>
                          )}
                          <p><strong>Owner:</strong> {match.lost_item.owner_name || 'Unknown'}</p>
                          <p><strong>Place Lost:</strong> {match.lost_item.place_lost}</p>
                        </div>
                        
                        <div className="match-column">
                          <h4>Found Item</h4>
                          <p><strong>Type:</strong> {match.found_item.type === 'card' ? 'Card' : 'Item'}</p>
                          {match.found_item.type === 'card' ? (
                            <p><strong>Last 4 Digits:</strong> {match.found_item.card_last_four}</p>
                          ) : (
                            <>
                              <p><strong>Name:</strong> {match.found_item.item_name}</p>
                              <p><strong>Description:</strong> {match.found_item.description}</p>
                            </>
                          )}
                          <p><strong>Owner:</strong> {match.found_item.owner_name || 'Unknown'}</p>
                          <p><strong>Place Found:</strong> {match.found_item.place_found}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-matches">
                  <p>No potential matches found for this item.</p>
                </div>
              )}
            </div>

            <div className="lf-modal-footer">
              <button 
                className="lf-btn lf-btn-primary"
                onClick={() => setShowMatchesModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LostFoundModals;