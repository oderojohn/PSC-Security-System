import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LostFoundService } from '../../service/api/api';
import { FiLink, FiAlertCircle } from 'react-icons/fi';
import "../../assets/css/LostFoundForm.css"

export const ReportLostForm = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    type: 'card',
    card_last_four: '',
    item_name: '',
    description: '',
    place_lost: '',
    reporter_member_id: '',
    reporter_phone: '',
    owner_name: ''
  });
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (
    formData.type === 'card' &&
    !/^[A-Z]\d{4}[A-Z]?$/.test(formData.card_last_four)
    ) {
    newErrors.card_last_four =
        'Format must start with a letter, followed by 4 digits, and optionally end with a letter (e.g., K1234 or K1234A)';
    }

    
    if (formData.type === 'item' && !formData.item_name.trim()) {
      newErrors.item_name = 'Item name is required';
    }
    
    if (!formData.place_lost.trim()) {
      newErrors.place_lost = 'Location is required';
    }
    
    if (!formData.reporter_member_id.trim()) {
      newErrors.reporter_member_id = 'Member ID is required';
    }
    
    if (!/^\d{10,15}$/.test(formData.reporter_phone)) {
      newErrors.reporter_phone = 'Valid phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const createdItem = await LostFoundService.createLostItem({
        ...formData,
        status: 'pending'
      });
      onSubmit && onSubmit(createdItem);
      navigate('/lost-found');
    } catch (error) {
      console.error('Error creating lost item:', error);
      setErrors({
        ...errors,
        form: 'Failed to submit form. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lost-items-dashboard">
    <div className="lf-form-container">
      <div className="lf-form-header">
        <h2>
          <FiLink className="lf-icon" /> 
          Report Lost Item
        </h2>
        <p className="lf-form-description">
          Please provide details about the item you lost. This will help us identify and return it to you.
        </p>
      </div>
      
      {errors.form && (
        <div className="lf-error-message">
          <FiAlertCircle className="lf-error-icon" />
          {errors.form}
        </div>
      )}
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="lf-form-group">
          <label>Item Type</label>
          <select
            className={`lf-form-control ${errors.type ? 'is-invalid' : ''}`}
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="card">Card</option>
            <option value="item">Item</option>
          </select>
        </div>

        {formData.type === 'card' ? (
          <div className="lf-form-group">
        <label>Member No</label>
        <input
            className={`lf-form-control ${errors.card_last_four ? 'is-invalid' : ''}`}
            type="text"
            placeholder="e.g., K1234 or K1234A"
            maxLength="6"
            value={formData.card_last_four}
            onChange={(e) => {
            const input = e.target.value.toUpperCase();
            const valid = /^[A-Z]\d{0,4}[A-Z]?$/.test(input); // Valid progressive typing
            if (valid || input === '') {
                setFormData({ ...formData, card_last_four: input });
            }
            }}
            required
        />
        {errors.card_last_four && (
            <div className="lf-error-feedback">
            <FiAlertCircle className="lf-error-icon" />
            {errors.card_last_four}
            </div>
        )}
        </div>

        ) : (
          <>
            <div className="lf-form-group">
              <label>Item Name</label>
              <input
                className={`lf-form-control ${errors.item_name ? 'is-invalid' : ''}`}
                type="text"
                placeholder="e.g., AirPods"
                value={formData.item_name}
                onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                required
              />
              {errors.item_name && (
                <div className="lf-error-feedback">
                  <FiAlertCircle className="lf-error-icon" />
                  {errors.item_name}
                </div>
              )}
            </div>
            <div className="lf-form-group">
              <label>Description</label>
              <textarea
                className={`lf-form-control ${errors.description ? 'is-invalid' : ''}`}
                placeholder="Describe the item (color, brand, distinguishing features)"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              {errors.description && (
                <div className="lf-error-feedback">
                  <FiAlertCircle className="lf-error-icon" />
                  {errors.description}
                </div>
              )}
            </div>
          </>
        )}

        <div className="lf-form-group">
          <label>Owner Name (if known)</label>
          <input
            className="lf-form-control"
            type="text"
            placeholder="Owner's name"
            value={formData.owner_name}
            onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
          />
        </div>

        <div className="lf-form-group">
          <label>Place Lost</label>
          <input
            className={`lf-form-control ${errors.place_lost ? 'is-invalid' : ''}`}
            type="text"
            placeholder="Where was it lost? Be specific (e.g., 'Main lobby near reception')"
            value={formData.place_lost}
            onChange={(e) => setFormData({ ...formData, place_lost: e.target.value })}
            required
          />
          {errors.place_lost && (
            <div className="lf-error-feedback">
              <FiAlertCircle className="lf-error-icon" />
              {errors.place_lost}
            </div>
          )}
        </div>

        <div className="lf-form-group">
          <label>Your Member Number</label>
          <input
            className={`lf-form-control ${errors.reporter_member_id ? 'is-invalid' : ''}`}
            type="text"
            placeholder="Your member ID"
            value={formData.reporter_member_id}
            onChange={(e) => setFormData({ ...formData, reporter_member_id: e.target.value })}
            required
          />
          {errors.reporter_member_id && (
            <div className="lf-error-feedback">
              <FiAlertCircle className="lf-error-icon" />
              {errors.reporter_member_id}
            </div>
          )}
        </div>

        <div className="lf-form-group">
          <label>Your Phone Number</label>
          <input
            className={`lf-form-control ${errors.reporter_phone ? 'is-invalid' : ''}`}
            type="tel"
            placeholder="Your contact number (10-15 digits)"
            value={formData.reporter_phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setFormData({ ...formData, reporter_phone: value });
            }}
            required
          />
          {errors.reporter_phone && (
            <div className="lf-error-feedback">
              <FiAlertCircle className="lf-error-icon" />
              {errors.reporter_phone}
            </div>
          )}
        </div>

        <div className="lf-form-footer">
          <button 
            type="button" 
            className="lf-btn lf-btn-secondary" 
            onClick={() => navigate('/lost-found')}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="lf-btn lf-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export const ReportFoundForm = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    type: 'card',
    card_last_four: '',
    item_name: '',
    description: '',
    place_found: '',
    finder_name: '',
    finder_phone: '',
    owner_name: ''
  });
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.type === 'card' && !/^\d{4}$/.test(formData.card_last_four)) {
      newErrors.card_last_four = 'Please enter exactly 4 digits';
    }
    
    if (formData.type === 'item' && !formData.item_name.trim()) {
      newErrors.item_name = 'Item name is required';
    }
    
    if (!formData.place_found.trim()) {
      newErrors.place_found = 'Location is required';
    }
    
    if (!formData.finder_name.trim()) {
      newErrors.finder_name = 'Your name is required';
    }
    
    if (!/^\d{10,15}$/.test(formData.finder_phone)) {
      newErrors.finder_phone = 'Valid phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const createdItem = await LostFoundService.createFoundItem({
        ...formData,
        status: 'found'
      });
      onSubmit && onSubmit(createdItem);
      navigate('/lost-found');
    } catch (error) {
      console.error('Error creating found item:', error);
      setErrors({
        ...errors,
        form: 'Failed to submit form. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
     <div className="lost-items-dashboard">
    <div className="lf-form-container">
      <div className="lf-form-header">
        <h2>
          <FiLink className="lf-icon" /> 
          Report Found Item
        </h2>
        <p className="lf-form-description">
          Found something that doesn't belong to you? Help reunite it with its owner by providing details below.
        </p>
      </div>
      
      {errors.form && (
        <div className="lf-error-message">
          <FiAlertCircle className="lf-error-icon" />
          {errors.form}
        </div>
        

      )}
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="lf-form-group">
          <label>Item Type</label>
          <select
            className={`lf-form-control ${errors.type ? 'is-invalid' : ''}`}
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="card">Card</option>
            <option value="item">Item</option>
          </select>
        </div>

        {formData.type === 'card' ? (
            
          <div className="lf-form-group">
            <label>Last 4 Digits</label>
            <input
              className={`lf-form-control ${errors.card_last_four ? 'is-invalid' : ''}`}
              type="text"
              placeholder="e.g., 4242"
              maxLength="4"
              value={formData.card_last_four}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                setFormData({ ...formData, card_last_four: value });
              }}
              required
            />
            {errors.card_last_four && (
              <div className="lf-error-feedback">
                <FiAlertCircle className="lf-error-icon" />
                {errors.card_last_four}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="lf-form-group">
              <label>Item Name</label>
              <input
                className={`lf-form-control ${errors.item_name ? 'is-invalid' : ''}`}
                type="text"
                placeholder="e.g., Wallet"
                value={formData.item_name}
                onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                required
              />
              {errors.item_name && (
                <div className="lf-error-feedback">
                  <FiAlertCircle className="lf-error-icon" />
                  {errors.item_name}
                </div>
              )}
            </div>
            <div className="lf-form-group">
              <label>Description</label>
              <textarea
                className={`lf-form-control ${errors.description ? 'is-invalid' : ''}`}
                placeholder="Describe the item (color, brand, distinguishing features)"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              {errors.description && (
                <div className="lf-error-feedback">
                  <FiAlertCircle className="lf-error-icon" />
                  {errors.description}
                </div>
              )}
            </div>
          </>
        )}

        <div className="lf-form-group">
          <label>Owner Name (if known)</label>
          <input
            className="lf-form-control"
            type="text"
            placeholder="Owner's name"
            value={formData.owner_name}
            onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
          />
        </div>

        <div className="lf-form-group">
          <label>Place Found</label>
          <input
            className={`lf-form-control ${errors.place_found ? 'is-invalid' : ''}`}
            type="text"
            placeholder="Where did you find it? Be specific (e.g., 'Coffee shop on 2nd floor')"
            value={formData.place_found}
            onChange={(e) => setFormData({ ...formData, place_found: e.target.value })}
            required
          />
          {errors.place_found && (
            <div className="lf-error-feedback">
              <FiAlertCircle className="lf-error-icon" />
              {errors.place_found}
            </div>
          )}
        </div>

        <div className="lf-form-group">
          <label>Your Name</label>
          <input
            className={`lf-form-control ${errors.finder_name ? 'is-invalid' : ''}`}
            type="text"
            placeholder="Finder's name"
            value={formData.finder_name}
            onChange={(e) => setFormData({ ...formData, finder_name: e.target.value })}
            required
          />
          {errors.finder_name && (
            <div className="lf-error-feedback">
              <FiAlertCircle className="lf-error-icon" />
              {errors.finder_name}
            </div>
          )}
        </div>

        <div className="lf-form-group">
          <label>Your Phone Number</label>
          <input
            className={`lf-form-control ${errors.finder_phone ? 'is-invalid' : ''}`}
            type="tel"
            placeholder="Your contact number (10-15 digits)"
            value={formData.finder_phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setFormData({ ...formData, finder_phone: value });
            }}
            required
          />
          {errors.finder_phone && (
            <div className="lf-error-feedback">
              <FiAlertCircle className="lf-error-icon" />
              {errors.finder_phone}
            </div>
          )}
        </div>

        <div className="lf-form-footer">
          <button 
            type="button" 
            className="lf-btn lf-btn-secondary" 
            onClick={() => navigate('/lost-found')}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="lf-btn lf-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export const ItemDetailsForm = ({ item, onPickup }) => {
  const navigate = useNavigate();
  const [pickedBy, setPickedBy] = React.useState({ memberId: '', name: '', phone: '' });
  const [showPickupForm, setShowPickupForm] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validatePickupForm = () => {
    const newErrors = {};
    
    if (!pickedBy.memberId.trim()) {
      newErrors.memberId = 'Member ID is required';
    }
    
    if (!pickedBy.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!/^\d{10,15}$/.test(pickedBy.phone)) {
      newErrors.phone = 'Valid phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePick = async (e) => {
    e.preventDefault();
    
    if (!validatePickupForm()) return;
    
    setIsSubmitting(true);
    try {
      await LostFoundService.pickFoundItem(item.id, pickedBy);
      onPickup && onPickup();
      navigate('/lost-found');
    } catch (error) {
      console.error('Error picking item:', error);
      setErrors({
        ...errors,
        form: 'Failed to process pickup. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!item) return null;

  return (
    <div className="lost-items-dashboard">
    <div className="lf-details-container">
      <div className="lf-form-container lf-details-form">
        <div className="lf-form-header">
          <h2>Item Details</h2>
          <p className="lf-status-badge" data-status={item.status}>
            {item.status === 'found' ? 'Available' : item.status === 'pending' ? 'Pending' : 'Claimed'}
          </p>
        </div>
        
        {errors.form && (
          <div className="lf-error-message">
            <FiAlertCircle className="lf-error-icon" />
            {errors.form}
          </div>
        )}
        
        <div className="lf-details-grid">
          <div className="lf-detail-row">
            <span className="lf-detail-label">Type:</span>
            <span className="lf-detail-value">
              {item.type === 'card' ? (
                <>
                  <span className="lf-icon">💳</span> Card
                </>
              ) : (
                <>
                  <span className="lf-icon">🧳</span> Item
                </>
              )}
            </span>
          </div>

          {item.type === 'card' ? (
            <div className="lf-detail-row">
              <span className="lf-detail-label">Member No:</span>
              <span className="lf-detail-value">•••• {item.card_last_four}</span>
            </div>
          ) : (
            <>
              <div className="lf-detail-row">
                <span className="lf-detail-label">Item Name:</span>
                <span className="lf-detail-value">{item.item_name}</span>
              </div>
              <div className="lf-detail-row">
                <span className="lf-detail-label">Description:</span>
                <span className="lf-detail-value">{item.description || 'Not provided'}</span>
              </div>
            </>
          )}

          {item.owner_name && (
            <div className="lf-detail-row">
              <span className="lf-detail-label">Owner Name:</span>
              <span className="lf-detail-value">{item.owner_name}</span>
            </div>
          )}

          <div className="lf-detail-row">
            <span className="lf-detail-label">
              {item.status === 'found' ? 'Found At:' : 'Lost At:'}
            </span>
            <span className="lf-detail-value">
              {item.place_found || item.place_lost || 'Location not specified'}
            </span>
          </div>

          <div className="lf-detail-row">
            <span className="lf-detail-label">
              {item.status === 'found' ? 'Reported By:' : 'Reported By:'}
            </span>
            <span className="lf-detail-value">
              {item.finder_name || item.reporter_name || 'Anonymous'}
            </span>
          </div>

          <div className="lf-detail-row">
            <span className="lf-detail-label">Date:</span>
            <span className="lf-detail-value">
              {new Date(item.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          {!showPickupForm ? (
            <div className="lf-action-buttons">
              <button 
                className="lf-btn lf-btn-primary lf-pickup-btn"
                onClick={() => setShowPickupForm(true)}
                disabled={item.status !== 'found'}
              >
                Initiate Pickup Process
              </button>
              <button 
                className="lf-btn lf-btn-secondary"
                onClick={() => navigate('/lost-found')}
              >
                Back to List
              </button>
            </div>
          ) : (
            <form onSubmit={handlePick} className="lf-pickup-form">
              <div className="lf-scan-notice">
                <p>Members can pick up items by scanning their Membership Card at the scanner.</p>
              </div>
              
              <h4>Manual Pick Up Form</h4>
              
              <div className="lf-form-group">
                <label>Member No/ID No</label>
                <input
                  className={`lf-form-control ${errors.memberId ? 'is-invalid' : ''}`}
                  type="text"
                  placeholder="Member identification number"
                  value={pickedBy.memberId}
                  onChange={(e) => setPickedBy({ ...pickedBy, memberId: e.target.value })}
                  required
                />
                {errors.memberId && (
                  <div className="lf-error-feedback">
                    <FiAlertCircle className="lf-error-icon" />
                    {errors.memberId}
                  </div>
                )}
              </div>

              <div className="lf-form-group">
                <label>Full Name</label>
                <input
                  className={`lf-form-control ${errors.name ? 'is-invalid' : ''}`}
                  type="text"
                  placeholder="Member's full name"
                  value={pickedBy.name}
                  onChange={(e) => setPickedBy({ ...pickedBy, name: e.target.value })}
                  required
                />
                {errors.name && (
                  <div className="lf-error-feedback">
                    <FiAlertCircle className="lf-error-icon" />
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="lf-form-group">
                <label>Phone Number</label>
                <input
                  className={`lf-form-control ${errors.phone ? 'is-invalid' : ''}`}
                  type="tel"
                  placeholder="Member's phone number"
                  value={pickedBy.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setPickedBy({ ...pickedBy, phone: value });
                  }}
                  required
                />
                {errors.phone && (
                  <div className="lf-error-feedback">
                    <FiAlertCircle className="lf-error-icon" />
                    {errors.phone}
                  </div>
                )}
              </div>

              <div className="lf-form-footer">
                <button 
                  type="button"
                  className="lf-btn lf-btn-secondary"
                  onClick={() => {
                    setShowPickupForm(false);
                    setPickedBy({ memberId: '', name: '', phone: '' });
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="lf-btn lf-btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Pickup'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};