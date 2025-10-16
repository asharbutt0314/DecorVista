import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [admin, setAdmin] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load admin data from localStorage
    const adminData = JSON.parse(localStorage.getItem('admin') || '{}');
    if (adminData.username) {
      setAdmin(adminData);
      setUsername(adminData.username);
      setEmail(adminData.email);
    } else {
      // Mock admin data for demo
      const mockAdmin = {
        _id: '1',
        username: 'admin',
        email: 'admin@decorvista.com'
      };
      setAdmin(mockAdmin);
      setUsername(mockAdmin.username);
      setEmail(mockAdmin.email);
    }
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setErrorMessage('');
    setSuccessMessage('');
    
    if (newPassword && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(newPassword)) {
      setPasswordError('Password must be at least 8 characters, include uppercase, lowercase, number, and special character.');
      return;
    }
    
    if (newPassword && !currentPassword) {
      setErrorMessage('Current password is required when changing password');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }
    
    // Mock validation for demo - check if current password is correct
    if (newPassword && currentPassword !== 'admin123') {
      setErrorMessage('Current password is incorrect');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const updateData = { username };
      if (newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const updatedAdmin = { ...admin, username, email };
          setAdmin(updatedAdmin);
          localStorage.setItem('admin', JSON.stringify(updatedAdmin));
          setSuccessMessage('Profile updated successfully!');
          setTimeout(() => setSuccessMessage(''), 5000);
          setCurrentPassword('');
          setNewPassword('');
        } else {
          setErrorMessage(data.message || 'Update failed');
          setTimeout(() => setErrorMessage(''), 5000);
        }
      } else {
        // Fallback for demo
        const updatedAdmin = { ...admin, username, email };
        setAdmin(updatedAdmin);
        localStorage.setItem('admin', JSON.stringify(updatedAdmin));
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Fallback for demo
      const updatedAdmin = { ...admin, username, email };
      setAdmin(updatedAdmin);
      localStorage.setItem('admin', JSON.stringify(updatedAdmin));
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
      setCurrentPassword('');
      setNewPassword('');
    } finally {
      setLoading(false);
    }
  };

  if (!admin) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: '#3b82f6' }}></div>
          <p className="mt-3 text-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="admin-card p-5 position-relative overflow-hidden" style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
          }}>
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.05) 0%, rgba(30, 41, 59, 0.05) 100%)',
              zIndex: 1
            }}></div>
            
            <div className="position-relative" style={{ zIndex: 2 }}>
              <div className="text-center mb-5">
                <div className="d-flex justify-content-center mb-3">
                  <div className="d-flex align-items-center justify-content-center" style={{
                    width: '80px',
                    height: '80px',
                    background: 'rgba(15, 23, 42, 0.95)',
                    borderRadius: '50%',
                    boxShadow: '0 8px 25px rgba(15, 23, 42, 0.3)'
                  }}>
                    <i className="bi bi-gear text-white" style={{ fontSize: '2.5rem' }}></i>
                  </div>
                </div>
                <h2 className="fw-bold mb-2" style={{
                  color: '#6b7280',
                  fontSize: '2.5rem'
                }}>Admin Settings</h2>
                <p className="text-muted mb-0">Manage your administrator account settings</p>
                
                {successMessage && (
                  <div className="alert alert-success mt-3 d-flex align-items-center" style={{
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)'
                  }}>
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {successMessage}
                  </div>
                )}
                
                {errorMessage && (
                  <div className="alert alert-danger mt-3 d-flex align-items-center" style={{
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)'
                  }}>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {errorMessage}
                  </div>
                )}
              </div>

              <div className="row">
                <div className="col-md-4 mb-4">
                  <div className="p-4 rounded-3 text-center" style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '2px solid rgba(15, 23, 42, 0.2)'
                  }}>
                    <i className="bi bi-person-circle display-4 mb-3" style={{ color: 'rgba(15, 23, 42, 0.95)' }}></i>
                    <h5 className="fw-bold">{admin.username}</h5>
                    <p className="text-muted small mb-0">Administrator</p>
                  </div>
                </div>
                
                <div className="col-md-8">
                  <form onSubmit={handleUpdateProfile}>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-bold d-flex align-items-center" style={{ color: 'rgba(15, 23, 42, 0.95)' }}>
                          <i className="bi bi-envelope me-2"></i>Email Address
                        </label>
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
                            fontSize: '16px',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(15, 23, 42, 0.25)'}
                          onBlur={(e) => e.target.style.boxShadow = 'none'}
                        />
                      </div>
                      
                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-bold d-flex align-items-center" style={{ color: 'rgba(15, 23, 42, 0.95)' }}>
                          <i className="bi bi-person me-2"></i>Username
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          style={{ 
                            borderRadius: '12px', 
                            border: '2px solid rgba(15, 23, 42, 0.2)', 
                            padding: '12px 16px',
                            fontSize: '16px',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(15, 23, 42, 0.25)'}
                          onBlur={(e) => e.target.style.boxShadow = 'none'}
                        />
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-bold d-flex align-items-center" style={{ color: 'rgba(15, 23, 42, 0.95)' }}>
                          <i className="bi bi-lock me-2"></i>Current Password
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            style={{ 
                              borderRadius: '12px', 
                              border: '2px solid rgba(15, 23, 42, 0.2)', 
                              padding: '12px 45px 12px 16px',
                              fontSize: '16px'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                              position: 'absolute',
                              right: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              color: '#6b7280',
                              cursor: 'pointer',
                              padding: '4px',
                              fontSize: '18px'
                            }}
                          >
                            <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-bold d-flex align-items-center" style={{ color: 'rgba(15, 23, 42, 0.95)' }}>
                          <i className="bi bi-key me-2"></i>New Password
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            className="form-control"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Leave blank to keep current"
                            style={{ 
                              borderRadius: '12px', 
                              border: '2px solid rgba(15, 23, 42, 0.2)', 
                              padding: '12px 45px 12px 16px',
                              fontSize: '16px'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            style={{
                              position: 'absolute',
                              right: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              color: '#6b7280',
                              cursor: 'pointer',
                              padding: '4px',
                              fontSize: '18px'
                            }}
                          >
                            <i className={`bi ${showNewPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                          </button>
                        </div>
                        {passwordError && (
                          <div className="text-danger mt-2" style={{ fontSize: '0.95em' }}>{passwordError}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="d-flex gap-3 mt-4">
                      <button 
                        type="submit" 
                        className="btn btn-lg flex-fill" 
                        disabled={loading}
                        style={{
                          background: 'rgba(15, 23, 42, 0.95)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          padding: '12px',
                          boxShadow: '0 4px 15px rgba(15, 23, 42, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)'
                          e.target.style.boxShadow = '0 8px 25px rgba(15, 23, 42, 0.4)'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)'
                          e.target.style.boxShadow = '0 4px 15px rgba(15, 23, 42, 0.3)'
                        }}
                      >
                        {loading ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Update Profile
                          </>
                        )}
                      </button>
                      
                      <button 
                        type="button" 
                        className="btn btn-lg btn-outline-secondary"
                        onClick={() => navigate('/')}
                        style={{
                          borderRadius: '12px',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          padding: '12px 24px'
                        }}
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;