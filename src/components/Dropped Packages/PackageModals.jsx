import React, { useState, useEffect } from 'react';
import { PackageService } from '../../service/api/api';
import "../../assets/css/modals.css";

const PackageModals = ({
  showDropModal,
  setShowDropModal,
  showPickModal,
  setShowPickModal,
  newDroppedPackage,
  setNewDroppedPackage,
  handleDropPackage,
  showDetailsModal,
  setShowDetailsModal,
  selectedPackage,
  setSelectedPackage,
  pickedBy,
  setPickedBy,
  handlePick,
  setError,
  setSuccess,
  refreshData
}) => {
  const [localError, setLocalError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPickForm, setShowPickForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [packageHistory, setPackageHistory] = useState([]);
  const [editFormData, setEditFormData] = useState({});
  const [cachedDescriptions, setCachedDescriptions] = useState([]);
  const [showDescriptionDropdown, setShowDescriptionDropdown] = useState(false);

  // Phone number validation regex
  const phoneOrMemberRegex = /^[0-9]{10,15}$|^[A-Za-z]\d{1,4}[A-Za-z]?$/;
  // Name validation regex (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
  // Description validation (at least 5 characters)
  const descRegex = /^.{5,500}$/;

  // Load cached descriptions from localStorage on component mount
  useEffect(() => {
    const savedDescriptions = localStorage.getItem('cachedDescriptions');
    if (savedDescriptions) {
      setCachedDescriptions(JSON.parse(savedDescriptions));
    }
  }, []);

  // Save to localStorage whenever cache changes
  useEffect(() => {
    localStorage.setItem('cachedDescriptions', JSON.stringify(cachedDescriptions));
  }, [cachedDescriptions]);

  const addToDescriptionCache = (description) => {
    if (!description) return;
    
    setCachedDescriptions(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item !== description);
      // Add to beginning of array
      const updated = [description, ...filtered];
      // Keep only last 10 items
      return updated.slice(0, 10);
    });
  };

  const validateField = (fieldName, value) => {
    const errors = { ...fieldErrors };
    
    switch (fieldName) {
      case 'description':
        if (!value) {
          errors.description = 'Description is required';
        } else if (!descRegex.test(value)) {
          errors.description = 'Description must be 5-500 characters';
        } else {
          delete errors.description;
        }
        break;
        
      case 'recipientName':
      case 'droppedBy':
      case 'name':
        if (!value) {
          errors[fieldName] = 'Name is required';
        } else if (!nameRegex.test(value)) {
          errors[fieldName] = 'Enter a valid name (3-50 characters)';
        } else {
          delete errors[fieldName];
        }
        break;
        
      case 'recipientPhone':
      case 'dropperPhone':
      case 'phone':
        if (!value) {
          errors[fieldName] = 'Phone number or Member ID is required';
        } else if (!phoneOrMemberRegex.test(value)) {
        } else {
          delete errors[fieldName];
        }
        break;
        
      case 'memberId':
        const memberIdRegex = /^(?:[A-Za-z]\d{3,18}[A-Za-z]?|\d{5,20})$/;
        if (!value) {
          errors.memberId = 'ID/Member number is required';
        } else if (!memberIdRegex.test(value)) {
          errors.memberId = 'Enter a valid ID (e.g., M1234, K1234A, or numeric ID)';
        } else {
          delete errors.memberId;
        }
        break;
        
      default:
        break;
    }
    
    setFieldErrors(errors);
    return !errors[fieldName]; // returns true if valid
  };

  const handleDropClick = async () => {
    // Validate all drop package fields
    const isValid = [
      validateField('description', newDroppedPackage.description),
      validateField('recipientName', newDroppedPackage.recipientName),
      validateField('recipientPhone', newDroppedPackage.recipientPhone),
      validateField('droppedBy', newDroppedPackage.droppedBy),
      validateField('dropperPhone', newDroppedPackage.dropperPhone)
    ].every(Boolean);

    if (!isValid) {
      setLocalError('Please fix the errors in the form');
      return;
    }
    
    try {
      setIsLoading(true);
      setLocalError(null);
      await handleDropPackage();
      addToDescriptionCache(newDroppedPackage.description);
      setSuccess('Package dropped successfully!');
      setShowDropModal(false);
      setNewDroppedPackage({
        type: 'package',
        description: '',
        recipientName: '',
        recipientPhone: '',
        droppedBy: '',
        dropperPhone: ''
      });
      setFieldErrors({});
    } catch (err) {
      setLocalError(err.message || 'Error dropping package');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickClick = async () => {
    // Validate all pick package fields
    const isValid = [
      validateField('memberId', pickedBy.memberId),
      validateField('name', pickedBy.name),
      validateField('phone', pickedBy.phone)
    ].every(Boolean);

    if (!isValid) {
      setLocalError('Please fix the errors in the form');
      return;
    }

    try {
      setIsLoading(true);
      setLocalError(null);
      await handlePick();
      setSuccess('Package picked up successfully!');
      setShowDetailsModal(false);
      setPickedBy({ memberId: '', name: '', phone: '' });
      setShowPickForm(false);
      setFieldErrors({});
    } catch (err) {
      setLocalError(err.message || 'Error picking up package');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReprintClick = async () => {
    try {
      setIsLoading(true);
      setLocalError(null);
      const response = await PackageService.reprintPackage(selectedPackage.id);

      // Handle enhanced response with edit information
      let successMessage = 'Package receipt reprinted successfully!';
      if (response.attempts_used && response.max_attempts) {
        successMessage += ` (Attempt ${response.attempts_used}/${response.max_attempts})`;
      }

      if (response.recent_edit) {
        successMessage += `\nRecent edit: ${response.recent_edit}`;
      }

      setSuccess(successMessage);
    } catch (err) {
      setLocalError(err.message || 'Error reprinting receipt');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPickupProcess = () => {
    setShowPickForm(false);
    setPickedBy({ memberId: '', name: '', phone: '' });
    setLocalError(null);
    setFieldErrors({});
  };

  const handleViewHistory = async () => {
    try {
      setIsLoading(true);
      setLocalError(null);
      const history = await PackageService.getPackageHistory(selectedPackage.id);
      setPackageHistory(history);
      setShowHistory(true);
    } catch (err) {
      setLocalError(err.message || 'Error loading package history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPackage = () => {
    // Initialize edit form with current package data
    setEditFormData({
      type: selectedPackage.package_type || selectedPackage.type || 'package',
      description: selectedPackage.description || '',
      recipient_name: selectedPackage.recipient_name || '',
      recipient_phone: selectedPackage.recipient_phone || '',
      dropped_by: selectedPackage.dropped_by || '',
      dropper_phone: selectedPackage.dropper_phone || ''
    });
    setShowEditForm(true);
  };

  const handleSaveEdit = async () => {
    try {
      setIsLoading(true);
      setLocalError(null);
      await PackageService.updatePackage(selectedPackage.id, editFormData);

      // Update the selectedPackage with new data for immediate UI update
      const updatedPackage = {
        ...selectedPackage,
        package_type: editFormData.type,
        type: editFormData.type,
        description: editFormData.description,
        recipient_name: editFormData.recipient_name,
        recipient_phone: editFormData.recipient_phone,
        dropped_by: editFormData.dropped_by,
        dropper_phone: editFormData.dropper_phone,
        last_updated: new Date().toISOString()
      };

      // Update the selected package state to show changes immediately
      if (typeof setSelectedPackage === 'function') {
        setSelectedPackage(updatedPackage);
      }

      setSuccess('Package updated successfully!');
      setShowEditForm(false);
      setEditFormData({});

      // Refresh the package data to show updated information in table
      if (refreshData) {
        await refreshData();
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        if (setSuccess) setSuccess(null);
      }, 3000);
    } catch (err) {
      setLocalError(err.message || 'Error updating package');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, fieldName, formType) => {
  const rawValue = e.target.value;
  const value = fieldName === 'description' ? rawValue : rawValue.toUpperCase();

  if (formType === 'drop') {
    setNewDroppedPackage({ ...newDroppedPackage, [fieldName]: value });
  } else if (formType === 'pick') {
    setPickedBy({ ...pickedBy, [fieldName]: value });
  }

  validateField(fieldName, value);
};



  return (
    <>
      {/* Drop Package Modal */}
      {showDropModal && (
        <div className="modal-overlay">
          <div className="modal-content small-modal">
            <div className="modal-header">
              <h3>Drop New Package</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowDropModal(false);
                  setLocalError(null);
                  setFieldErrors({});
                }}
                disabled={isLoading}
              >
                &times;
              </button>
            </div>
            
            {isLoading && <div className="loading-bar"></div>}
            
            {localError && (
              <div className="modal-error">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{localError}</span>
                <button 
                  className="error-close"
                  onClick={() => setLocalError(null)}
                >
                  &times;
                </button>
              </div>
            )}

            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Package Type</label>
                  <select
                    value={newDroppedPackage.type}
                    onChange={(e) => setNewDroppedPackage({ ...newDroppedPackage, type: e.target.value })}
                    disabled={isLoading}
                  >
                    <option value="package">Package</option>
                    <option value="document">Document</option>
                    <option value="keys">Keys</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <div className="description-input-container">
                    <input
                      type="text"
                      placeholder="e.g., Red box, A4 envelope"
                      value={newDroppedPackage.description}
                      onChange={(e) => {
                        handleInputChange(e, 'description', 'drop');
                        setShowDescriptionDropdown(true);
                      }}
                      onFocus={() => setShowDescriptionDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDescriptionDropdown(false), 200)}
                      disabled={isLoading}
                      className={fieldErrors.description ? 'error' : ''}
                    />
                    {showDescriptionDropdown && cachedDescriptions.length > 0 && (
                      <div className="description-dropdown">
                        {cachedDescriptions.map((desc, index) => (
                          <div 
                            key={index}
                            className="dropdown-item"
                            onClick={() => {
                              setNewDroppedPackage({...newDroppedPackage, description: desc});
                              setShowDescriptionDropdown(false);
                            }}
                          >
                            {desc}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {fieldErrors.description && (
                    <span className="field-error">{fieldErrors.description}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Recipient Name</label>
                  <input
                    type="text"
                    placeholder="Recipient's full name"
                    value={newDroppedPackage.recipientName}
                    onChange={(e) => handleInputChange(e, 'recipientName', 'drop')}
                    disabled={isLoading}
                    className={fieldErrors.recipientName ? 'error' : ''}
                  />
                  {fieldErrors.recipientName && (
                    <span className="field-error">{fieldErrors.recipientName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Recipient Phone/Member NO</label>
                  <input
                    type="tel"
                    placeholder="e.g., 0712345678"
                    value={newDroppedPackage.recipientPhone}
                    onChange={(e) => handleInputChange(e, 'recipientPhone', 'drop')}
                    disabled={isLoading}
                    className={fieldErrors.recipientPhone ? 'error' : ''}
                  />
                  {fieldErrors.recipientPhone && (
                    <span className="field-error">{fieldErrors.recipientPhone}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    placeholder="Who is dropping this?"
                    value={newDroppedPackage.droppedBy}
                    onChange={(e) => handleInputChange(e, 'droppedBy', 'drop')}
                    disabled={isLoading}
                    className={fieldErrors.droppedBy ? 'error' : ''}
                  />
                  {fieldErrors.droppedBy && (
                    <span className="field-error">{fieldErrors.droppedBy}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Your Phone/Member NO</label>
                  <input
                    type="tel"
                    placeholder="e.g., 0712345678"
                    value={newDroppedPackage.dropperPhone}
                    onChange={(e) => handleInputChange(e, 'dropperPhone', 'drop')}
                    disabled={isLoading}
                    className={fieldErrors.dropperPhone ? 'error' : ''}
                  />
                  {fieldErrors.dropperPhone && (
                    <span className="field-error">{fieldErrors.dropperPhone}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowDropModal(false);
                  setLocalError(null);
                  setFieldErrors({});
                }}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleDropClick}
                disabled={isLoading || Object.keys(fieldErrors).length > 0}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : 'Submit Package'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Package Details Modal */}
      {showDetailsModal && selectedPackage && (
        <div className="modal-overlay">
          <div className={`modal-content ${showPickForm ? 'small-modal' : 'medium-modal'}`}>
            <div className="modal-header">
              <h3>{showPickForm ? 'Verify Pickup' : 'Package Details'}</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowDetailsModal(false);
                  resetPickupProcess();
                }}
                disabled={isLoading}
              >
                &times;
              </button>
            </div>
            
            {isLoading && <div className="loading-bar"></div>}
            
            {localError && (
              <div className="modal-error">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{localError}</span>
                <button 
                  className="error-close"
                  onClick={() => setLocalError(null)}
                >
                  &times;
                </button>
              </div>
            )}

            {!showPickForm ? (
              <>
                <div className="modal-body" style={{ padding: '15px' }}>
                  <div className="details-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    fontSize: '0.85rem'
                  }}>
                    <div className="detail-item" style={{ display: 'flex', gap: '5px' }}>
                      <span className="detail-label" style={{ fontWeight: '600' }}>Code:</span>
                      <span className="detail-value code">{selectedPackage.code}</span>
                    </div>
                    <div className="detail-item" style={{ display: 'flex', gap: '5px' }}>
                      <span className="detail-label" style={{ fontWeight: '600' }}>Type:</span>
                      <span className="detail-value">{selectedPackage.package_type || selectedPackage.type}</span>
                    </div>

                    <div className="detail-item" style={{ display: 'flex', gap: '5px' }}>
                      <span className="detail-label" style={{ fontWeight: '600' }}>Shelf:</span>
                      <span className="detail-value shelf-number">{selectedPackage.shelf}</span>
                    </div>
                    <div className="detail-item" style={{ display: 'flex', gap: '5px' }}>
                      <span className="detail-label" style={{ fontWeight: '600' }}>Status:</span>
                      <span className={`detail-value status-${selectedPackage.status}`}>
                        {selectedPackage.status}
                      </span>
                    </div>

                    <div className="detail-item" style={{ display: 'flex', gap: '5px' }}>
                      <span className="detail-label" style={{ fontWeight: '600' }}>Recipient:</span>
                      <span className="detail-value">{selectedPackage.recipient_name}</span>
                    </div>
                    <div className="detail-item" style={{ display: 'flex', gap: '5px' }}>
                      <span className="detail-label" style={{ fontWeight: '600' }}>Recipient No:</span>
                      <span className="detail-value">{selectedPackage.recipient_phone}</span>
                    </div>

                    <div className="detail-item" style={{ display: 'flex', gap: '5px' }}>
                      <span className="detail-label" style={{ fontWeight: '600' }}>Dropped By:</span>
                      <span className="detail-value">{selectedPackage.dropped_by}</span>
                    </div>
                    <div className="detail-item" style={{ display: 'flex', gap: '5px' }}>
                      <span className="detail-label" style={{ fontWeight: '600' }}>Dropper Phone:</span>
                      <span className="detail-value">{selectedPackage.dropper_phone}</span>
                    </div>

                    {selectedPackage.picked_by && (
                      <div className="detail-item" style={{ display: 'flex', gap: '5px' }}>
                        <span className="detail-label" style={{ fontWeight: '600' }}>Picked By:</span>
                        <span className="detail-value">{selectedPackage.picked_by}</span>
                      </div>
                    )}
                    {selectedPackage.picker_phone && (
                      <div className="detail-item" style={{ display: 'flex', gap: '5px' }}>
                        <span className="detail-label" style={{ fontWeight: '600' }}>Picker Phone:</span>
                        <span className="detail-value">{selectedPackage.picker_phone}</span>
                      </div>
                    )}
                    {selectedPackage.picker_id && (
                      <div className="detail-item" style={{ display: 'flex', gap: '5px' }}>
                        <span className="detail-label" style={{ fontWeight: '600' }}>Picker ID:</span>
                        <span className="detail-value">{selectedPackage.picker_id}</span>
                      </div>
                    )}

                    <div className="detail-item" style={{ display: 'flex', gap: '5px' }}>
                      <span className="detail-label" style={{ fontWeight: '600' }}>Date Dropped:</span>
                      <span className="detail-value">{new Date(selectedPackage.created_at).toLocaleString()}</span>
                    </div>
                    {selectedPackage.picked_at && (
                      <div className="detail-item" style={{ display: 'flex', gap: '5px' }}>
                        <span className="detail-label" style={{ fontWeight: '600' }}>Date Picked:</span>
                        <span className="detail-value">{new Date(selectedPackage.picked_at).toLocaleString()}</span>
                      </div>
                    )}

                    <div className="detail-item" style={{ gridColumn: '1 / span 2', display: 'flex', gap: '5px' }}>
                      <span className="detail-label" style={{ fontWeight: '600' }}>Description:</span>
                      <span className="detail-value">{selectedPackage.description}</span>
                    </div>
                  </div>
                </div>

                {selectedPackage.status === 'pending' && (
                  <div className="modal-footer">
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowPickForm(true)}
                    >
                      Initiate Pickup
                    </button>
                  </div>
                )}

                {/* Action buttons for all packages */}
                <div className="modal-footer">
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleEditPackage}
                    disabled={isLoading}
                  >
                    Edit Package
                  </button>
                  <button
                    className="btn btn-outline-info"
                    onClick={handleViewHistory}
                    disabled={isLoading}
                  >
                    View History
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleReprintClick}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Reprinting...' : 'Reprint Receipt'}
                  </button>
                </div>
              </>
            ) : (
              <div className="modal-body">
                <div className="pickup-instructions">
                  <p>Please provide your details to verify this pickup:</p>
                </div>
                
                <div className="form-group">
                  <label>Member ID/ID Number</label>
                  <input
                    type="text"
                    placeholder="Your identification number"
                    value={pickedBy.memberId}
                    onChange={(e) => handleInputChange(e, 'memberId', 'pick')}
                    disabled={isLoading}
                    className={fieldErrors.memberId ? 'error' : ''}
                  />
                  {fieldErrors.memberId && (
                    <span className="field-error">{fieldErrors.memberId}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Your full name as per ID"
                    value={pickedBy.name}
                    onChange={(e) => handleInputChange(e, 'name', 'pick')}
                    disabled={isLoading}
                    className={fieldErrors.name ? 'error' : ''}
                  />
                  {fieldErrors.name && (
                    <span className="field-error">{fieldErrors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Phone Number/Member No</label>
                  <input
                    type="tel"
                    placeholder="Your active phone number"
                    value={pickedBy.phone}
                    onChange={(e) => handleInputChange(e, 'phone', 'pick')}
                    disabled={isLoading}
                    className={fieldErrors.phone ? 'error' : ''}
                  />
                  {fieldErrors.phone && (
                    <span className="field-error">{fieldErrors.phone}</span>
                  )}
                </div>

                <div className="modal-footer">
                  <button 
                    className="btn btn-secondary"
                    onClick={resetPickupProcess}
                    disabled={isLoading}
                  >
                    Back to Details
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={handlePickClick}
                    disabled={isLoading || Object.keys(fieldErrors).length > 0}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner"></span>
                        Verifying...
                      </>
                    ) : 'Complete Pickup'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Package History Modal */}
      {showHistory && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h3>Package History - {selectedPackage.code}</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowHistory(false);
                  setPackageHistory([]);
                }}
                disabled={isLoading}
              >
                &times;
              </button>
            </div>

            {isLoading && <div className="loading-bar"></div>}

            {localError && (
              <div className="modal-error">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{localError}</span>
                <button
                  className="error-close"
                  onClick={() => setLocalError(null)}
                >
                  &times;
                </button>
              </div>
            )}

            <div className="modal-body">
              {packageHistory.length > 0 ? (
                <div className="history-timeline" style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  padding: '10px'
                }}>
                  {packageHistory.map((entry, index) => (
                    <div key={index} className="history-entry" style={{
                      borderLeft: '3px solid #007bff',
                      padding: '10px 15px',
                      marginBottom: '15px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      position: 'relative'
                    }}>
                      <div className="history-timestamp" style={{
                        fontSize: '0.85rem',
                        color: '#6c757d',
                        marginBottom: '5px'
                      }}>
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                      <div className="history-action" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '5px'
                      }}>
                        <span className="history-user" style={{
                          fontWeight: '600',
                          color: '#007bff'
                        }}>{entry.user}</span>
                        <span className="history-description">{entry.action}</span>
                      </div>
                      {entry.details && (
                        <div className="history-details" style={{
                          fontSize: '0.9rem',
                          color: '#495057',
                          backgroundColor: '#e9ecef',
                          padding: '8px',
                          borderRadius: '3px',
                          marginTop: '5px'
                        }}>
                          {entry.details}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-history" style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#6c757d'
                }}>
                  <p>No history available for this package.</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowHistory(false);
                  setPackageHistory([]);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Package Modal */}
      {showEditForm && (
        <div className="modal-overlay">
          <div className="modal-content medium-modal">
            <div className="modal-header">
              <h3>Edit Package - {selectedPackage.code}</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowEditForm(false);
                  setEditFormData({});
                }}
                disabled={isLoading}
              >
                &times;
              </button>
            </div>

            {isLoading && <div className="loading-bar"></div>}

            {localError && (
              <div className="modal-error">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{localError}</span>
                <button
                  className="error-close"
                  onClick={() => setLocalError(null)}
                >
                  &times;
                </button>
              </div>
            )}

            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Package Type</label>
                  <select
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                    disabled={isLoading}
                  >
                    <option value="package">Package</option>
                    <option value="document">Document</option>
                    <option value="keys">Keys</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Recipient Name</label>
                  <input
                    type="text"
                    value={editFormData.recipient_name}
                    onChange={(e) => setEditFormData({ ...editFormData, recipient_name: e.target.value })}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label>Recipient Phone</label>
                  <input
                    type="tel"
                    value={editFormData.recipient_phone}
                    onChange={(e) => setEditFormData({ ...editFormData, recipient_phone: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Dropped By</label>
                  <input
                    type="text"
                    value={editFormData.dropped_by}
                    onChange={(e) => setEditFormData({ ...editFormData, dropped_by: e.target.value })}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label>Dropper Phone</label>
                  <input
                    type="tel"
                    value={editFormData.dropper_phone}
                    onChange={(e) => setEditFormData({ ...editFormData, dropper_phone: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowEditForm(false);
                  setEditFormData({});
                }}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveEdit}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PackageModals;