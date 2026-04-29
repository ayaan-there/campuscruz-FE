import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './OTPVerification.css';

export const OTPVerification = ({ userId, onSuccess, onError }) => {
  const [step, setStep] = useState('phone'); // phone → otp → verified
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpId, setOtpId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Phone validation
    if (!phoneNumber.match(/^\+?1?\d{9,15}$/)) {
      setError('Invalid phone number. Use format: +1234567890 or 1234567890');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_URL}/api/otp/send-otp`,
        { phoneNumber, userId },
        { withCredentials: true }
      );

      setOtpId(data.otpId);
      setStep('otp');
      setTimeLeft(600); // 10 minutes

      // Countdown timer
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) clearInterval(interval);
          return prev - 1;
        });
      }, 1000);

      // Show OTP in dev mode
      if (data.otp) {
        alert(`[DEV MODE] Your OTP is: ${data.otp}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!otp || otp.length !== 6) {
      setError('OTP must be 6 digits');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_URL}/api/otp/verify-otp`,
        { otpId, otp },
        { withCredentials: true }
      );

      setStep('verified');
      onSuccess?.(data.user);
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid OTP';
      setAttempts((prev) => prev + 1);
      setError(msg);

      const remaining = err.response?.data?.attemptsRemaining;
      if (remaining === 0) {
        setError('Max attempts exceeded. Request a new OTP.');
        setStep('phone');
        setOtp('');
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      await axios.post(
        `${API_URL}/api/otp/resend-otp`,
        { phoneNumber, userId },
        { withCredentials: true }
      );

      setOtp('');
      setAttempts(0);
      setTimeLeft(600);
      alert('OTP resent successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-verification">
      {step === 'phone' && (
        <form onSubmit={handleSendOTP} className="otp-form">
          <h3>📱 Verify Phone Number</h3>
          <p className="subtitle">We'll send a verification code to your phone</p>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 123-4567"
              disabled={loading}
              required
            />
            <small>Include country code, e.g., +1 for US</small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            disabled={loading || !phoneNumber}
            className="btn-primary"
          >
            {loading ? 'Sending...' : 'Send Verification Code'}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOTP} className="otp-form">
          <h3>🔐 Enter Verification Code</h3>
          <p className="subtitle">
            Code sent to {phoneNumber}
            {' '}
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="link-btn"
            >
              Change
            </button>
          </p>

          <div className="form-group">
            <label>6-Digit Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength="6"
              disabled={loading}
              required
              className="otp-input"
            />
          </div>

          <div className="timer">
            ⏱️ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')} left
            {timeLeft < 60 && <span className="warning"> (expiring soon)</span>}
          </div>

          <div className="attempts">
            Attempts: {attempts} / 5
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="btn-primary"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>

          <button
            type="button"
            onClick={handleResendOTP}
            disabled={loading}
            className="btn-secondary"
          >
            Resend Code
          </button>
        </form>
      )}

      {step === 'verified' && (
        <div className="otp-success">
          <h3>✅ Phone Number Verified!</h3>
          <p>Your phone number has been successfully verified.</p>
          <p className="account-info">You can now use all platform features.</p>
        </div>
      )}
    </div>
  );
};

export default OTPVerification;
