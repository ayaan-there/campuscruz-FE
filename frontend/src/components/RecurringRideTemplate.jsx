import React, { useState } from 'react';
import './RecurringRideTemplate.css';

const RecurringRideTemplate = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    startLocation: '',
    endLocation: '',
    startTime: '',
    pricePerPassenger: 0,
    seatsAvailable: 4,
    daysOfWeek: [],
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDayToggle = (day) => {
    setFormData({
      ...formData,
      daysOfWeek: formData.daysOfWeek.includes(day)
        ? formData.daysOfWeek.filter(d => d !== day)
        : [...formData.daysOfWeek, day]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.startLocation || !formData.endLocation || !formData.startTime) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.daysOfWeek.length === 0) {
      setError('Please select at least one day');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/recurring/template/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create recurring template');
      }

      setFormData({
        startLocation: '',
        endLocation: '',
        startTime: '',
        pricePerPassenger: 0,
        seatsAvailable: 4,
        daysOfWeek: [],
        description: ''
      });

      onSuccess && onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recurring-template-form">
      <h3>Create Recurring Ride</h3>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="startLocation">Start Location *</label>
          <input
            type="text"
            id="startLocation"
            name="startLocation"
            value={formData.startLocation}
            onChange={handleInputChange}
            placeholder="e.g., Campus Gate"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endLocation">End Location *</label>
          <input
            type="text"
            id="endLocation"
            name="endLocation"
            value={formData.endLocation}
            onChange={handleInputChange}
            placeholder="e.g., Central Station"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="startTime">Start Time *</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="pricePerPassenger">Price per Passenger ($)</label>
          <input
            type="number"
            id="pricePerPassenger"
            name="pricePerPassenger"
            value={formData.pricePerPassenger}
            onChange={handleInputChange}
            min="0"
            step="0.5"
          />
        </div>

        <div className="form-group">
          <label htmlFor="seatsAvailable">Available Seats</label>
          <select
            id="seatsAvailable"
            name="seatsAvailable"
            value={formData.seatsAvailable}
            onChange={handleInputChange}
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Days of Week *</label>
          <div className="days-container">
            {daysOfWeek.map(day => (
              <label key={day} className="day-checkbox">
                <input
                  type="checkbox"
                  checked={formData.daysOfWeek.includes(day)}
                  onChange={() => handleDayToggle(day)}
                />
                {day.substring(0, 3)}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Additional details about the ride"
            rows="3"
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Creating...' : 'Create Recurring Ride'}
        </button>
      </form>
    </div>
  );
};

export default RecurringRideTemplate;
