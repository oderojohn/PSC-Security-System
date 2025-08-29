import React from "react";
import ItemsTable from "./ItemsTable";

const LostItemsTable = ({ items, onViewDetails }) => {
  // Lost-specific column headers
  const columns = [
    { header: "#", width: "5%", accessor: "displayNumber" },
    { header: "Type", width: "10%", accessor: "type" },
    { header: "Item Name", width: "15%", accessor: "item_name" },
    { header: "Owner", width: "15%", accessor: "owner_name" },
    { header: "Place Lost", width: "15%", accessor: "place_lost" },
    { header: "Reporter Phone", width: "15%", accessor: "reporter_phone" },
    {
      header: "Photo",
      width: "10%",
      accessor: "photo",
      render: (photo) =>
        photo ? (
          <button
            onClick={() => window.open(photo, "_blank")}
            className="btn btn-sm btn-outline-primary"
          >
            View
          </button>
        ) : (
          "No Photo"
        ),
    },
    { header: "Date Reported", width: "15%", accessor: "date_reported" },
    { header: "Status", width: "10%", accessor: "status" },
  ];

  // Add sequential numbers but keep raw photo string
  const numberedItems = items.map((item, index) => ({
    ...item,
    displayNumber: index + 1,
  }));

  return (
    <ItemsTable
      items={numberedItems}
      columns={columns}
      onViewDetails={onViewDetails}
      isLost={true}
      showType="lost-items"
    />
  );
};

export default LostItemsTable;
