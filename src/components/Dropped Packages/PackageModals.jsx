import React, { useState } from 'react';
import "../../assets/css/modals.css"

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
  pickedBy,
  setPickedBy,
  handlePick,
  setError,
  setSuccess
}) => {
  const [localError, setLocalError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPickForm, setShowPickForm] = useState(false);

  // Phone number validation regex
  const phoneRegex = /^[0-9]{10,15}$/;
  // Name validation regex (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
  // Description validation (at least 5 characters)
  const descRegex = /^.{5,500}$/;

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
          errors[fieldName] = 'Phone number is required';
        } else if (!phoneRegex.test(value)) {
          errors[fieldName] = 'Enter a valid phone number (10-15 digits)';
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

  const resetPickupProcess = () => {
    setShowPickForm(false);
    setPickedBy({ memberId: '', name: '', phone: '' });
    setLocalError(null);
    setFieldErrors({});
  };

  const handleInputChange = (e, fieldName, formType) => {
    if (formType === 'drop') {
      setNewDroppedPackage({ ...newDroppedPackage, [fieldName]: e.target.value });
    } else if (formType === 'pick') {
      setPickedBy({ ...pickedBy, [fieldName]: e.target.value });
    }
    
    // Validate the field as user types
    validateField(fieldName, e.target.value);
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
                  <input
                    type="text"
                    placeholder="e.g., Red box, A4 envelope"
                    value={newDroppedPackage.description}
                    onChange={(e) => handleInputChange(e, 'description', 'drop')}
                    disabled={isLoading}
                    className={fieldErrors.description ? 'error' : ''}
                  />
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
                  <label>Recipient Phone</label>
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
                  <label>Your Phone</label>
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
                <div className="modal-body">
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Code:</span>
                      <span className="detail-value code">{selectedPackage.code}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Type:</span>
                      <span className="detail-value">{selectedPackage.type === 'document' ? 'Document' : 'Package'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Description:</span>
                      <span className="detail-value">{selectedPackage.description}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Shelf Number:</span>
                      <span className="detail-value shelf-number">
                        {selectedPackage.shelf}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Recipient:</span>
                      <span className="detail-value">{selectedPackage.recipient_name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Recipient Phone:</span>
                      <span className="detail-value">{selectedPackage.recipient_phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Dropped By:</span>
                      <span className="detail-value">{selectedPackage.dropped_by}</span>
                    </div>
                    {selectedPackage.picked_by && (
                      <div className="detail-item">
                        <span className="detail-label">Picked By:</span>
                        <span className="detail-value">{selectedPackage.picked_by}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className={`detail-value status-${selectedPackage.status}`}>
                        {selectedPackage.status}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Date Dropped:</span>
                      <span className="detail-value">{new Date(selectedPackage.created_at).toLocaleString()}</span>
                    </div>
                    {selectedPackage.picked_at && (
                      <div className="detail-item">
                        <span className="detail-label">Date Picked:</span>
                        <span className="detail-value">{new Date(selectedPackage.picked_at).toLocaleString()}</span>
                      </div>
                    )}
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
                  <label>Phone Number</label>
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
    </>
  );
};

export default PackageModals;