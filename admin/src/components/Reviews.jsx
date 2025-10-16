import React, { useState, useEffect } from 'react';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 404) {
        console.warn('Reviews API endpoint not found on backend');
        setReviews([]);
        return;
      }
      
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          alert('Review deleted successfully!');
          fetchReviews();
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Error deleting review');
      }
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`bi ${i < rating ? 'bi-star-fill' : 'bi-star'}`}
        style={{ color: i < rating ? '#ffc107' : '#e9ecef' }}
      ></i>
    ));
  };

  const filteredReviews = reviews.filter(review =>
    review.product?.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <>
      <div className="admin-dashboard">
        <div className="admin-header">
          <div className="header-content">
            <div className="header-icon">
              <i className="bi bi-star-fill"></i>
            </div>
            <h1>Reviews & Ratings</h1>
            <p>Monitor and manage customer reviews</p>
          </div>
        </div>

        <div className="admin-actions mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="bi bi-star me-2"></i>
                  Reviews & Ratings
                </h4>
              </div>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search reviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <h6 className="text-muted mt-2">Total Reviews: {filteredReviews.length}</h6>
                </div>
              </div>

              {filteredReviews.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-chat-square-text display-1 text-muted"></i>
                  <h5 className="mt-3 text-muted">No reviews found</h5>
                </div>
              ) : (
                <div className="row">
                  {filteredReviews.map((review) => (
                    <div key={review._id} className="col-md-6 col-lg-4 mb-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="d-flex align-items-center">
                              <div className="avatar-circle bg-primary text-white me-2">
                                {review.user?.username?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <div>
                                <h6 className="mb-0">{review.user?.username || 'Anonymous'}</h6>
                                <small className="text-muted">
                                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'N/A'}
                                </small>
                              </div>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteReview(review._id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                          
                          <div className="mb-2">
                            {renderStars(review.rating || 0)}
                            <span className="ms-2 text-muted">({review.rating || 0}/5)</span>
                          </div>
                          
                          <h6 className="text-primary mb-2">
                            {review.product?.productName || 'Product N/A'}
                          </h6>
                          
                          <p className="card-text text-muted">
                            {review.comment || 'No comment provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .avatar-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }
      `}</style>
    </>
  );
};

export default Reviews;