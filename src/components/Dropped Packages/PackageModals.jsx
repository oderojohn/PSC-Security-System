import React, { useState } from 'react';

const PackageModals = ({
  showDropModal,
  setShowDropModal,
  showPickModal,
  setShowPickModal,
  newDroppedPackage,
  setNewDroppedPackage,
  handleDropPackage,
  showDetailsModal,
  setShowDetailsModal,
  selectedPackage,
  pickedBy,
  setPickedBy,
  handlePick,
  setError,
  setSuccess
}) => {
  const [localError, setLocalError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDropClick = async () => {
    if (
      !newDroppedPackage.description ||
      !newDroppedPackage.recipientName ||
      !newDroppedPackage.recipientPhone ||
      !newDroppedPackage.droppedBy ||
      !newDroppedPackage.dropperPhone
    ) {
      setLocalError('Please fill all fields before submitting.');
      return;
    }
    
    try {
      setIsLoading(true);
      setLocalError(null);
      await handleDropPackage();
      setSuccess('Package dropped successfully!');
      setShowDropModal(false);
      setNewDroppedPackage({
        type: 'package',
        description: '',
        recipientName: '',
        recipientPhone: '',
        droppedBy: '',
        dropperPhone: ''
      });
    } catch (err) {
      setLocalError(err.message || 'Error dropping package');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickClick = async () => {
    if (!pickedBy.name || !pickedBy.phone || !pickedBy.memberId) {
      setLocalError('Please provide full pickup details.');
      return;
    }
    
    try {
      setIsLoading(true);
      setLocalError(null);
      await handlePick();
      setSuccess('Package picked up successfully!');
      setShowDetailsModal(false);
      setPickedBy({ memberId: '', name: '', phone: '' });
    } catch (err) {
      setLocalError(err.message || 'Error picking up package');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showDropModal && (
        <div className="modal-overlay">
          <div className="add-modal">
            {isLoading && <div className="loading-bar"></div>}
            
            <h3>Drop New Package</h3>
            
            {localError && (
              <div className="modal-error-message">
                <span className="error-icon">⚠️</span>
                {localError}
                <button 
                  className="error-close"
                  onClick={() => setLocalError(null)}
                >
                  &times;
                </button>
              </div>
            )}

            <div className="form-group">
              <label>Package Type</label>
              <select
                value={newDroppedPackage.type}
                onChange={(e) => setNewDroppedPackage({ ...newDroppedPackage, type: e.target.value })}
                disabled={isLoading}
              >
                <option value="package">Package</option>
                <option value="document">Document</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                placeholder="e.g., Red box, A4 envelope"
                value={newDroppedPackage.description}
                onChange={(e) => setNewDroppedPackage({ ...newDroppedPackage, description: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Recipient Name</label>
              <input
                type="text"
                placeholder="Recipient's full name"
                value={newDroppedPackage.recipientName}
                onChange={(e) => setNewDroppedPackage({ ...newDroppedPackage, recipientName: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Recipient Phone</label>
              <input
                type="text"
                placeholder="Recipient's phone number"
                value={newDroppedPackage.recipientPhone}
                onChange={(e) => setNewDroppedPackage({ ...newDroppedPackage, recipientPhone: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                placeholder="Who is dropping this package?"
                value={newDroppedPackage.droppedBy}
                onChange={(e) => setNewDroppedPackage({ ...newDroppedPackage, droppedBy: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Your Phone</label>
              <input
                type="text"
                placeholder="Your phone number"
                value={newDroppedPackage.dropperPhone}
                onChange={(e) => setNewDroppedPackage({ ...newDroppedPackage, dropperPhone: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="modal-actions">
              <button 
                onClick={() => {
                  setShowDropModal(false);
                  setLocalError(null);
                }}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                className="primary" 
                onClick={handleDropClick}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && selectedPackage && (
        <div className="modal-overlay">
          <div className="add-modal">
            {isLoading && <div className="loading-bar"></div>}
            
            <button 
              className="modal-close-btn"
              onClick={() => {
                setShowDetailsModal(false);
                setLocalError(null);
              }}
              disabled={isLoading}
            >
              &times;
            </button>
            
            <h3>Package Details</h3>

            {localError && (
              <div className="modal-error-message">
                <span className="error-icon">⚠️</span>
                {localError}
                <button 
                  className="error-close"
                  onClick={() => setLocalError(null)}
                >
                  &times;
                </button>
              </div>
            )}

            <div className="item-details-grid">
              <div className="detail-field">
                <strong>Code:</strong> 
                <span>{selectedPackage.code}</span>
              </div>
              <div className="detail-field">
                <strong>Type:</strong> 
                <span>{selectedPackage.type === 'document' ? 'Document' : 'Package'}</span>
              </div>
              <div className="detail-field">
                <strong>Description:</strong> 
                <span>{selectedPackage.description}</span>
              </div>
              <div className="detail-item">
            <span className="detail-label">Shelf Number:</span>
            <span className="detail-value shelf-number">
              {selectedPackage.shelf}
            </span>
          </div>
              <div className="detail-field">
                <strong>Recipient:</strong> 
                <span>{selectedPackage.recipient_name}</span>
              </div>
              <div className="detail-field">
                <strong>Recipient Phone:</strong> 
                <span>{selectedPackage.recipient_phone}</span>
              </div>
              <div className="detail-field">
                <strong>Dropped By:</strong> 
                <span>{selectedPackage.dropped_by}</span>
              </div>
              {selectedPackage.picked_by && (
                <div className="detail-field">
                  <strong>Picked By:</strong> 
                  <span>{selectedPackage.picked_by}</span>
                </div>
              )}
              <div className="detail-field">
                <strong>Status:</strong> 
                <span className={`status-${selectedPackage.status}`}>
                  {selectedPackage.status}
                </span>
              </div>
              <div className="detail-field">
                <strong>Date Dropped:</strong> 
                <span>{new Date(selectedPackage.created_at).toLocaleString()}</span>
              </div>
              {selectedPackage.picked_at && (
                <div className="detail-field">
                  <strong>Date Picked:</strong> 
                  <span>{new Date(selectedPackage.picked_at).toLocaleString()}</span>
                </div>
              )}
            </div>

            {selectedPackage.status === 'pending' && (
              <div className="pickup-form-section">
                <h4>Pick Up Verification</h4>
                
                <div className="form-group">
                  <label>Member ID/ID Number</label>
                  <input
                    type="text"
                    placeholder="Your identification number"
                    value={pickedBy.memberId}
                    onChange={(e) => setPickedBy({ ...pickedBy, memberId: e.target.value })}
                    className="form-input"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={pickedBy.name}
                    onChange={(e) => setPickedBy({ ...pickedBy, name: e.target.value })}
                    className="form-input"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    placeholder="Your phone number"
                    value={pickedBy.phone}
                    onChange={(e) => setPickedBy({ ...pickedBy, phone: e.target.value })}
                    className="form-input"
                    disabled={isLoading}
                  />
                </div>

                <div className="modal-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => {
                      setPickedBy({ memberId: '', name: '', phone: '' });
                      setShowDetailsModal(false);
                      setLocalError(null);
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    className="primary-btn"
                    onClick={handlePickClick}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner"></span>
                        Processing...
                      </>
                    ) : 'Verify Pickup'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PackageModals;