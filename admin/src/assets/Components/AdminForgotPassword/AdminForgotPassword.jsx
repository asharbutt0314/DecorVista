import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminResetEmail', email);
        localStorage.setItem('adminResetId', data.adminId);
        setOtpSent(true);
        setMessage('Admin reset code sent to your email!');
      } else {
        if (data.message.includes('not found')) {
          setMessage('Admin email not found. Please check your email address.');
        } else if (data.message.includes('domain')) {
          setMessage('Invalid email domain. Please use a valid email address.');
        } else {
          setMessage(data.message);
        }
      }
    } catch (error) {
      setMessage('Failed to send admin reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setVerifying(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/verify-reset-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: localStorage.getItem('adminResetEmail'), 
          otp 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('OTP verified! You can now reset your password.');
        setTimeout(() => navigate('/admin-new-password'), 2000);
      } else {
        setMessage(data.message || 'Invalid OTP');
      }
    } catch (error) {
      setMessage('Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/forgot-password`, {
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
        setMessage(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      setMessage('Failed to resend OTP');
    } finally {
      setLoading(false);
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
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
          }}>
            <i className="bi bi-shield-lock text-white" style={{ fontSize: '2rem' }}></i>
          </div>
          <h2 style={{ color: '#6b7280', fontWeight: 'bold' }}>Admin Password Reset</h2>
          <p style={{ color: '#9ca3af' }}>Enter your admin email to reset password</p>
        </div>
        
        {!otpSent ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label" style={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: '600' }}>Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                borderRadius: '12px',
                border: '2px solid rgba(15, 23, 42, 0.2)',
                padding: '12px 16px',
                fontSize: '16px'
              }}
              placeholder="Enter your admin email"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn w-100"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Sending...' : 'Send Admin Reset Code'}
          </button>
        </form>
        ) : (
        <form onSubmit={handleVerifyOtp}>
          <div className="mb-3">
            <label className="form-label" style={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: '600' }}>Enter Admin OTP</label>
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
            disabled={verifying}
            className="btn w-100 mb-3"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {verifying ? 'Verifying...' : 'Verify Admin OTP'}
          </button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOtp}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(15, 23, 42, 0.95)',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Resend Admin OTP
            </button>
          </div>
        </form>
        )}
        
        {message && (
          <div className={`alert text-center mt-3 ${
            message.includes('🛡️') ? 'alert-success' : 'alert-danger'
          }`} style={{ borderRadius: '12px', fontSize: '14px' }}>
            {message}
          </div>
        )}
        
        <div className="text-center mt-3">
          <p style={{ color: '#9ca3af', margin: '0' }}>
            Remember your password? 
            <a href="/" style={{ color: 'rgba(15, 23, 42, 0.95)', textDecoration: 'none', fontWeight: 'bold', marginLeft: '5px' }}>
              Admin Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;