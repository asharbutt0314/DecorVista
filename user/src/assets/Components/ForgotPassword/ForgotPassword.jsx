import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../Toast/ToastProvider';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
  body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('resetEmail', email);
        localStorage.setItem('resetUserId', data.userId);
        setMessage('OTP sent to your email!');
        toast.addToast('OTP sent to your email!', 'success');
        setTimeout(() => navigate('/otp-verify'), 2000);
      } else {
        if (data.message.includes('not found')) {
          setError('Email not found. Please check your email address.');
          toast.addToast('Email not found. Please check your email address.', 'error');
        } else if (data.message.includes('domain')) {
          setError('Invalid email domain. Please use a valid email address.');
          toast.addToast('Invalid email domain. Please use a valid email address.', 'error');
        } else {
          setError(data.message);
          toast.addToast(data.message, 'error');
        }
      }
    } catch (error) {
      setError('Failed to send OTP');
      toast.addToast('Failed to send OTP', 'error');
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
      justifyContent: 'center'
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
            background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)'
          }}>
            <i className="bi bi-lock text-white" style={{ fontSize: '2rem' }}></i>
          </div>
          <h2 style={{ color: '#6b7280', fontWeight: 'bold' }}>Forgot Password?</h2>
          <p style={{ color: '#9ca3af' }}>
            Enter your email to reset your password
          </p>
        </div>
        
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
              placeholder="Enter your email"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn w-100"
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>
          
          {error && (
            <div className="alert alert-danger text-center" style={{ borderRadius: '12px', fontSize: '14px', marginTop: '1rem' }}>
              {error}
            </div>
          )}
          
          {message && (
            <div className="alert alert-success text-center" style={{ borderRadius: '12px', fontSize: '14px', marginTop: '1rem' }}>
              {message}
            </div>
          )}
        </form>
        
        <div className="text-center mt-3">
          <p style={{ color: '#9ca3af', margin: '0' }}>
            Remember your password? 
            <a href="/login" style={{ color: 'rgba(15, 23, 42, 0.95)', textDecoration: 'none', fontWeight: 'bold', marginLeft: '5px' }}>
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;