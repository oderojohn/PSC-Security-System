import React, { useState } from 'react';
import { FiEye, FiCheck, FiX } from 'react-icons/fi';

const ItemsTable = ({ items, columns, onViewDetails, isLost, isFound, onMarkAsPicked, showType = 'all' }) => {
  const [selectedItem, setSelectedItem] = useState(null);

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
  // Example filtering
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

  // Define dynamic columns based on showType
  const cardColumns = [
    { header: 'Type', key: 'type' },
    { header: 'Card Details', key: 'card_last_four' },
    { header: 'Email', key: 'reporter_email' },
    { header: 'Date Reported', key: 'date_reported' },
    { header: 'Status', key: 'status' }
  ];

  const activeColumns = showType === 'cards' ? cardColumns : columns;

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
                  onRowClick={setSelectedItem} // pass modal opener
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

      {/* Modal */}
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
                  <p><strong>Email:</strong> {safeText(selectedItem.reporter_email, 'No email')}</p>
                  <p><strong>Date Reported:</strong> {selectedItem.date_reported ? new Date(selectedItem.date_reported).toLocaleString() : 'N/A'}</p>
                  <p><strong>Status:</strong> {selectedItem.status || 'pending'}</p>
                </>
              ) : (
                <>
                  <p><strong>Type:</strong> 🧳 Item</p>
                  <p><strong>Name:</strong> {safeText(selectedItem.item_name, 'Unnamed')}</p>
                  <p><strong>Owner:</strong> {safeText(selectedItem.owner_name, 'Unknown')}</p>
                  <p><strong>Place Lost:</strong> {safeText(selectedItem.place_lost, 'Unknown')}</p>
                  <p><strong>Phone:</strong> {safeText(selectedItem.reporter_phone, 'No phone')}</p>
                  <p><strong>Email:</strong> {safeText(selectedItem.reporter_email, 'No email')}</p>
                  <p><strong>Date Reported:</strong> {selectedItem.date_reported ? new Date(selectedItem.date_reported).toLocaleString() : 'N/A'}</p>
                  <p><strong>Status:</strong> {selectedItem.status || 'pending'}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TableRow = ({ item, isFound, onViewDetails, onMarkAsPicked, safeText, showType }) => {
  return (
    <tr
      onClick={() => onViewDetails(item)} // 🔥 Row click opens modal
      style={{ cursor: 'pointer' }}
    >
      {showType === 'cards' ? (
        <>
          <td>💳 Card</td>
          <td>{safeText(item.card_last_four)}</td>
          <td>{safeText(item.reporter_email, 'No email')}</td>
          <td>{item.date_reported ? new Date(item.date_reported).toLocaleString() : 'N/A'}</td>
          <td>
            <span className={`status-badge ${item.status || 'pending'}`}>
              {item.status || 'pending'}
            </span>
          </td>
        </>
      ) : (
        <>
          <td>{item.displayNumber || 'N/A'}</td>
          <td>{item.type === 'item' ? '💳 Card' : '🧳 Item'}</td>
          <td>
            {item.type === 'item'
              ? safeText(item.card_last_four)
              : safeText(item.item_name, 'Unnamed')}
          </td>
          <td>{safeText(item.owner_name, 'Unknown')}</td>
          <td>{safeText(item.place_lost, 'Unknown')}</td>
          <td>{safeText(item.reporter_phone, 'No phone')}</td>
          <td>{safeText(item.reporter_email, 'No email')}</td>
          <td>{item.date_reported ? new Date(item.date_reported).toLocaleString() : 'N/A'}</td>
          <td>
            <span className={`status-badge ${item.status || 'pending'}`}>
              {item.status || 'pending'}
            </span>
          </td>
        </>
      )}
      <td>
        <button
          className="btn btn-sm btn-info"
          onClick={(e) => {
            e.stopPropagation(); // prevent row click
            onViewDetails(item); // same modal
          }}
        >
          <FiEye /> View
        </button>

        {isFound && item.status === 'found' && (
          <button
            className="btn btn-sm btn-success"
            onClick={(e) => {
              e.stopPropagation(); // prevent row click
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
