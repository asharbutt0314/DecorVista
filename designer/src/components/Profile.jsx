import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [designer, setDesigner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    otp: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        if (parsedUser && (parsedUser._id || parsedUser.id)) {
          fetchDesignerProfile(parsedUser._id || parsedUser.id);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setLoading(false);
  }, []);

  const fetchDesignerProfile = async (userId) => {
    // Designer info is in the same user object from Designer model
    setDesigner(user);
  };

  const updateProfile = async () => {
    if (!user) return;
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const userId = user._id || user.id;
      if (!userId) {
        alert('User ID not found');
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/designer/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: user.username,
          gender: user.gender,
          specialization: user.specialization,
          yearsofexperience: user.yearsofexperience,
          hourlyRate: user.hourlyRate,
          portfolio: user.portfolio
        })
      });
      
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.designer));
        setUser(data.designer);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        setSuccessMessage('Update failed: ' + (data.message || 'Unknown error'));
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (error) {
      alert('Error updating profile');
    } finally {
      setUpdating(false);
    }
  };



  if (loading) {
    return (
      <div className="profile-container">
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <h2>Profile not found</h2>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>Designer Profile</h2>
      
      {successMessage && (
        <div style={{
          background: '#d4edda',
          color: '#155724',
          padding: '12px 20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #c3e6cb',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <i className="bi bi-check-circle-fill"></i>
          {successMessage}
        </div>
      )}
      
      <div className="profile-content">
        <div className="content-card">
          <div className="card-header">
            <h3><i className="bi bi-person-fill"></i> Personal Information</h3>
          </div>
          <div className="profile-info">
            <div className="info-item">
              <span className="info-label">Username</span>
              <span className="info-value">{user.username || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{user.email || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Gender</span>
              <span className="info-value">{user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role</span>
              <span className="info-value">Interior Designer</span>
            </div>
            <div className="info-item">
              <span className="info-label">Verified</span>
              <span className="info-value">{user.isVerified ? 'Yes' : 'No'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Member Since</span>
              <span className="info-value">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not specified'}</span>
            </div>
          </div>
        </div>

        <div className="content-card">
          <div className="card-header">
            <h3><i className="bi bi-palette-fill"></i> Designer Information</h3>
          </div>
          <div className="profile-info">
            <div className="info-item">
              <span className="info-label">Specialization</span>
              <span className="info-value">{user.specialization || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Experience</span>
              <span className="info-value">{user.yearsofexperience || 0} years</span>
            </div>
            <div className="info-item">
              <span className="info-label">Hourly Rate</span>
              <span className="info-value">${user.hourlyRate || 0}/hr</span>
            </div>
            <div className="info-item">
              <span className="info-label">Portfolio</span>
              <span className="info-value">{user.portfolio ? (user.portfolio.length > 50 ? user.portfolio.substring(0, 50) + '...' : user.portfolio) : 'Not specified'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status</span>
              <span className="info-value">{user.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>

        <div className="content-card">
          <div className="card-header">
            <h3><i className="bi bi-pencil-square"></i> Edit Profile</h3>
          </div>
          <div className="profile-form">
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                value={user.username || ''}
                onChange={(e) => setUser({...user, username: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select 
                value={user.gender || ''}
                onChange={(e) => setUser({...user, gender: e.target.value})}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Specialization</label>
              <select 
                value={user.specialization || ''}
                onChange={(e) => setUser({...user, specialization: e.target.value})}
              >
                <option value="">Select Specialization</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="hospitality">Hospitality</option>
                <option value="retail">Retail</option>
                <option value="office">Office</option>
              </select>
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              <input 
                type="number" 
                min="0"
                value={user.yearsofexperience || ''}
                onChange={(e) => setUser({...user, yearsofexperience: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="form-group">
              <label>Hourly Rate ($)</label>
              <input 
                type="number" 
                min="0"
                value={user.hourlyRate || ''}
                onChange={(e) => setUser({...user, hourlyRate: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="form-group">
              <label>Portfolio Description</label>
              <textarea 
                value={user.portfolio || ''}
                onChange={(e) => setUser({...user, portfolio: e.target.value})}
                placeholder="Describe your design style and experience..."
                rows="4"
              />
            </div>
            <div className="form-actions">
              <button className="btn-secondary" onClick={() => {
                const userData = localStorage.getItem('user');
                if (userData) {
                  try {
                    setUser(JSON.parse(userData));
                  } catch (error) {
                    console.error('Error parsing user data:', error);
                  }
                }
              }}>Cancel</button>
              <button className="btn-primary" onClick={updateProfile} disabled={updating}>
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>



        <div className="content-card">
          <div className="card-header">
            <h3><i className="bi bi-lock-fill"></i> Change Password</h3>
          </div>
          <div className="profile-form">
            {!forgotMode && (
              <div className="form-group">
                <label>Current Password</label>
                <input 
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  placeholder="Enter current password"
                />
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <button 
                    type="button"
                    onClick={() => setForgotMode(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6366f1',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
            )}
            
            {forgotMode && !otpSent && (
              <div className="form-group">
                <p style={{ color: '#666', marginBottom: '15px' }}>We'll send an OTP to your email: {user?.email}</p>
                <button 
                  className="btn-primary" 
                  onClick={async () => {
                    try {
                      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: user?.email })
                      });
                      const data = await response.json();
                      if (data.success) {
                        setOtpSent(true);
                        setSuccessMessage('OTP sent to your email');
                        setTimeout(() => setSuccessMessage(''), 5000);
                      } else {
                        setSuccessMessage('Failed to send OTP: ' + (data.message || 'Unknown error'));
                        setTimeout(() => setSuccessMessage(''), 5000);
                      }
                    } catch (error) {
                      setSuccessMessage('Error sending OTP');
                      setTimeout(() => setSuccessMessage(''), 5000);
                    }
                  }}
                  style={{ width: '100%' }}
                >
                  Send OTP
                </button>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <button 
                    type="button"
                    onClick={() => setForgotMode(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Back to Current Password
                  </button>
                </div>
              </div>
            )}
            
            {forgotMode && otpSent && (
              <div className="form-group">
                <label>Enter OTP</label>
                <input 
                  type="text"
                  value={passwordData.otp}
                  onChange={(e) => setPasswordData({...passwordData, otp: e.target.value})}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                />
              </div>
            )}
            
            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                placeholder="Enter new password"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input 
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                placeholder="Confirm new password"
              />
            </div>
            <div className="form-actions">
              <button className="btn-secondary" onClick={() => {
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '', otp: '' });
                setForgotMode(false);
                setOtpSent(false);
              }}>Clear</button>
              {!forgotMode ? (
                <button className="btn-primary" onClick={async () => {
                  if (passwordData.newPassword !== passwordData.confirmPassword) {
                    alert('New passwords do not match');
                    return;
                  }
                  setChangingPassword(true);
                  try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/change-password`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        userId: user?._id || user?.id,
                        currentPassword: passwordData.currentPassword,
                        newPassword: passwordData.newPassword
                      })
                    });
                    const data = await response.json();
                    if (data.success) {
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      alert('Password changed successfully');
                    } else {
                      alert(data.message || 'Password change failed');
                    }
                  } catch (error) {
                    alert('Error changing password');
                  }
                  setChangingPassword(false);
                }} disabled={changingPassword}>
                  {changingPassword ? 'Changing...' : 'Change Password'}
                </button>
              ) : otpSent ? (
                <button className="btn-primary" onClick={async () => {
                  if (passwordData.newPassword !== passwordData.confirmPassword) {
                    alert('New passwords do not match');
                    return;
                  }
                  setChangingPassword(true);
                  try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        userId: user?._id || user?.id,
                        otp: passwordData.otp,
                        newPassword: passwordData.newPassword
                      })
                    });
                    const data = await response.json();
                    if (data.success) {
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '', otp: '' });
                      setForgotMode(false);
                      setOtpSent(false);
                      alert('Password reset successfully');
                    } else {
                      alert(data.message || 'Password reset failed');
                    }
                  } catch (error) {
                    alert('Error resetting password');
                  }
                  setChangingPassword(false);
                }} disabled={changingPassword}>
                  {changingPassword ? 'Resetting...' : 'Reset Password'}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;