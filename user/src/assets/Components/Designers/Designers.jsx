import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Designers.css';

const Designers = () => {
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState({});
  const [portfolios, setPortfolios] = useState({});
  const [availabilities, setAvailabilities] = useState({});
  const [selectedDesigner, setSelectedDesigner] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    consultationType: 'online',
    projectDetails: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDesigners();
  }, []);

  const fetchDesigners = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/designer/all`);
      const data = await response.json();
      
      if (data.success) {
        setDesigners(data.designers);
        
        // Fetch additional data for each designer
        data.designers.forEach(designer => {
          fetchDesignerReviews(designer._id);
          fetchDesignerPortfolio(designer._id);
          fetchDesignerAvailability(designer._id);
        });
      }
    } catch (error) {
      console.error('Error fetching designers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDesignerReviews = async (designerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/designer/${designerId}`);
      const data = await response.json();
      if (data.success) {
        setReviews(prev => ({ ...prev, [designerId]: data.reviews }));
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchDesignerPortfolio = async (designerId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/designers/portfolio/${designerId}`);
      const data = await response.json();
      if (data.success) {
        setPortfolios(prev => ({ ...prev, [designerId]: data.portfolio || [] }));
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const fetchDesignerAvailability = async (designerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/availability/designer/${designerId}`);
      const data = await response.json();
      if (data.success) {
        const openSlots = data.availability.filter(slot => slot.status === 'open');
        setAvailabilities(prev => ({ ...prev, [designerId]: openSlots }));
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const getDesignerStats = (designerId) => {
    const designerReviews = reviews[designerId] || [];
    const designerPortfolio = portfolios[designerId] || [];
    const designerAvailability = availabilities[designerId] || [];
    
    const avgRating = designerReviews.length > 0 
      ? (designerReviews.reduce((sum, review) => sum + review.rating, 0) / designerReviews.length).toFixed(1)
      : 'New';
    
    return {
      reviews: designerReviews.length,
      portfolio: designerPortfolio.length,
      availability: designerAvailability.length,
      avgRating
    };
  };

  const handleBookConsultation = (designer) => {
    setSelectedDesigner(designer);
    setShowBookingModal(true);
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const scheduledDateTime = new Date(`${bookingData.date}T${bookingData.time}:00`);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          designerId: selectedDesigner._id,
          scheduledDateTime,
          consultationType: bookingData.consultationType,
          projectDetails: bookingData.projectDetails
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert('Server error occurred');
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        alert('Consultation booked successfully!');
        setShowBookingModal(false);
        setBookingData({ date: '', time: '', consultationType: 'online', projectDetails: '' });
      } else {
        alert(data.message || 'Failed to book consultation');
      }
    } catch (error) {
      alert('Failed to book consultation');
    }
  };

  if (loading) {
    return (
      <div className="designers-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading designers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="designers-page">
      <div className="designers-header">
        <h1>Expert Interior Designers</h1>
        <p>Connect with professional designers to transform your space</p>
      </div>

      <div className="designers-grid">
        {designers.length === 0 ? (
          <div className="no-designers">
            <i className="bi bi-people"></i>
            <h3>No designers available</h3>
            <p>Check back later for expert designers</p>
          </div>
        ) : (
          designers.map((designer) => (
            <div key={designer._id} className="designer-card">
              <div className="designer-avatar">
                {designer.username.charAt(0).toUpperCase()}
              </div>
              <div className="designer-info">
                <h3>{designer.username}</h3>
                <p className="designer-email">{designer.email}</p>
                <div className="designer-stats">
                  <div className="stat">
                    <i className="bi bi-chat-dots-fill"></i>
                    <span>{getDesignerStats(designer._id).reviews} Reviews</span>
                  </div>
                  <div className="stat">
                    <i className="bi bi-images"></i>
                    <span>{getDesignerStats(designer._id).portfolio} Projects</span>
                  </div>
                  <div className="stat">
                    <i className="bi bi-calendar-check"></i>
                    <span>{getDesignerStats(designer._id).availability} Available</span>
                  </div>
                </div>
                {reviews[designer._id] && reviews[designer._id].length > 0 && (
                  <div className="recent-reviews">
                    <h4>Recent Reviews:</h4>
                    {reviews[designer._id].slice(0, 2).map((review, index) => (
                      <div key={index} className="review-item">
                        <div className="review-header">
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`bi bi-star${i < review.rating ? '-fill' : ''}`}></i>
                            ))}
                          </div>
                          <span className="review-author">{review.user_id?.username || 'Anonymous'}</span>
                        </div>
                        <p className="review-text">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="designer-specialties">
                  <span className="specialty">Modern</span>
                  <span className="specialty">Contemporary</span>
                </div>
              </div>
              <div className="designer-actions">
                <button 
                  className="btn-view-profile"
                  onClick={() => navigate(`/designer/${designer._id}`)}
                >
                  View Profile
                </button>
                <button 
                  className="btn-book-consultation"
                  onClick={() => handleBookConsultation(designer)}
                >
                  Book Consultation
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showBookingModal && (
        <div className="modal-overlay">
          <div className="booking-modal">
            <div className="modal-header">
              <h3>Book Consultation with {selectedDesigner?.username}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowBookingModal(false)}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
            <form onSubmit={submitBooking} className="booking-form">
              <div className="form-group">
                <label>Preferred Date</label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label>Preferred Time</label>
                <select
                  value={bookingData.time}
                  onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                  required
                >
                  <option value="">Select time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>
              <div className="form-group">
                <label>Consultation Type</label>
                <select
                  value={bookingData.consultationType}
                  onChange={(e) => setBookingData({...bookingData, consultationType: e.target.value})}
                  required
                >
                  <option value="online">Online Consultation</option>
                  <option value="in_person">In-Person Consultation</option>
                </select>
              </div>
              <div className="form-group">
                <label>Project Details</label>
                <textarea
                  value={bookingData.projectDetails}
                  onChange={(e) => setBookingData({...bookingData, projectDetails: e.target.value})}
                  placeholder="Tell the designer about your project requirements..."
                  rows="4"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowBookingModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Book Consultation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Designers;