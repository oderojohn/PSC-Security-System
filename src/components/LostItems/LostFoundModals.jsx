import React from 'react';

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
  handlePick
}) => {
  return (
    <>
      {showAddLostModal && (
        <div className="modal-overlay">
          <div className="add-modal">
            <h3>Report Lost Item</h3>
            <select
              value={newLostItem.type}
              onChange={(e) => setNewLostItem({ ...newLostItem, type: e.target.value })}
            >
              <option value="card">Card</option>
              <option value="item">Item</option>
            </select>

            {newLostItem.type === 'card' ? (
              <input
                type="text"
                placeholder="Last 4 digits (e.g., 4242)"
                value={newLostItem.number}
                onChange={(e) => setNewLostItem({ ...newLostItem, number: e.target.value })}
              />
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Item name (e.g., AirPods)"
                  value={newLostItem.name}
                  onChange={(e) => setNewLostItem({ ...newLostItem, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newLostItem.description}
                  onChange={(e) => setNewLostItem({ ...newLostItem, description: e.target.value })}
                />
              </>
            )}

            <input
              type="text"
              placeholder="Owner name (if known)"
              value={newLostItem.owner}
              onChange={(e) => setNewLostItem({ ...newLostItem, owner: e.target.value })}
            />
            <input
              type="text"
              placeholder="Place lost"
              value={newLostItem.placeLost}
              onChange={(e) => setNewLostItem({ ...newLostItem, placeLost: e.target.value })}
            />
            <input
              type="text"
              placeholder="Owner Member Number"
              value={newLostItem.reportedBy}
              onChange={(e) => setNewLostItem({ ...newLostItem, reportedBy: e.target.value })}
            />
            <input
              type="Number"
              placeholder="Owner phone number"
              value={newLostItem.reporterPhone}
              onChange={(e) => setNewLostItem({ ...newLostItem, reporterPhone: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={() => setShowAddLostModal(false)}>Cancel</button>
              <button className="primary" onClick={handleAddLostItem}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {showAddFoundModal && (
        <div className="modal-overlay">
          <div className="add-modal">
            <h3>Report Found Item</h3>
            <select
              value={newFoundItem.type}
              onChange={(e) => setNewFoundItem({ ...newFoundItem, type: e.target.value })}
            >
              <option value="card">Card</option>
              <option value="item">Item</option>
            </select>

            {newFoundItem.type === 'card' ? (
              <input
                type="text"
                placeholder="Last 4 digits (e.g., 4242)"
                value={newFoundItem.number}
                onChange={(e) => setNewFoundItem({ ...newFoundItem, number: e.target.value })}
              />
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Item name (e.g., Wallet)"
                  value={newFoundItem.name}
                  onChange={(e) => setNewFoundItem({ ...newFoundItem, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newFoundItem.description}
                  onChange={(e) => setNewFoundItem({ ...newFoundItem, description: e.target.value })}
                />
              </>
            )}

            <input
              type="text"
              placeholder="Owner name (if known)"
              value={newFoundItem.owner}
              onChange={(e) => setNewFoundItem({ ...newFoundItem, owner: e.target.value })}
            />
            <input
              type="text"
              placeholder="Place found"
              value={newFoundItem.placeFound}
              onChange={(e) => setNewFoundItem({ ...newFoundItem, placeFound: e.target.value })}
            />
            <input
              type="text"
              placeholder="Your name (finder)"
              value={newFoundItem.foundBy}
              onChange={(e) => setNewFoundItem({ ...newFoundItem, foundBy: e.target.value })}
            />
            <input
              type="text"
              placeholder="Your phone number"
              value={newFoundItem.finderPhone}
              onChange={(e) => setNewFoundItem({ ...newFoundItem, finderPhone: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={() => setShowAddFoundModal(false)}>Cancel</button>
              <button className="primary" onClick={handleAddFoundItem}>Submit</button>
            </div>
          </div>
        </div>
      )}

{showDetailsModal && selectedItem && (
  <div className="modal-overlay">
    <div className="add-modal">
      <h3>Item Details</h3>
      <div className="item-details">
        <div className="field"><strong>Type:</strong> {selectedItem.type}</div>
        {selectedItem.type === 'card' ? (
          <div className="field"><strong>Card Last 4 Digits:</strong> {selectedItem.number}</div>
        ) : (
          <>
            <div className="field"><strong>Item Name:</strong> {selectedItem.name}</div>
            <div className="field"><strong>Description:</strong> {selectedItem.description}</div>
          </>
        )}
        <div className="field"><strong>Owner:</strong> {selectedItem.owner || 'Unknown'}</div>
        <div className="field">
          <strong>{selectedItem.placeLost ? 'Place Lost:' : 'Place Found:'}</strong> {selectedItem.placeLost || selectedItem.placeFound}
        </div>
        <div className="field"><strong>Reported/Found By:</strong> {selectedItem.reportedBy || selectedItem.foundBy}</div>
        <div className="field"><strong>Contact:</strong> {selectedItem.reporterPhone || selectedItem.finderPhone}</div>
      </div>

      <h4>Pick Up Form</h4>
      <input
        type="text"
        placeholder="Member ID"
        value={pickedBy.memberId}
        onChange={(e) => setPickedBy({ ...pickedBy, memberId: e.target.value })}
      />
      <input
        type="text"
        placeholder="Full Name"
        value={pickedBy.name}
        onChange={(e) => setPickedBy({ ...pickedBy, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={pickedBy.phone}
        onChange={(e) => setPickedBy({ ...pickedBy, phone: e.target.value })}
      />
      <div className="modal-actions">
        <button onClick={() => setShowDetailsModal(false)}>Cancel</button>
        <button className="primary" onClick={handlePick}>Pick</button>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default LostFoundModals;