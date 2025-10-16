import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../Toast/ToastProvider';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      toast.addToast('Passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      toast.addToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);

    try {
      const resetEmail = localStorage.getItem('resetEmail');
      
      if (!resetEmail) {
        toast.addToast('Session expired. Please try again.', 'error');
        navigate('/forgot-password');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: resetEmail, 
          newPassword,

        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem('resetEmail');
        setMessage('Password reset successfully!');
        toast.addToast('Password reset successfully!', 'success');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Password reset failed');
        toast.addToast(data.message || 'Password reset failed', 'error');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Password reset failed. Please try again.');
      toast.addToast('Password reset failed. Please try again.', 'error');
    }
    setLoading(false);
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
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
          }}>
            <i className="bi bi-key text-white" style={{ fontSize: '2rem' }}></i>
          </div>
          <h2 style={{ color: '#6b7280', fontWeight: 'bold' }}>Set New Password</h2>
          <p style={{ color: '#9ca3af' }}>
            Enter your new password
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: '600' }}>New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              style={{
                borderRadius: '12px',
                border: '2px solid rgba(15, 23, 42, 0.2)',
                padding: '12px 16px',
                fontSize: '16px'
              }}
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label" style={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: '600' }}>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              style={{
                borderRadius: '12px',
                border: '2px solid rgba(15, 23, 42, 0.2)',
                padding: '12px 16px',
                fontSize: '16px'
              }}
            />
          </div>
          
          <button
            type="submit"
            className="btn w-100 mb-3"
            disabled={loading}
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
            {loading ? 'Resetting...' : 'Reset Password'}
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
      </div>
    </div>
  );
};

export default ResetPassword;