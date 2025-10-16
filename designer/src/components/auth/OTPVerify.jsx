import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthStyles.css';

const OtpVerify = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Check different email sources
      const signupEmail = localStorage.getItem('userEmail');
      const resetEmail = localStorage.getItem('resetEmail');
      const otpEmail = localStorage.getItem('otpEmail');
      
      const email = signupEmail || resetEmail || otpEmail;
      // Use different endpoint based on context
      const isPasswordReset = resetEmail;
      const endpoint = isPasswordReset 
        ? `${import.meta.env.VITE_API_URL}/api/designer/verify-reset-otp`
        : `${import.meta.env.VITE_API_URL}/api/designer/verify-otp`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Invalid or expired OTP');
        setLoading(false);
        return;
      }

      if (data.success) {
        if (isPasswordReset) {
          setMessage('OTP verified! You can now reset your password.');
          setTimeout(() => navigate('/reset-password'), 2000);
        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          // Clean up all email storage
          localStorage.removeItem('userEmail');
          localStorage.removeItem('resetEmail');
          localStorage.removeItem('otpEmail');
          setMessage('Email verified and logged in successfully!');
          
          // Redirect to designer dashboard
          setTimeout(() => window.location.href = '/', 2000);
        }
      } else {
        setError(data.message || 'Invalid or expired OTP');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Invalid or expired OTP. Please try again.');
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setError('');
    setMessage('');
    try {
      // Check if it's for signup or forgot password
      const signupEmail = localStorage.getItem('userEmail');
      const resetEmail = localStorage.getItem('resetEmail');
      const otpEmail = localStorage.getItem('otpEmail');
      
      const email = signupEmail || resetEmail || otpEmail;
      
      if (!email) {
        setError('Email not found. Please try again.');
        return;
      }
      
      // Determine which endpoint to use
      let endpoint = `${import.meta.env.VITE_API_URL}/api/designer/resend-otp`;
      if (resetEmail) {
        endpoint = `${import.meta.env.VITE_API_URL}/api/designer/forgot-password`;
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('OTP resent successfully!');
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      setError('Failed to resend OTP');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'rgba(15, 23, 42, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '3rem',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div className="text-center mb-4">
          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(15, 23, 42, 0.95)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 25px rgba(15, 23, 42, 0.3)'
          }}>
            <i className="bi bi-shield-check text-white" style={{ fontSize: '2rem' }}></i>
          </div>
          <h2 style={{ color: '#6b7280', fontWeight: 'bold' }}>
            {localStorage.getItem('resetEmail') ? 'Verify Reset Code' : 'Verify Email'}
          </h2>
          <p style={{ color: '#9ca3af' }}>
            Enter the 6-digit code sent to your email
          </p>
        </div>
        
        <form onSubmit={handleVerify}>
          <div className="mb-3">
            <label className="form-label" style={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: '600' }}>Verification Code</label>
            <input
              type="text"
              className="form-control text-center"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              required
              style={{
                borderRadius: '12px',
                border: '2px solid rgba(15, 23, 42, 0.2)',
                padding: '12px 16px',
                fontSize: '18px',
                letterSpacing: '2px'
              }}
            />
          </div>
          
          <button
            type="submit"
            className="btn w-100 mb-3"
            disabled={loading}
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
        
        {error && (
          <div className="alert alert-danger text-center" style={{ borderRadius: '12px', fontSize: '14px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        
        {message && (
          <div className="alert alert-success text-center" style={{ borderRadius: '12px', fontSize: '14px', marginBottom: '1rem' }}>
            {message}
          </div>
        )}
        
        <div className="text-center">
          <p style={{ color: '#9ca3af', margin: '0.5rem 0' }}>
            Didn't receive the code?{' '}
            <button
              onClick={handleResend}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(15, 23, 42, 0.95)',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;