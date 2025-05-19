import React, { useState } from 'react';
import "../../assets/css/modals.css"

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
  const [showPickForm, setShowPickForm] = useState(false);

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
      setShowPickForm(false);
    } catch (err) {
      setLocalError(err.message || 'Error picking up package');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPickupProcess = () => {
    setShowPickForm(false);
    setPickedBy({ memberId: '', name: '', phone: '' });
    setLocalError(null);
  };

  return (
    <>
      {/* Drop Package Modal */}
      {showDropModal && (
        <div className="modal-overlay">
          <div className="modal-content small-modal">
            <div className="modal-header">
              <h3>Drop New Package</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowDropModal(false);
                  setLocalError(null);
                }}
                disabled={isLoading}
              >
                &times;
              </button>
            </div>
            
            {isLoading && <div className="loading-bar"></div>}
            
            {localError && (
              <div className="modal-error">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{localError}</span>
                <button 
                  className="error-close"
                  onClick={() => setLocalError(null)}
                >
                  &times;
                </button>
              </div>
            )}

            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Package Type</label>
                  <select
                    value={newDroppedPackage.type}
                    onChange={(e) => setNewDroppedPackage({ ...newDroppedPackage, type: e.target.value })}
                    disabled={isLoading}
                  >
                    <option value="package">Package</option>
                    <option value="document">Document</option>
                    <option value="keys">Keys</option>
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
              </div>

              <div className="form-row">
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
                    placeholder="e.g., 0712345678"
                    value={newDroppedPackage.recipientPhone}
                    onChange={(e) => setNewDroppedPackage({ ...newDroppedPackage, recipientPhone: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    placeholder="Who is dropping this?"
                    value={newDroppedPackage.droppedBy}
                    onChange={(e) => setNewDroppedPackage({ ...newDroppedPackage, droppedBy: e.target.value })}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label>Your Phone</label>
                  <input
                    type="text"
                    placeholder="e.g., 0712345678"
                    value={newDroppedPackage.dropperPhone}
                    onChange={(e) => setNewDroppedPackage({ ...newDroppedPackage, dropperPhone: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowDropModal(false);
                  setLocalError(null);
                }}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleDropClick}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : 'Submit Package'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Package Details Modal */}
      {showDetailsModal && selectedPackage && (
        <div className="modal-overlay">
          <div className={`modal-content ${showPickForm ? 'small-modal' : 'medium-modal'}`}>
            <div className="modal-header">
              <h3>{showPickForm ? 'Verify Pickup' : 'Package Details'}</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowDetailsModal(false);
                  resetPickupProcess();
                }}
                disabled={isLoading}
              >
                &times;
              </button>
            </div>
            
            {isLoading && <div className="loading-bar"></div>}
            
            {localError && (
              <div className="modal-error">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{localError}</span>
                <button 
                  className="error-close"
                  onClick={() => setLocalError(null)}
                >
                  &times;
                </button>
              </div>
            )}

            {!showPickForm ? (
              <>
                <div className="modal-body">
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Code:</span>
                      <span className="detail-value code">{selectedPackage.code}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Type:</span>
                      <span className="detail-value">{selectedPackage.type === 'document' ? 'Document' : 'Package'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Description:</span>
                      <span className="detail-value">{selectedPackage.description}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Shelf Number:</span>
                      <span className="detail-value shelf-number">
                        {selectedPackage.shelf}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Recipient:</span>
                      <span className="detail-value">{selectedPackage.recipient_name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Recipient Phone:</span>
                      <span className="detail-value">{selectedPackage.recipient_phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Dropped By:</span>
                      <span className="detail-value">{selectedPackage.dropped_by}</span>
                    </div>
                    {selectedPackage.picked_by && (
                      <div className="detail-item">
                        <span className="detail-label">Picked By:</span>
                        <span className="detail-value">{selectedPackage.picked_by}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className={`detail-value status-${selectedPackage.status}`}>
                        {selectedPackage.status}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Date Dropped:</span>
                      <span className="detail-value">{new Date(selectedPackage.created_at).toLocaleString()}</span>
                    </div>
                    {selectedPackage.picked_at && (
                      <div className="detail-item">
                        <span className="detail-label">Date Picked:</span>
                        <span className="detail-value">{new Date(selectedPackage.picked_at).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedPackage.status === 'pending' && (
                  <div className="modal-footer">
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowPickForm(true)}
                    >
                      Initiate Pickup
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="modal-body">
                <div className="pickup-instructions">
                  <p>Please provide your details to verify this pickup:</p>
                </div>
                
                <div className="form-group">
                  <label>Member ID/ID Number</label>
                  <input
                    type="text"
                    placeholder="Your identification number"
                    value={pickedBy.memberId}
                    onChange={(e) => setPickedBy({ ...pickedBy, memberId: e.target.value })}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Your full name as per ID"
                    value={pickedBy.name}
                    onChange={(e) => setPickedBy({ ...pickedBy, name: e.target.value })}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    placeholder="Your active phone number"
                    value={pickedBy.phone}
                    onChange={(e) => setPickedBy({ ...pickedBy, phone: e.target.value })}
                    disabled={isLoading}
                  />
                </div>

                <div className="modal-footer">
                  <button 
                    className="btn btn-secondary"
                    onClick={resetPickupProcess}
                    disabled={isLoading}
                  >
                    Back to Details
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={handlePickClick}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner"></span>
                        Verifying...
                      </>
                    ) : 'Complete Pickup'}
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