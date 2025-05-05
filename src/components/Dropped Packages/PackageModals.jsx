import React from 'react';

const PackageModals = ({
  showDropModal,
  setShowDropModal,
  showPickModal,
  setShowPickModal,
  newDroppedPackage,
  setNewDroppedPackage,
  newPickedPackage,
  setNewPickedPackage,
  handleDropPackage,
  handlePickPackage,
  showDetailsModal,
  setShowDetailsModal,
  selectedPackage,
  pickedBy,
  setPickedBy,
  handlePick
}) => {
  return (
    <>
      {showDropModal && (
        <div className="modal-overlay">
          <div className="add-modal">
            <h3>Drop New Package</h3>
            <select
              value={newDroppedPackage.type}
              onChange={(e) => setNewDroppedPackage({ ...newDroppedPackage, type: e.target.value })}
            >
              <option value="package">Package</option>
              <option value="document">Document</option>
            </select>

            <input
              type="text"
              placeholder="Description (e.g., Red box, A4 envelope)"
              value={newDroppedPackage.description}
              onChange={(e) => setNewDroppedPackage({ ...newDroppedPackage, description: e.target.value })}
            />

            <input
              type="text"
              placeholder="Recipient Name"
              value={newDroppedPackage.recipientName}
              onChange={(e) => setNewDroppedPackage({ ...newDroppedPackage, recipientName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Recipient Phone"
              value={newDroppedPackage.recipientPhone}
              onChange={(e) => setNewDroppedPackage({ ...newDroppedPackage, recipientPhone: e.target.value })}
            />
            <input
              type="text"
              placeholder="Your Name (who's dropping)"
              value={newDroppedPackage.droppedBy}
              onChange={(e) => setNewDroppedPackage({ ...newDroppedPackage, droppedBy: e.target.value })}
            />
            <input
              type="text"
              placeholder="Your Phone Number"
              value={newDroppedPackage.dropperPhone}
              onChange={(e) => setNewDroppedPackage({ ...newDroppedPackage, dropperPhone: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={() => setShowDropModal(false)}>Cancel</button>
              <button className="primary" onClick={handleDropPackage}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {showPickModal && (
        <div className="modal-overlay">
          <div className="add-modal">
            <h3>Pick Up Package</h3>
            <input
              type="text"
              placeholder="Package ID or Description"
              value={newPickedPackage.searchTerm}
              onChange={(e) => setNewPickedPackage({ ...newPickedPackage, searchTerm: e.target.value })}
            />
            <input
              type="text"
              placeholder="Your Name"
              value={newPickedPackage.pickerName}
              onChange={(e) => setNewPickedPackage({ ...newPickedPackage, pickerName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Your Phone Number"
              value={newPickedPackage.pickerPhone}
              onChange={(e) => setNewPickedPackage({ ...newPickedPackage, pickerPhone: e.target.value })}
            />
            <input
              type="text"
              placeholder="Recipient Name (if different)"
              value={newPickedPackage.recipientName}
              onChange={(e) => setNewPickedPackage({ ...newPickedPackage, recipientName: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={() => setShowPickModal(false)}>Cancel</button>
              <button className="primary" onClick={handlePickPackage}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && selectedPackage && (
        <div className="modal-overlay">
          <div className="add-modal">
            <button 
              className="modal-close-btn"
              onClick={() => {
                setShowDetailsModal(false);
              }}
            >
              &times;
            </button>
            
            <h3>Package Details</h3>

            <div className="item-details-grid">
              <div className="detail-field"><strong>Type:</strong> {selectedPackage.type === 'document' ? 'Document' : 'Package'}</div>
              <div className="detail-field"><strong>Description:</strong> {selectedPackage.description}</div>
              <div className="detail-field"><strong>Recipient:</strong> {selectedPackage.recipientName}</div>
              <div className="detail-field"><strong>Recipient Phone:</strong> {selectedPackage.recipientPhone}</div>
              {selectedPackage.droppedBy && (
                <div className="detail-field"><strong>Dropped By:</strong> {selectedPackage.droppedBy}</div>
              )}
              {selectedPackage.pickedBy && (
                <div className="detail-field"><strong>Picked By:</strong> {selectedPackage.pickedBy}</div>
              )}
              <div className="detail-field"><strong>Status:</strong> {selectedPackage.status}</div>
              <div className="detail-field"><strong>Date:</strong> {selectedPackage.date}</div>
            </div>

            {selectedPackage.status === 'pending' && (
              <div className="pickup-form-section">
                <h4>Pick Up Verification</h4>
                <input
                  type="text"
                  placeholder="Member ID/ID Number"
                  value={pickedBy.memberId}
                  onChange={(e) => setPickedBy({ ...pickedBy, memberId: e.target.value })}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={pickedBy.name}
                  onChange={(e) => setPickedBy({ ...pickedBy, name: e.target.value })}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={pickedBy.phone}
                  onChange={(e) => setPickedBy({ ...pickedBy, phone: e.target.value })}
                  className="form-input"
                />
                <div className="modal-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => {
                      setPickedBy({ memberId: '', name: '', phone: '' },setShowDetailsModal(false));
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="primary-btn"
                    onClick={handlePick}
                  >
                    Verify Pickup
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