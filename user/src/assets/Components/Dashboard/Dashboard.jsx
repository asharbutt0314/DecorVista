import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalDesigners: 0,
    myConsultations: 0,

    totalReviews: 0,
    totalOrders: 0,
    unreadNotifications: 0
  });
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (dashboardData) {
      fetchDashboardStats();
    }
  }, [dashboardData]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/dashboard/user', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data);
        setStats(prev => ({
          ...prev,
          myConsultations: data.data.stats.totalConsultations,
          totalReviews: data.data.stats.totalReviews,
          pendingOrders: data.data.stats.pendingOrders,
          unreadNotifications: data.data.stats.unreadNotifications
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      setStats(prev => ({
        ...prev,
        currentWeight: parsedUser.weight || 0
      }));
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const productsResponse = await fetch('http://localhost:5000/api/products');
      const productsData = await productsResponse.json();
      let totalProducts = 0;
      if (productsData.success) {
        totalProducts = productsData.products.length;
      }

      const usersResponse = await fetch('http://localhost:5000/api/auth/users');
      const usersData = await usersResponse.json();
      let totalDesigners = 0;
      if (usersData.success) {
        const designers = usersData.users.filter(user => user.role === 'designer');
        totalDesigners = designers.length;
      }

      setStats(prev => ({
        ...prev,
        totalProducts,
        totalDesigners
      }));
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  return (
    <div className="decorvista-dashboard">
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <div className="welcome-icon">
            <i className="bi bi-house-heart-fill"></i>
          </div>
          <div className="welcome-text">
            <h1>Welcome Back{user ? `, ${user.username}` : ''}!</h1>
            <p>Ready to transform your space today?</p>
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card" onClick={() => navigate('/products')} style={{cursor: 'pointer'}}>
          <div className="stat-icon products">
            <i className="bi bi-grid-3x3-gap-fill"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalProducts}</h3>
            <p>Products Available</p>
          </div>
        </div>
        

        <div className="stat-card" onClick={() => navigate('/consultations')} style={{cursor: 'pointer'}}>
          <div className="stat-icon consultations">
            <i className="bi bi-calendar-check-fill"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.myConsultations}</h3>
            <p>My Consultations</p>
          </div>
        </div>
        
        <div className="stat-card" onClick={() => navigate('/reviews')} style={{cursor: 'pointer'}}>
          <div className="stat-icon saved">
            <i className="bi bi-star-fill"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalReviews}</h3>
            <p>New Reviews</p>
          </div>
        </div>
        
        <div className="stat-card" onClick={() => navigate('/orders')} style={{cursor: 'pointer'}}>
          <div className="stat-icon orders">
            <i className="bi bi-cart-fill"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.pendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
        </div>
        
        <div className="stat-card" onClick={() => navigate('/notifications')} style={{cursor: 'pointer'}}>
          <div className="stat-icon notifications">
            <i className="bi bi-bell-fill"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.unreadNotifications}</h3>
            <p>Unread Notifications</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-card">
          <div className="card-header">
            <h3><i className="bi bi-calendar-check"></i> Recent Consultations</h3>
          </div>
          <div className="profile-summary" style={{ padding: '20px' }}>
            {loading ? (
              <div>Loading...</div>
            ) : dashboardData?.consultations?.length > 0 ? (
              dashboardData.consultations.map(consultation => (
                <div key={consultation._id} style={{ padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ fontWeight: '500' }}>{consultation.designer_id?.username}</div>
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
          <div className="profile-summary" style={{ padding: '20px' }}>
            {loading ? (
              <div>Loading...</div>
            ) : dashboardData?.reviews?.length > 0 ? (
              dashboardData.reviews.map(review => (
                <div key={review._id} style={{ padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ fontWeight: '500' }}>{review.designer_id?.username}</div>
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
          <div className="profile-summary" style={{ padding: '20px' }}>
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

        <div className="content-card">
          <div className="card-header">
            <h3><i className="bi bi-person-fill"></i> Your Profile</h3>
          </div>
          <div className="profile-summary" style={{ padding: '20px', lineHeight: '1.8' }}>
            {user && (
              <>
                <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '500', color: '#374151' }}>Username:</span>
                  <span style={{ color: '#1f2937' }}>{user.username || 'Not set'}</span>
                </div>
                <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '500', color: '#374151' }}>Email:</span>
                  <span style={{ color: '#1f2937' }}>{user.email || 'Not set'}</span>
                </div>
                <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '500', color: '#374151' }}>Gender:</span>
                  <span style={{ color: '#1f2937' }}>{user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not set'}</span>
                </div>
                <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '500', color: '#374151' }}>Role:</span>
                  <span style={{ color: '#1f2937' }}>{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Homeowner'}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="content-card">
          <div className="card-header">
            <h3><i className="bi bi-lightbulb-fill"></i> Design Preferences</h3>
          </div>
          <div className="goals-summary" style={{ padding: '20px' }}>
            {user && (
              <>
                <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #e5e7eb' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>Favorite Styles</h4>
                  <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>Modern, Contemporary, Minimalist</p>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>Interested Rooms</h4>
                  <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>Living Room, Bedroom, Kitchen</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="content-card">
          <div className="card-header">
            <h3><i className="bi bi-calendar-check"></i> Quick Actions</h3>
          </div>
          <div className="actions-summary" style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div 
              onClick={() => navigate('/profile')}
              style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f9fafb'}
            >
              <i className="bi bi-pencil-square" style={{ marginRight: '10px', color: '#4f46e5', fontSize: '18px' }}></i>
              <span style={{ color: '#374151', fontWeight: '500' }}>Update Profile</span>
            </div>
            <div 
              onClick={() => navigate('/products')}
              style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f9fafb'}
            >
              <i className="bi bi-grid-3x3-gap-fill" style={{ marginRight: '10px', color: '#10b981', fontSize: '18px' }}></i>
              <span style={{ color: '#374151', fontWeight: '500' }}>Browse Products</span>
            </div>
            <div 
              onClick={() => navigate('/inspiration')}
              style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f9fafb'}
            >
              <i className="bi bi-lightbulb-fill" style={{ marginRight: '10px', color: '#f59e0b', fontSize: '18px' }}></i>
              <span style={{ color: '#374151', fontWeight: '500' }}>Get Inspired</span>
            </div>
            <div 
              onClick={() => navigate('/consultations')}
              style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f9fafb'}
            >
              <i className="bi bi-calendar-check-fill" style={{ marginRight: '10px', color: '#ef4444', fontSize: '18px' }}></i>
              <span style={{ color: '#374151', fontWeight: '500' }}>Book Consultation</span>
            </div>
            <div 
              onClick={() => navigate('/reviews')}
              style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f9fafb'}
            >
              <i className="bi bi-star-fill" style={{ marginRight: '10px', color: '#f59e0b', fontSize: '18px' }}></i>
              <span style={{ color: '#374151', fontWeight: '500' }}>Write Review</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;