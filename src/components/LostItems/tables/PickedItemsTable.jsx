import React from 'react';
import ItemsTable from './ItemsTable';

const PickedItemsTable = ({ items, onViewDetails }) => {
  const columns = [
    { header: 'Type', width: '10%' },
    { header: 'Details', width: '25%' },
    { header: 'Owner', width: '15%' },
    { header: 'Location', width: '15%' },
    { header: 'Contact', width: '15%' },
    { header: 'Phone', width: '10%' },
    { header: 'Date Reported', width: '15%' },
    { header: 'Status', width: '10%' }
  ];

  // Filter only picked items
  const pickedItems = items.filter(item => item.status === 'picked');

  return (
    <ItemsTable
      items={pickedItems}
      columns={columns}
      onViewDetails={onViewDetails}
    />
  );
};

export default PickedItemsTable;