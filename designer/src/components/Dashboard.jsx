import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeConsultations: 0,
    totalReviews: 0,
    avgRating: 0
  });
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [designerName, setDesignerName] = useState('');

  useEffect(() => {
    fetchDashboardData();
    getDesignerName();
  }, []);

  const getDesignerName = () => {
    const designerData = localStorage.getItem('user')
    if (designerData) {
      try {
        const designer = JSON.parse(designerData)
        setDesignerName(designer.username || 'Designer')
      } catch (error) {
        setDesignerName('Designer')
      }
    } else {
      setDesignerName('Designer')
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const designerId = user._id;
      
      // Fetch data from multiple endpoints
      const [portfolioRes, consultationsRes, reviewsRes, notificationsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/designers/portfolio/${designerId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/consultations/designer`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/my-designer-reviews`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const portfolio = portfolioRes.ok ? await portfolioRes.json() : { success: false };
      const consultations = consultationsRes.ok ? await consultationsRes.json() : { success: false };
      const reviews = reviewsRes.ok ? await reviewsRes.json() : { success: false };
      const notifications = notificationsRes.ok ? await notificationsRes.json() : { success: false };

      // Calculate stats
      const totalProjects = portfolio.success ? (portfolio.portfolio?.length || 0) : 0;
      const allConsultations = consultations.success ? (consultations.consultations || []) : [];
      const activeConsultations = allConsultations.filter(c => c.status === 'pending' || c.status === 'confirmed').length;
      const allReviews = reviews.success ? (reviews.reviews || []) : [];
      const totalReviews = allReviews.length;
      const avgRating = totalReviews > 0 ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) : 0;
      const unreadNotifications = notifications.success ? (notifications.notifications?.filter(n => !n.isRead).length || 0) : 0;

      setStats({
        totalProjects,
        activeConsultations,
        totalReviews,
        avgRating
      });

      setDashboardData({
        consultations: allConsultations.slice(0, 5),
        reviews: allReviews.slice(0, 5),
        notifications: notifications.success ? (notifications.notifications?.slice(0, 5) || []) : []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="decorvista-dashboard">
        <div className="content-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="decorvista-dashboard">
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <div className="welcome-icon">
            <i className="bi bi-palette-fill"></i>
          </div>
          <div className="welcome-text">
            <h1>Welcome back, {designerName}!</h1>
            <p>Manage your design projects and clients</p>
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon products">
            <i className="bi bi-palette"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalProjects}</h3>
            <p>Portfolio Projects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon consultations">
            <i className="bi bi-chat-dots"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.activeConsultations}</h3>
            <p>Pending Consultations</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon saved">
            <i className="bi bi-star"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalReviews}</h3>
            <p>Client Reviews</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon notifications">
            <i className="bi bi-star-fill"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.avgRating}</h3>
            <p>Average Rating</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-card">
          <div className="card-header">
            <h3><i className="bi bi-calendar-check"></i> Recent Consultations</h3>
          </div>
          <div style={{ padding: '20px' }}>
            {loading ? (
              <div>Loading...</div>
            ) : dashboardData?.consultations?.length > 0 ? (
              dashboardData.consultations.map(consultation => (
                <div key={consultation._id} style={{ padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ fontWeight: '500' }}>{consultation.user_id?.username}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    {new Date(consultation.scheduled_datetime).toLocaleDateString()} - {consultation.status}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#6b7280' }}>No recent consultations</div>
            )}
          </div>
        </div>

        <div className="content-card">
          <div className="card-header">
            <h3><i className="bi bi-star"></i> Recent Reviews</h3>
          </div>
          <div style={{ padding: '20px' }}>
            {loading ? (
              <div>Loading...</div>
            ) : dashboardData?.reviews?.length > 0 ? (
              dashboardData.reviews.map(review => (
                <div key={review._id} style={{ padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ fontWeight: '500' }}>{review.user_id?.username}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    {[...Array(review.rating)].map((_, i) => <i key={i} className="bi bi-star-fill" style={{ color: '#fbbf24' }}></i>)}
                    <span style={{ marginLeft: '5px' }}>{review.comment?.substring(0, 50)}...</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#6b7280' }}>No recent reviews</div>
            )}
          </div>
        </div>

        <div className="content-card">
          <div className="card-header">
            <h3><i className="bi bi-bell"></i> Recent Activity</h3>
          </div>
          <div style={{ padding: '20px' }}>
            {loading ? (
              <div>Loading...</div>
            ) : dashboardData?.notifications?.length > 0 ? (
              dashboardData.notifications.map(notification => (
                <div key={notification._id} style={{ padding: '10px 0', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center' }}>
                  <div style={{ marginRight: '10px' }}>
                    <i className={`bi ${notification.type === 'booking' ? 'bi-calendar-check' : notification.type === 'review' ? 'bi-star' : 'bi-bell'}`} 
                       style={{ color: notification.type === 'booking' ? '#3b82f6' : notification.type === 'review' ? '#f59e0b' : '#6b7280' }}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{notification.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{notification.message}</div>
                    <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '2px' }}>
                      {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                <i className="bi bi-bell" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block' }}></i>
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;