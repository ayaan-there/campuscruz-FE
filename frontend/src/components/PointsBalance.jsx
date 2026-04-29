import React, { useState, useEffect } from 'react';
import './PointsBalance.css';
import apiClient from '../utils/apiClient';

const PointsBalance = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await apiClient.get('/api/points/balance');
      setBalance(response.data.balance);
    } catch (err) {
      setError(err.message || 'Failed to load points balance');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="points-balance loading">Loading...</div>;
  if (error) return <div className="points-balance error">{error}</div>;

  return (
    <div className="points-balance">
      <div className="points-icon">⭐</div>
      <div className="points-content">
        <p className="points-label">Your Points</p>
        <p className="points-amount">{balance.toLocaleString()}</p>
        <p className="points-hint">Earn 10 points per ride • Spend on store</p>
      </div>
    </div>
  );
};

export default PointsBalance;
