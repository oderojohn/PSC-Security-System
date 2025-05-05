import React from 'react';

const PackageTable = ({
  activeTab,
  filteredDroppedPackages,
  filteredPickedPackages,
  searchTerm,
  setSearchTerm,
  onViewDetails
}) => {
  const renderNoDataMessage = () => (
    <div className="no-data-message">
      <div className="sad-emoji">📦</div>
      <h3>No packages found</h3>
      <p>We couldn't find any {activeTab === 'drop' ? 'dropped' : 'picked'} packages matching your search.</p>
      {searchTerm && (
        <button className="clear-search" onClick={() => setSearchTerm('')}>
          Clear search
        </button>
      )}
    </div>
  );

  const renderRow = (pkg, isDropped = false) => {
    return (
      <tr key={pkg.id} onClick={() => onViewDetails(pkg)} className="clickable-row">
        <td>{pkg.type === 'document' ? '📄 Document' : '📦 Package'}</td>
        <td>{pkg.description}</td>
        <td>{pkg.recipientName}</td>
        <td>{pkg.recipientPhone}</td>
        <td>{isDropped ? pkg.droppedBy : pkg.pickedBy}</td>
        <td>{pkg.date}</td>
        <td><span className={`status-badge ${pkg.status}`}>{pkg.status}</span></td>
        {/* <td>
          {isDropped && pkg.status === 'pending' ? (
            <button
              className="found-button"
              onClick={(e) => {
                e.stopPropagation();
                markAsPicked(pkg.id);
                onViewDetails(pkg);
              }}
            >
              <FiCheck /> Mark Picked
            </button>
          ) : (
            <button
              className="view-button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(pkg);
              }}
            >
              <FiEye /> Details
            </button>
          )}
        </td> */}
      </tr>
    );
  };

  const data = activeTab === 'drop' ? filteredDroppedPackages : filteredPickedPackages;

  if (!data.length) return renderNoDataMessage();

  return (
    <div className="table-container">
      <table className="items-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Description</th>
            <th>Recipient Name</th>
            <th>Recipient Phone</th>
            <th>{activeTab === 'drop' ? 'Dropped By' : 'Picked By'}</th>
            <th>Date & Time</th>
            <th>Status</th>
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {data.map(pkg => renderRow(pkg, activeTab === 'drop'))}
        </tbody>
      </table>
    </div>
  );
};

export default PackageTable;