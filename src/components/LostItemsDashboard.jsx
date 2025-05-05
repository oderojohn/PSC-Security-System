// (Main Entry)
import React, { useState } from 'react';
import LostFoundHeader from './LostItems/LostFoundHeader';
import LostFoundStats from './LostItems/LostFoundStats';
import LostFoundTable from './LostItems/LostFoundTable';
import LostFoundModals from './LostItems/LostFoundModals';
import '../assets/css/LostItemsDashboard.css';

const LostItemsDashboard = () => {
  const [lostItems, setLostItems] = useState([
    { id: 1, type: 'card', number: 'K4242', owner: 'john odero', placeLost: 'Koroga', date: '2024-05-20 2300hrs', status: 'pending', reportedBy: 'K1212', reporterPhone: '0792455501' },
    { id: 2, type: 'item', name: 'AirPods Pro',owner: 'john odero', description: 'White with scratch', placeLost: 'Cafeteria', date: '2024-05-18  1815hrs', status: 'pending', reportedBy: 'M1327', reporterPhone: '0712345678' },
    { id: 3, type: 'card', number: 'K4242', owner: 'john odero', placeLost: 'Koroga', date: '2024-05-20 1453hrs', status: 'pending', reportedBy: 'John Odero', reporterPhone: '0792455501' },
    { id: 4, type: 'item', name: 'AirPods Pro',owner: 'john odero', description: 'White with scratch', placeLost: 'Cafeteria', date: '2024-05-18 1200hrs', status: 'pending', reportedBy: 'w2329', reporterPhone: '0712345678' },
  
  ]);

  const [foundItems, setFoundItems] = useState([
    { id: 5, type: 'card', number: 'M5678', owner: 'Mike Johnson', placeFound: 'Gym', foundBy: 'Staff A', finderPhone: '0754434208', date: '2024-05-21  0012hrs', status: 'found' },
    { id: 6, type: 'item', name: 'Wallet', description: 'Black leather  ', placeFound: 'Pool', foundBy: 'Staff B', finderPhone: '0754434208', owner: 'John Odero', date: '2024-05-19  1345hrs', status: 'found' },
    { id: 7, type: 'card', number: 'k1245', owner: 'Mike Johnson', placeFound: 'Gym', foundBy: 'Staff C', finderPhone: '0754434208', date: '2024-05-21 1200Hrs', status: 'found' },
    { id: 8, type: 'item', name: 'Ball', description: 'Black leather', placeFound: 'Pool', foundBy: 'Staff B', finderPhone: '0754434208', owner: 'John Odero', date: '2024-05-19  2012hrs', status: 'found' },
    {id: 9, type: 'card', number: 'k1245', owner: 'Mike Johnson', placeFound: 'Gym', foundBy: 'Staff C', finderPhone: '0754434208', date: '2024-05-21 1200Hrs', status: 'found' },
    { id: 10, type: 'item', name: 'Ball', description: 'Black leather', placeFound: 'Pool', foundBy: 'Staff B', finderPhone: '0754434208', owner: 'John Odero', date: '2024-05-19  2012hrs', status: 'found' },
   { id: 11, type: 'card', number: 'k1245', owner: 'Mike Johnson', placeFound: 'Gym', foundBy: 'Staff C', finderPhone: '0754434208', date: '2024-05-21 1200Hrs', status: 'found' },
    { id: 12, type: 'item', name: 'Ball', description: 'Black leather', placeFound: 'Pool', foundBy: 'Staff B', finderPhone: '0754434208', owner: 'John Odero', date: '2024-05-19  2012hrs', status: 'found' },
    {id: 13, type: 'card', number: 'k1245', owner: 'Mike Johnson', placeFound: 'Gym', foundBy: 'Staff C', finderPhone: '0754434208', date: '2024-05-21 1200Hrs', status: 'found' },
    { id: 14, type: 'item', name: 'Ball', description: 'Black leather', placeFound: 'Pool', foundBy: 'Staff B', finderPhone: '0754434208', owner: 'John Odero', date: '2024-05-19  2012hrs', status: 'found' },
 
  ]); 

  const [showAddLostModal, setShowAddLostModal] = useState(false);
  const [showAddFoundModal, setShowAddFoundModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [pickedBy, setPickedBy] = useState({ memberId: '', name: '', phone: '' });
  const [showPickupForm, setShowPickupForm] = useState(false);
  

  const [newLostItem, setNewLostItem] = useState({
    type: 'card', number: '', name: '', description: '', placeLost: '', reportedBy: '', reporterPhone: '', owner: ''
  });
  const [newFoundItem, setNewFoundItem] = useState({
    type: 'card', number: '', name: '', description: '', placeFound: '', foundBy: '', finderPhone: '', owner: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('lost');

  const filteredLostItems = lostItems.filter(item => {
    const search = searchTerm.toLowerCase();
    return (
      ((item.type === 'card' && item.number?.toLowerCase()?.includes(search)) ||
      (item.type === 'item' && (
        item.name?.toLowerCase()?.includes(search) ||
        item.description?.toLowerCase()?.includes(search) ||
        item.placeLost?.toLowerCase()?.includes(search)
      ))) ||
      item.owner?.toLowerCase()?.includes(search) ||
      item.reportedBy?.toLowerCase()?.includes(search)
    );
  });

  const filteredFoundItems = foundItems.filter(item => {
    const search = searchTerm.toLowerCase();
    return (
      ((item.type === 'card' && item.number?.toLowerCase()?.includes(search)) ||
      (item.type === 'item' && (
        item.name?.toLowerCase()?.includes(search) ||
        item.description?.toLowerCase()?.includes(search) ||
        item.placeFound?.toLowerCase()?.includes(search)
      ))) ||
      item.owner?.toLowerCase()?.includes(search) ||
      item.foundBy?.toLowerCase()?.includes(search)
    );
  });

  const handleAddLostItem = () => {
    setLostItems([...lostItems, { 
      ...newLostItem, 
      id: Date.now(), 
      date: new Date().toISOString().split('T')[0], 
      status: 'pending' 
    }]);
    setShowAddLostModal(false);
    setNewLostItem({ type: 'card', number: '', name: '', description: '', placeLost: '', reportedBy: '', reporterPhone: '', owner: '' });
  };

  const handleAddFoundItem = () => {
    setFoundItems([...foundItems, { 
      ...newFoundItem, 
      id: Date.now(), 
      date: new Date().toISOString().split('T')[0], 
      status: 'found' 
    }]);
    setShowAddFoundModal(false);
    setNewFoundItem({ type: 'card', number: '', name: '', description: '', placeFound: '', foundBy: '', finderPhone: '', owner: '' });
  };

  const markAsFound = (id) => {
    const item = lostItems.find(item => item.id === id);
    if (item) {
      setLostItems(lostItems.filter(item => item.id !== id));
      setFoundItems([...foundItems, { 
        ...item, 
        placeFound: item.placeLost,
        foundBy: item.reportedBy,
        finderPhone: item.reporterPhone,
        status: 'found'
      }]);
    }
  };

  const handlePick = () => {
    if (selectedItem) {
      alert(`Picked by: ${pickedBy.name} (${pickedBy.memberId})`);
      setShowDetailsModal(false);
      setPickedBy({ memberId: '', name: '', phone: '' });
      setSelectedItem(null);
    }
  };

  return (
    <div className="lost-items-dashboard">
      <LostFoundHeader 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
      />
      <LostFoundStats 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        lostItems={lostItems} 
        foundItems={foundItems} 
        setShowAddLostModal={setShowAddLostModal} 
        setShowAddFoundModal={setShowAddFoundModal} 
      />
      <LostFoundTable 
        activeTab={activeTab} 
        filteredLostItems={filteredLostItems} 
        filteredFoundItems={filteredFoundItems} 
        markAsFound={markAsFound} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        onViewDetails={(item) => {
          setSelectedItem(item);
          setShowDetailsModal(true);
        }}
      />
      <LostFoundModals 
        showAddLostModal={showAddLostModal}
        setShowAddLostModal={setShowAddLostModal}
        showAddFoundModal={showAddFoundModal}
        setShowAddFoundModal={setShowAddFoundModal}
        newLostItem={newLostItem}
        setNewLostItem={setNewLostItem}
        newFoundItem={newFoundItem}
        setNewFoundItem={setNewFoundItem}
        handleAddLostItem={handleAddLostItem}
        handleAddFoundItem={handleAddFoundItem}
      />

{showDetailsModal && selectedItem && (
        <div className="modal-overlay">
          <div className="add-modal">
            {/* Close button (X) in top-right corner */}
            <button 
              className="modal-close-btn"
              onClick={() => {
                setShowDetailsModal(false);
                setShowPickupForm(false);
              }}
            >
              &times;
            </button>
            
            <h3>Item Details</h3>

            <div className="item-details-grid">
              <div className="detail-field"><strong>Type:</strong> {selectedItem.type}</div>
              {selectedItem.type === 'card' ? (
                <div className="detail-field"><strong>Card Number:</strong> {selectedItem.number}</div>
              ) : (
                <>
                  <div className="detail-field"><strong>Item Name:</strong> {selectedItem.name}</div>
                  <div className="detail-field"><strong>Description:</strong> {selectedItem.description}</div>
                </>
              )}
              <div className="detail-field"><strong>Owner:</strong> {selectedItem.owner || 'Unknown'}</div>
              {selectedItem.placeLost && (
                <div className="detail-field"><strong>Place Lost:</strong> {selectedItem.placeLost}</div>
              )}
              {selectedItem.placeFound && (
                <div className="detail-field"><strong>Place Found:</strong> {selectedItem.placeFound}</div>
              )}
              <div className="detail-field"><strong>Reported/Found By:</strong> {selectedItem.reportedBy || selectedItem.foundBy}</div>
              <div className="detail-field"><strong>Contact:</strong> {selectedItem.reporterPhone || selectedItem.finderPhone}</div>
              <div className="detail-field"><strong>Status:</strong> {selectedItem.status}</div>
              <div className="detail-field"><strong>Date:</strong> {selectedItem.date}</div>
            </div>

            {!showPickupForm ? (
              <button 
                className="show-pickup-form-btn"
                onClick={() => setShowPickupForm(true)}
              >
                Initiate Pickup Process
              </button>
            ) : (
              <div className="pickup-form-section">
                <div className="scan-notice">
                  <p>A Members can pick  by  scanning their Membership Card  at the Scanner.</p>
                </div>
                
                <h4>Manual Pick Up Form</h4>
                <input
                  type="text"
                  placeholder="Member No/ Id No "
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
                      setShowPickupForm(false);
                      setPickedBy({ memberId: '', name: '', phone: '' });
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="primary-btn"
                    onClick={handlePick}
                  >
                    Confirm Pickup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LostItemsDashboard;
