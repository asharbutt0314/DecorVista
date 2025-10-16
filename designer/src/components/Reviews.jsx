import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDesignerReviews();
  }, []);

  const fetchDesignerReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/my-designer-reviews`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="decorvista-dashboard">
        <div className="content-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="decorvista-dashboard">
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <div className="welcome-icon">
            <i className="bi bi-star-fill"></i>
          </div>
          <div className="welcome-text">
            <h1>Client Reviews</h1>
            <p>See what your clients are saying about your work</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {reviews.length === 0 ? (
          <div className="content-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ color: '#6b7280' }}>
              <i className="bi bi-star" style={{ fontSize: '4rem', marginBottom: '1.5rem', display: 'block', color: '#d1d5db' }}></i>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>No reviews yet</h3>
              <p style={{ fontSize: '1rem', margin: 0 }}>Complete your first consultation to receive reviews!</p>
            </div>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review._id} className="content-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>
                    <i className="bi bi-person-circle" style={{ marginRight: '0.5rem', color: '#6366f1' }}></i>
                    {review.user_id?.username || 'Client'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div>
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`bi bi-star${i < review.rating ? '-fill' : ''}`} style={{ color: '#fbbf24', fontSize: '1.1rem' }}></i>
                      ))}
                    </div>
                    <span style={{ fontWeight: '600', color: '#6366f1' }}>({review.rating}/5)</span>
                  </div>
                </div>
                <div style={{ 
                  background: '#f8fafc', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#64748b',
                  fontWeight: '500'
                }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div style={{ 
                background: '#f8fafc', 
                padding: '1.5rem', 
                borderRadius: '12px',
                borderLeft: '4px solid #6366f1',
                marginBottom: '1.5rem'
              }}>
                <p style={{ margin: 0, color: '#374151', fontSize: '1rem', lineHeight: '1.6' }}>
                  <i className="bi bi-quote" style={{ color: '#6366f1', marginRight: '0.5rem' }}></i>
                  {review.comment}
                </p>
              </div>
              

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;