import React, { useEffect, useState } from 'react';
import ItemsTable from './ItemsTable';

const FoundItemsTable = ({ items, onViewDetails, markAsPicked }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const columns = [
    { header: '#', width: '5%', key: 'displayNumber' },
    { header: 'Type', width: '10%', key: 'type' },
    { header: 'Item Name', width: '15%', key: 'item_name' },
    { header: 'Owner', width: '15%', key: 'owner_name' },
    { header: 'Place Found', width: '15%', key: 'place_found' },
    { header: 'Phone', width: '15%', key: 'reporter_phone' },
    { header: 'Email', width: '20%', key: 'reporter_email' },
    { header: 'Date Reported', width: '15%', key: 'date_reported' },
    { header: 'Status', width: '10%', key: 'status' },
  ];

  const numberedItems = items.map((item, index) => ({
    ...item,
    displayNumber: index + 1
  }));

  useEffect(() => {
    console.log("📦 Found Items Data:", numberedItems);
  }, [numberedItems]);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    if (onViewDetails) {
      onViewDetails(item);
    }
  };

  return (
    <>
      <ItemsTable
        items={numberedItems}
        columns={columns}
        onViewDetails={handleViewDetails}
        onMarkAsPicked={markAsPicked}
        isFound={true}
        showType="items"
      />
    </>
  );
};

export default FoundItemsTable;