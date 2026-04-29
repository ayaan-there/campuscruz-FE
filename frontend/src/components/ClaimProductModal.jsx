import React, { useState, useEffect } from 'react';
import './ClaimProductModal.css';
import { API_URL } from '../config';

const ClaimProductModal = ({ product, onClose, onSuccess }) => {
  const [pointsBalance, setPointsBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });

  useEffect(() => {
    fetchPointsBalance();
  }, []);

  const fetchPointsBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/points/balance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setPointsBalance(data.balance);
      }
    } catch (err) {
      console.error('Error fetching points:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const canAfford = pointsBalance >= product.pointsCost;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canAfford) {
      setError(`You need ${product.pointsCost - pointsBalance} more points`);
      return;
    }

    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.street || 
        !formData.city || !formData.state || !formData.zip || !formData.country) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/store/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id,
          shippingAddress: formData
        })
      });

      if (response.ok) {
        onSuccess();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to claim product');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const pointsNeeded = Math.max(0, product.pointsCost - pointsBalance);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="modal-header">
          <img src={product.image} alt={product.name} className="product-image-large" />
          <h2>{product.name}</h2>
          <p className="product-description-modal">{product.description}</p>
        </div>

        <div className="points-info">
          <div className="points-summary">
            <div className="summary-item">
              <span className="label">Cost:</span>
              <span className="value">⭐ {product.pointsCost} points</span>
            </div>
            <div className="summary-item">
              <span className="label">Your Balance:</span>
              <span className={`value ${canAfford ? 'green' : 'red'}`}>
                ⭐ {pointsBalance} points
              </span>
            </div>
            {!canAfford && (
              <div className="summary-item shortage">
                <span className="label">Still Need:</span>
                <span className="value">⭐ {pointsNeeded} more points</span>
              </div>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>Shipping Address</h3>

          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              name="street"
              placeholder="Street Address"
              value={formData.street}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State/Province"
              value={formData.state}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              name="zip"
              placeholder="ZIP/Postal Code"
              value={formData.zip}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="claim-confirm-btn"
              disabled={!canAfford || loading}
            >
              {loading ? 'Processing...' : `Confirm Claim (${product.pointsCost} ⭐)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimProductModal;
