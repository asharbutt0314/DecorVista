import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from '../Toast/ToastProvider';

const OtpVerify = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Check different email sources
      const signupEmail = localStorage.getItem('userEmail');
      const resetEmail = localStorage.getItem('resetEmail');
      
      const email = signupEmail || resetEmail;
      console.log('Verifying OTP for email:', email);
      console.log('API URL:', import.meta.env.VITE_API_URL);
      
      // Use different endpoint based on context
      const isPasswordReset = resetEmail;
      const endpoint = isPasswordReset 
        ? `${import.meta.env.VITE_API_URL}/api/auth/verify-reset-otp`
        : `${import.meta.env.VITE_API_URL}/api/auth/verify-otp`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        if (isPasswordReset) {
          toast.addToast('OTP verified! You can now reset your password.', 'success');
          navigate('/reset-password');
        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.removeItem('userEmail');
          setMessage('User verified successfully! Login successful!');
          toast.addToast('User verified successfully! Login successful!', 'success');
          
          // Auto-login and redirect to dashboard
          setTimeout(() => window.location.href = '/', 2000);
        }
      } else {
        const errorMsg = data.message && data.message.includes('Invalid') ? 
          'Invalid OTP. Please check and try again.' :
          data.message && data.message.includes('expired') ? 
          'OTP has expired. Please request a new one.' :
          (data.message || 'Invalid or expired OTP');
        
        setError(errorMsg);
        toast.addToast(errorMsg, 'error');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Verification failed. Please try again.');
      toast.addToast('Verification failed. Please try again.', 'error');
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    try {
      // Check if it's for signup or forgot password
      const signupEmail = localStorage.getItem('userEmail');
      const resetEmail = localStorage.getItem('resetEmail');
      
      const email = signupEmail || resetEmail;
      
      if (!email) {
        toast.addToast('Email not found. Please try again.', 'error');
        return;
      }
      
      // Determine which endpoint to use
      let endpoint = `${import.meta.env.VITE_API_URL}/api/auth/resend-otp`;
      if (resetEmail) {
        endpoint = `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`;
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
        toast.addToast('OTP resent successfully!', 'success');
      } else {
        setError(data.message || 'Failed to resend OTP');
        toast.addToast(data.message || 'Failed to resend OTP', 'error');
      }
    } catch (error) {
      setError('Failed to resend OTP');
      toast.addToast('Failed to resend OTP', 'error');
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
          <h2 style={{ color: '#6b7280', fontWeight: 'bold' }}>
            {localStorage.getItem('resetEmail') ? 'Verify Reset Code' : 'Verify Email'}
          </h2>
          <p style={{ color: '#9ca3af' }}>Enter the 6-digit code sent to your email</p>
        </div>
        
        <form onSubmit={handleVerify}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control text-center"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
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
            {loading ? 'Verifying...' : 'Verify'}
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
        
        <div className="text-center">
          <button
            onClick={handleResend}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(15, 23, 42, 0.95)',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;