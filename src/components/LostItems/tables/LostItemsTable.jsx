import React, { useEffect, useState } from 'react';
import ItemsTable from './ItemsTable';
const LostItemsTable = ({ items, onViewDetails }) => {
  const [selectedItem, setSelectedItem] = useState(null);

const columns = [
  { header: '#', width: '5%' },
  { header: 'Type', width: '10%' },
  { header: 'Item Name', width: '15%' },
  { header: 'Owner', width: '15%' },
  { header: 'Place Lost', width: '15%' },
  { header: 'Phone', width: '15%' },
  { header: 'Email', width: '20%' },
  { header: 'Date Reported', width: '15%' },
  { header: 'Status', width: '10%' },
]

  const numberedItems = items.map((item, index) => ({
    ...item,
    displayNumber: index + 1
  }));

  useEffect(() => {
    console.log("📦 Lost Items Data:", numberedItems);
  }, [numberedItems]);

  return (
    <>
      <ItemsTable
        items={numberedItems}
        columns={columns}
        onViewDetails={setSelectedItem} // 👈 open details on row click
        isLost={true}
        showType="items"
      />

      {/* {selectedItem && (
       // <ItemDetailsModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )} */}
    </>
  );
};

export default LostItemsTable;
