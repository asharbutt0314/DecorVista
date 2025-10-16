import React, { useState, useEffect } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllNotifications();
  }, []);

  const fetchAllNotifications = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-content">
          <div className="header-icon">
            <i className="bi bi-bell-fill"></i>
          </div>
          <h1>Notifications Management</h1>
          <p>Monitor system notifications</p>
        </div>
      </div>

      <div className="admin-actions mb-4">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">
              <i className="bi bi-bell me-2"></i>
              All Notifications ({notifications.length})
            </h4>
          </div>
          <div className="card-body">
            {notifications.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-bell-slash display-1 text-muted"></i>
                <h5 className="mt-3 text-muted">No notifications found</h5>
              </div>
            ) : (
              <div className="list-group">
                {notifications.map(notification => (
                  <div key={notification._id} className={`list-group-item ${!notification.isRead ? 'border-start border-primary border-3' : ''}`}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{notification.title}</h6>
                        <p className="mb-1">{notification.message}</p>
                        <small className="text-muted">
                          Type: {notification.type} | {new Date(notification.createdAt).toLocaleString()}
                        </small>
                      </div>
                      <span className={`badge ${notification.isRead ? 'bg-secondary' : 'bg-primary'}`}>
                        {notification.isRead ? 'Read' : 'Unread'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;