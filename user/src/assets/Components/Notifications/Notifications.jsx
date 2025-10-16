import React, { useState, useEffect } from 'react';
import '../Dashboard/Dashboard.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, unread: 0 });

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
        setStats({
          total: data.notifications.length,
          unread: data.notifications.filter(n => !n.isRead).length
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="decorvista-dashboard">
        <div className="content-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="decorvista-dashboard">
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <div className="welcome-icon">
            <i className="bi bi-bell-fill"></i>
          </div>
          <div className="welcome-text">
            <h1>Notifications</h1>
            <p>Stay updated with your latest activities</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div className="dashboard-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', margin: 0, flex: 1 }}>
          <div className="stat-card" style={{ padding: '1rem' }}>
            <div className="stat-icon" style={{ width: '40px', height: '40px', fontSize: '1rem', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
              <i className="bi bi-list-ul"></i>
            </div>
            <div className="stat-info">
              <h3 style={{ fontSize: '1.5rem' }}>{stats.total}</h3>
              <p style={{ fontSize: '0.8rem' }}>Total</p>
            </div>
          </div>
          <div className="stat-card" style={{ padding: '1rem' }}>
            <div className="stat-icon" style={{ width: '40px', height: '40px', fontSize: '1rem', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
              <i className="bi bi-exclamation-circle"></i>
            </div>
            <div className="stat-info">
              <h3 style={{ fontSize: '1.5rem' }}>{stats.unread}</h3>
              <p style={{ fontSize: '0.8rem' }}>Unread</p>
            </div>
          </div>
          <div className="stat-card" style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => window.location.reload()}>
            <div className="stat-icon" style={{ width: '40px', height: '40px', fontSize: '1rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <i className="bi bi-arrow-clockwise"></i>
            </div>
            <div className="stat-info">
              <h3 style={{ fontSize: '1rem' }}>Refresh</h3>
              <p style={{ fontSize: '0.8rem' }}>Update</p>
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard-content">
        {notifications.length === 0 ? (
          <div className="content-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ color: '#6b7280' }}>
              <i className="bi bi-bell" style={{ fontSize: '4rem', marginBottom: '1.5rem', display: 'block', color: '#d1d5db' }}></i>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>No notifications yet</h3>
              <p style={{ fontSize: '1rem', margin: 0 }}>You're all caught up! New notifications will appear here.</p>
            </div>
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification._id} 
              className="content-card"
              style={{
                background: notification.isRead ? 'white' : '#f0f9ff',
                border: notification.isRead ? 'none' : '2px solid #e0f2fe',
                cursor: notification.isRead ? 'default' : 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => !notification.isRead && markAsRead(notification._id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: notification.type === 'booking' ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 
                                 notification.type === 'review' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 
                                 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.2rem'
                    }}>
                      <i className={`bi ${notification.type === 'booking' ? 'bi-calendar-check' : notification.type === 'review' ? 'bi-star' : 'bi-bell'}`}></i>
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>
                        {notification.title}
                      </h3>
                      <div style={{ 
                        background: '#f8fafc', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        color: '#64748b',
                        fontWeight: '500',
                        display: 'inline-block'
                      }}>
                        {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    background: '#f8fafc', 
                    padding: '1rem', 
                    borderRadius: '8px',
                    borderLeft: '3px solid #6366f1'
                  }}>
                    <p style={{ margin: 0, color: '#374151', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      {notification.message}
                    </p>
                  </div>
                </div>
                {!notification.isRead && (
                  <div style={{
                    width: '12px',
                    height: '12px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    borderRadius: '50%',
                    marginLeft: '1rem',
                    flexShrink: 0,
                    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                  }}></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;