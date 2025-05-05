import React, { useState } from 'react';
import { FiKey, FiUser, FiCheck } from 'react-icons/fi';

const SecurityControlDashboard = () => {
  const [keys, setKeys] = useState([
    { 
      id: 1, 
      keyId: 'MAIN Bar-001', 
      location: 'Main Bar', 
      type: 'Master', 
      status: 'available',
      currentHolder: null,
      checkoutTime: null,
      returnTime: null
    },
    { 
      id: 2, 
      keyId: 'ICT-01', 
      location: 'ICT Office', 
      type: 'Access', 
      status: 'checked-out',
      currentHolder: 'John odero (Staff)',
      checkoutTime: '2024-06-15 09:30',
      returnTime: null
    },
    { 
        id: 3, 
        keyId: 'GM-01', 
        location: 'GM Office', 
        type: 'Access', 
        status: 'checked-out',
        currentHolder: 'John odero (Staff)',
        checkoutTime: '2024-06-15 09:30',
        returnTime: null
      },
      { 
        id: 4, 
        keyId: 'Main Store-01', 
        location: 'Main Store', 
        type: 'Access', 
        status: 'checked-out',
        currentHolder: 'John odero (Staff)',
        checkoutTime: '2024-06-15 09:30',
        returnTime: null
      },
      { 
        id: 5, 
        keyId: 'Kitchen-01', 
        location: 'Kitchen', 
        type: 'Access', 
        status: 'available',
        currentHolder: null,
        checkoutTime: null,
        returnTime: null
      }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [checkoutDetails, setCheckoutDetails] = useState({
    holderName: '',
    holderRole: 'staff',
    checkoutTime: new Date().toISOString().slice(0, 16)
  });

  const handleCheckout = (id) => {
    setKeys(keys.map(key => 
      key.id === id ? { 
        ...key, 
        status: 'checked-out',
        currentHolder: `${checkoutDetails.holderName} (${checkoutDetails.holderRole})`,
        checkoutTime: checkoutDetails.checkoutTime,
        returnTime: null
      } : key
    ));
    setShowCheckoutModal(false);
    setCheckoutDetails({
      holderName: '',
      holderRole: 'staff',
      checkoutTime: new Date().toISOString().slice(0, 16)
    });
  };

  const handleReturn = (id) => {
    setKeys(keys.map(key => 
      key.id === id ? { 
        ...key, 
        status: 'available',
        returnTime: new Date().toISOString().slice(0, 16),
        currentHolder: null
      } : key
    ));
    setShowReturnModal(false);
  };

  const filteredKeys = keys.filter(key =>
    key.keyId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    key.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="lost-items-dashboard">
      <div className="dashboard-header">
        <h2><FiKey size={18} /> Security Key Control</h2>
      </div>

      <div className="search-bar" style={{ marginBottom: '1rem' }}>
        <input 
          type="text" 
          placeholder="Search by Key ID or Location..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '8px', width: '100%', maxWidth: '400px' }}
        />
      </div>

      <div className="table-container">
        <table className="items-table">
          <thead>
            <tr>
              <th>Key ID</th>
              <th>Location</th>
              <th>Type</th>
              <th>Status</th>
              <th>Current Holder</th>
              <th>Checkout Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredKeys.map(key => (
              <tr key={key.id}>
                <td>{key.keyId}</td>
                <td>{key.location}</td>
                <td>{key.type}</td>
                <td>
                  <span className={`status-badge ${key.status}`}>
                    {key.status}
                  </span>
                </td>
                <td>{key.currentHolder || '-'}</td>
                <td>{key.checkoutTime || '-'}</td>
                <td>
                  {key.status === 'available' ? (
                    <button 
                      className="action-button"
                      onClick={() => {
                        setSelectedKey(key);
                        setShowCheckoutModal(true);
                      }}
                    >
                      <FiUser /> Check Out
                    </button>
                  ) : (
                    <button 
                      className="action-button return"
                      onClick={() => {
                        setSelectedKey(key);
                        setShowReturnModal(true);
                      }}
                    >
                      <FiCheck /> Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCheckoutModal && selectedKey && (
        <div className="modal-overlay">
          <div className="add-modal">
            <h3>Check Out Key: {selectedKey.keyId}</h3>
            <div className="item-details">
              <div><strong>Location:</strong> {selectedKey.location}</div>
              <div><strong>Key Type:</strong> {selectedKey.type}</div>
            </div>
            
            <input
              type="text"
              placeholder="Holder's Name"
              value={checkoutDetails.holderName}
              onChange={(e) => setCheckoutDetails({...checkoutDetails, holderName: e.target.value})}
            />
            <select
              value={checkoutDetails.holderRole}
              onChange={(e) => setCheckoutDetails({...checkoutDetails, holderRole: e.target.value})}
            >
              <option value="staff">Staff</option>
              <option value="member">Member</option>
              <option value="contractor">Contractor</option>
              <option value="visitor">Visitor</option>
            </select>
            <input
              type="datetime-local"
              value={checkoutDetails.checkoutTime}
              onChange={(e) => setCheckoutDetails({...checkoutDetails, checkoutTime: e.target.value})}
            />
            
            <div className="modal-actions">
              <button onClick={() => setShowCheckoutModal(false)}>Cancel</button>
              <button 
                className="primary" 
                onClick={() => handleCheckout(selectedKey.id)}
              >
                Confirm Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {showReturnModal && selectedKey && (
        <div className="modal-overlay">
          <div className="add-modal">
            <h3>Return Key: {selectedKey.keyId}</h3>
            <div className="item-details">
              <div><strong>Location:</strong> {selectedKey.location}</div>
              <div><strong>Key Type:</strong> {selectedKey.type}</div>
              <div><strong>Checked Out By:</strong> {selectedKey.currentHolder}</div>
              <div><strong>Checkout Time:</strong> {selectedKey.checkoutTime}</div>
            </div>
            
            <div className="modal-actions">
              <button onClick={() => setShowReturnModal(false)}>Cancel</button>
              <button 
                className="primary" 
                onClick={() => handleReturn(selectedKey.id)}
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityControlDashboard;
