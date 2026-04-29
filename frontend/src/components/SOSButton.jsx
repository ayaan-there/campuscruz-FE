import React, { useState, useEffect } from 'react';
import './SOSButton.css';

const SOSButton = ({ rideId, onSuccess }) => {
  const [showSOSMenu, setShowSOSMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sosActive, setSOSActive] = useState(false);

  const sosReasons = [
    'Medical Emergency',
    'Vehicle Breakdown',
    'Safety Threat',
    'Accident',
    'Road Hazard',
    'Other'
  ];

  const handleSOSClick = async (reason) => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/sos/alert/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rideId,
          reason,
          location: {
            latitude: navigator.geolocation ? 'pending' : null,
            longitude: navigator.geolocation ? 'pending' : null
          }
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send SOS alert');
      }

      setSOSActive(true);
      setShowSOSMenu(false);
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sos-container">
      {sosActive && (
        <div className="sos-banner">
          🚨 SOS ACTIVE - Emergency contacts notified
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <button
        className={`sos-button ${sosActive ? 'active' : ''}`}
        onClick={() => setShowSOSMenu(!showSOSMenu)}
        disabled={loading}
      >
        🆘 SOS
      </button>

      {showSOSMenu && !sosActive && (
        <div className="sos-menu">
          <p>Select emergency type:</p>
          {sosReasons.map((reason) => (
            <button
              key={reason}
              className="sos-option"
              onClick={() => handleSOSClick(reason)}
              disabled={loading}
            >
              {reason}
            </button>
          ))}
          <button
            className="sos-close"
            onClick={() => setShowSOSMenu(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default SOSButton;
