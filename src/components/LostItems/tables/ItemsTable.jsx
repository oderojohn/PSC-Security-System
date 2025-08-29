import React, { useState } from 'react';
import { FiEye, FiCheck, FiX } from 'react-icons/fi';
import "../ok.css";

const ItemsTable = ({ items, columns, onViewDetails, isLost, isFound, onMarkAsPicked, showType = 'all' }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const safeText = (val, fallback = 'N/A') => {
    if (val === null || val === undefined) return fallback;
    return typeof val === 'string' ? val :
           typeof val === 'object' ? JSON.stringify(val) :
           String(val);
  };

  const sortItemsByDate = (items) => {
    if (!items || !Array.isArray(items)) return [];
    return [...items].sort((a, b) => {
      const dateA = a.date_reported ? new Date(a.date_reported).getTime() : 0;
      const dateB = b.date_reported ? new Date(b.date_reported).getTime() : 0;
      return dateB - dateA;
    });
  };

  // Filter items based on showType prop
  const filteredItems = items.filter(item => {
    if (showType === 'all') return true;

    if (showType === 'cards') return item.type === 'card'; // all cards
    if (showType === 'items') return item.type !== 'card'; // all non-cards

    if (showType === 'found-cards') return item.type === 'card' && item.status === 'found';
    if (showType === 'found-items') return item.type !== 'card' && item.status === 'found';

    if (showType === 'lost-cards') return item.type === 'card' && item.status !== 'found';
    if (showType === 'lost-items') return item.type !== 'card' && item.status !== 'found';

    return true;
  });

  const sortedItems = sortItemsByDate(filteredItems);

  // Define dynamic columns based on type
  const cardColumns = [
    { header: 'Type', key: 'type' },
    { header: 'Card Details', key: 'card_last_four' },
    { header: 'Reporter Email', key: 'reporter_email' },
    { header: 'Date Reported', key: 'date_reported' },
    { header: 'Status', key: 'status' }
  ];

  const activeColumns = showType === 'cards' ? cardColumns : columns;

  // Function to open image modal
  const openImageModal = (imageUrl, e) => {
    e.stopPropagation();
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  return (
    <div>
      <div className="table-container" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="items-table">
          <thead>
            <tr>
              {activeColumns.map((col, index) => (
                <th key={index}>{col.header}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.length > 0 ? (
              sortedItems.map(item => (
                <TableRow
                  key={item.id}
                  item={item}
                  isLost={isLost}
                  isFound={isFound}
                  onViewDetails={onViewDetails}
                  onMarkAsPicked={onMarkAsPicked}
                  safeText={safeText}
                  showType={showType}
                  onRowClick={setSelectedItem}
                  onViewImage={openImageModal}
                />
              ))
            ) : (
              <tr>
                <td colSpan={activeColumns.length + 1} className="no-data-message">
                  {showType === 'cards' ? 'No cards found' : 
                   showType === 'items' ? 'No items found' : 
                   'No items found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Item Details Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedItem(null)}>
              <FiX />
            </button>
            <h2>Item Details</h2>
            <div className="modal-body">
              {selectedItem.type === 'card' ? (
                <>
                  <p><strong>Type:</strong> 💳 Card</p>
                  <p><strong>Card Details:</strong> {safeText(selectedItem.card_last_four)}</p>
                  <p><strong>Email:</strong> {safeText(selectedItem.reporter_email || selectedItem.finder_email, 'No email')}</p>
                  <p><strong>Date Reported:</strong> {selectedItem.date_reported ? new Date(selectedItem.date_reported).toLocaleString() : 'N/A'}</p>
                  <p><strong>Status:</strong> {selectedItem.status || 'pending'}</p>
                </>
              ) : (
                <>
                  <p><strong>Type:</strong> 🧳 Item</p>
                  <p><strong>Name:</strong> {safeText(selectedItem.item_name, 'Unnamed')}</p>
                  <p><strong>Owner:</strong> {safeText(selectedItem.owner_name, 'Unknown')}</p>
                  <p><strong>Place:</strong> 
                    {safeText(selectedItem.place_lost || selectedItem.place_found, 'Unknown')}
                  </p>
                  <p><strong>Phone:</strong> {safeText(selectedItem.reporter_phone || selectedItem.finder_phone, 'No phone')}</p>
                  <p><strong>Email:</strong> {safeText(selectedItem.reporter_email || selectedItem.finder_email, 'No email')}</p>
                  <p><strong>Date Reported:</strong> {selectedItem.date_reported ? new Date(selectedItem.date_reported).toLocaleString() : 'N/A'}</p>
                  <p><strong>Status:</strong> {selectedItem.status || 'pending'}</p>
                  
                  {/* Show photo in details modal if available */}
                  {selectedItem.photo && (
                    <div className="photo-container">
                      <p><strong>Photo:</strong></p>
                      <img 
                        src={selectedItem.photo} 
                        alt="Item" 
                        className="item-photo"
                        onClick={(e) => openImageModal(selectedItem.photo, e)}
                        style={{ cursor: 'pointer', maxWidth: '200px', maxHeight: '200px' }}
                      />
                      <p className="photo-hint">Click to view larger</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="modal-content image-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowImageModal(false)}>
              <FiX />
            </button>
            <h2>Item Photo</h2>
            <div className="modal-body">
              <img 
                src={selectedImage} 
                alt="Item" 
                className="enlarged-photo"
                style={{ maxWidth: '100%', maxHeight: '80vh' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TableRow = ({ item, isFound, onViewDetails, onMarkAsPicked, safeText, showType, onViewImage }) => {
  return (
    <tr
      onClick={() => onViewDetails(item)}
      style={{ cursor: 'pointer' }}
    >
      {showType === 'cards' ? (
        <>
          <td>💳 Card</td>
          <td>{safeText(item.card_last_four)}</td>
          <td>{safeText(item.reporter_email || item.finder_email, 'No email')}</td>
          <td>{item.date_reported ? new Date(item.date_reported).toLocaleString() : 'N/A'}</td>
          <td>
            <span className={`status-badge ${item.status || 'found'}`}>
              {item.status || 'found'}
            </span>
          </td>
        </>
      ) : (
        <>
          <td>{item.displayNumber || 'N/A'}</td>
          <td>{item.type === 'card' ? '💳 Card' : '🧳 Item'}</td>
          <td>{safeText(item.item_name || item.card_last_four, 'Unnamed')}</td>
          <td>{safeText(item.owner_name, 'Unknown')}</td>
          <td>{safeText(item.place_lost || item.place_found, 'Unknown')}</td>
          <td>{safeText(item.reporter_phone || item.finder_phone, 'No phone')}</td>

          {/* ✅ Updated: Show button to view image in modal */}
          <td>
            {item.photo ? (
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={(e) => onViewImage(item.photo, e)}
              >
                View Photo
              </button>
            ) : (
              "No photo"
            )}
          </td>

          <td>{item.date_reported ? new Date(item.date_reported).toLocaleString() : 'N/A'}</td>
          <td>
            <span className={`status-badge ${item.status || 'found'}`}>
              {item.status || 'found'}
            </span>
          </td>
        </>
      )}

      <td>
        <button
          className="btn btn-sm btn-info"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(item);
          }}
        >
          <FiEye /> View
        </button>

        {isFound && item.status === 'found' && (
          <button
            className="btn btn-sm btn-success"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsPicked(item.id);
            }}
          >
            <FiCheck /> Picked
          </button>
        )}
      </td>
    </tr>
  );
};

export default ItemsTable;