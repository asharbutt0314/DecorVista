import React, { useState, useEffect } from 'react';
import '../Dashboard/Dashboard.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    designerId: '',
    rating: 5,
    comment: ''
  });
  const [designers, setDesigners] = useState([]);

  useEffect(() => {
    fetchReviews();
    fetchDesigners();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/user`, {
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

  const fetchDesigners = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/designer/all`);
      const data = await response.json();
      if (data.success) {
        setDesigners(data.designers);
      }
    } catch (error) {
      console.error('Error fetching designers:', error);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          designerId: formData.designerId,
          rating: parseInt(formData.rating),
          comment: formData.comment
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Review submitted successfully!');
        setShowForm(false);
        setFormData({ designerId: '', rating: 5, comment: '' });
        fetchReviews();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
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
            <h1>My Reviews</h1>
            <p>Share your experience with our designers</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ 
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', 
            color: 'white', 
            padding: '0.75rem 1.5rem', 
            border: 'none', 
            borderRadius: '12px', 
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Write Review
        </button>
      </div>

      {showForm && (
        <div className="content-card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h3><i className="bi bi-pencil-square"></i> Write a Review</h3>
          </div>
          <form onSubmit={submitReview}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Designer:</label>
              <select
                value={formData.designerId}
                onChange={(e) => setFormData({...formData, designerId: e.target.value})}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '12px',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select Designer</option>
                {designers.map(designer => (
                  <option key={designer._id} value={designer._id}>{designer.username}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Rating:</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '12px',
                  fontSize: '1rem'
                }}
              >
                <option value={5}>5 Stars - Excellent</option>
                <option value={4}>4 Stars - Very Good</option>
                <option value={3}>3 Stars - Good</option>
                <option value={2}>2 Stars - Fair</option>
                <option value={1}>1 Star - Poor</option>
              </select>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Comment:</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({...formData, comment: e.target.value})}
                required
                rows="4"
                placeholder="Share your experience with this designer..."
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '12px',
                  fontSize: '1rem',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={() => setShowForm(false)} 
                style={{ 
                  background: '#f3f4f6', 
                  color: '#374151', 
                  padding: '0.75rem 1.5rem', 
                  border: 'none', 
                  borderRadius: '12px', 
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                style={{ 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem', 
                  border: 'none', 
                  borderRadius: '12px', 
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="dashboard-content">
        {reviews.length === 0 ? (
          <div className="content-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ color: '#6b7280' }}>
              <i className="bi bi-star" style={{ fontSize: '4rem', marginBottom: '1.5rem', display: 'block', color: '#d1d5db' }}></i>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>No reviews yet</h3>
              <p style={{ fontSize: '1rem', margin: 0 }}>Write your first review to share your experience!</p>
            </div>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review._id} className="content-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>
                    <i className="bi bi-person-circle" style={{ marginRight: '0.5rem', color: '#6366f1' }}></i>
                    {review.designer_id?.username || 'Designer'}
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
                borderLeft: '4px solid #6366f1'
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