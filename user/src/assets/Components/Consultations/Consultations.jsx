import React, { useState, useEffect } from 'react';
import './Consultations.css';

const Consultations = () => {
  const [activeTab, setActiveTab] = useState('my-consultations');
  const [designers, setDesigners] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    designerId: '',
    scheduledDateTime: '',
    consultationType: 'online',
    projectDetails: {
      roomType: '',
      budget: { min: '', max: '' },
      style: '',
      requirements: ''
    }
  });

  useEffect(() => {
    if (activeTab === 'book') {
      fetchDesigners();
    } else if (activeTab === 'my-consultations') {
      fetchMyConsultations();
    }
  }, [activeTab]);

  const fetchDesigners = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/users`);
      const data = await response.json();
      
      if (data.success) {
        const designerUsers = data.users.filter(user => user.role === 'designer');
        setDesigners(designerUsers);
      }
    } catch (error) {
      console.error('Error fetching designers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyConsultations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/consultations/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setConsultations(data.consultations);
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const selectedDesigner = designers.find(d => d._id === bookingForm.designerId);
      
      const newConsultation = {
        id: Date.now(),
        designerId: { username: selectedDesigner.username, _id: selectedDesigner._id },
        scheduledDateTime: bookingForm.scheduledDateTime,
        consultationType: bookingForm.consultationType,
        projectDetails: bookingForm.projectDetails,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      const existingConsultations = JSON.parse(localStorage.getItem('consultations') || '[]');
      existingConsultations.push(newConsultation);
      localStorage.setItem('consultations', JSON.stringify(existingConsultations));
      
      alert('Consultation booked successfully!');
      setBookingForm({
        designerId: '',
        scheduledDateTime: '',
        consultationType: 'online',
        projectDetails: {
          roomType: '',
          budget: { min: '', max: '' },
          style: '',
          requirements: ''
        }
      });
      setActiveTab('my-consultations');
    } catch (error) {
      console.error('Error booking consultation:', error);
      alert('Failed to book consultation');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#10b981',
      in_progress: '#3b82f6',
      completed: '#6b7280',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const roomTypes = ['living_room', 'bedroom', 'kitchen', 'bathroom', 'dining_room', 'office', 'full_home'];
  const styles = ['modern', 'traditional', 'contemporary', 'minimalist', 'rustic', 'industrial', 'scandinavian'];

  return (
    <div className="consultations-container">
      <div className="consultations-header">
        <h1>Interior Design Consultations</h1>
        <p>Connect with expert designers to transform your space</p>
      </div>

      <div className="consultations-tabs">
        <button 
          className={`tab ${activeTab === 'book' ? 'active' : ''}`}
          onClick={() => window.location.href = '/designers'}
        >
          Book New Consultation
        </button>
        <button 
          className={`tab ${activeTab === 'my-consultations' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-consultations')}
        >
          My Consultations
        </button>
      </div>

      {activeTab === 'book' && (
        <div className="booking-section">
          <div className="designers-grid">
            <h2>Choose Your Designer</h2>
            {loading ? (
              <div className="loading">Loading designers...</div>
            ) : (
              <div className="designers-list">
                {designers.map(designer => (
                  <div 
                    key={designer._id} 
                    className={`designer-card ${bookingForm.designerId === designer._id ? 'selected' : ''}`}
                    onClick={() => setBookingForm(prev => ({ ...prev, designerId: designer._id }))}
                  >
                    <div className="designer-avatar">
                      {designer.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="designer-info">
                      <h3>{designer.username}</h3>
                      <p className="specialization">
                        Modern, Contemporary
                      </p>
                      <p className="experience">
                        5+ years experience
                      </p>
                      <div className="designer-rating">
                        <i className="bi bi-star-fill" style={{color: '#fbbf24'}}></i> 4.8 
                        (12 reviews)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {bookingForm.designerId && (
            <form className="booking-form" onSubmit={handleBookingSubmit}>
              <h2>Consultation Details</h2>
              
              <div className="form-group">
                <label>Consultation Type</label>
                <select
                  value={bookingForm.consultationType}
                  onChange={(e) => setBookingForm(prev => ({ 
                    ...prev, 
                    consultationType: e.target.value 
                  }))}
                  required
                >
                  <option value="online">Online</option>
                  <option value="in_person">In Person</option>
                </select>
              </div>

              <div className="form-group">
                <label>Preferred Date & Time</label>
                <input
                  type="datetime-local"
                  value={bookingForm.scheduledDateTime}
                  onChange={(e) => setBookingForm(prev => ({ 
                    ...prev, 
                    scheduledDateTime: e.target.value 
                  }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Room Type</label>
                <select
                  value={bookingForm.projectDetails.roomType}
                  onChange={(e) => setBookingForm(prev => ({ 
                    ...prev, 
                    projectDetails: { 
                      ...prev.projectDetails, 
                      roomType: e.target.value 
                    }
                  }))}
                  required
                >
                  <option value="">Select Room</option>
                  {roomTypes.map(room => (
                    <option key={room} value={room}>
                      {room.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Preferred Style</label>
                <select
                  value={bookingForm.projectDetails.style}
                  onChange={(e) => setBookingForm(prev => ({ 
                    ...prev, 
                    projectDetails: { 
                      ...prev.projectDetails, 
                      style: e.target.value 
                    }
                  }))}
                >
                  <option value="">Select Style</option>
                  {styles.map(style => (
                    <option key={style} value={style}>
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group budget-group">
                <label>Budget Range ($)</label>
                <div className="budget-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={bookingForm.projectDetails.budget.min}
                    onChange={(e) => setBookingForm(prev => ({ 
                      ...prev, 
                      projectDetails: { 
                        ...prev.projectDetails, 
                        budget: { 
                          ...prev.projectDetails.budget, 
                          min: e.target.value 
                        }
                      }
                    }))}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={bookingForm.projectDetails.budget.max}
                    onChange={(e) => setBookingForm(prev => ({ 
                      ...prev, 
                      projectDetails: { 
                        ...prev.projectDetails, 
                        budget: { 
                          ...prev.projectDetails.budget, 
                          max: e.target.value 
                        }
                      }
                    }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Project Requirements</label>
                <textarea
                  value={bookingForm.projectDetails.requirements}
                  onChange={(e) => setBookingForm(prev => ({ 
                    ...prev, 
                    projectDetails: { 
                      ...prev.projectDetails, 
                      requirements: e.target.value 
                    }
                  }))}
                  placeholder="Describe your project requirements, preferences, and any specific needs..."
                  rows="4"
                />
              </div>

              <button type="submit" className="btn-book" disabled={loading}>
                {loading ? 'Booking...' : 'Book Consultation'}
              </button>
            </form>
          )}
        </div>
      )}

      {activeTab === 'my-consultations' && (
        <div className="consultations-list">
          <h2>My Consultations</h2>
          {loading ? (
            <div className="loading">Loading consultations...</div>
          ) : consultations.length === 0 ? (
            <div className="no-consultations">
              <h3>No consultations yet</h3>
              <p>Book your first consultation to get started</p>
              <button 
                className="btn-book-first"
                onClick={() => setActiveTab('book')}
              >
                Book Consultation
              </button>
            </div>
          ) : (
            <div className="consultations-grid">
              {consultations.map(consultation => (
                <div key={consultation._id} className="consultation-card">
                  <div className="consultation-header">
                    <h3>{consultation.designer_id?.username || 'Designer'}</h3>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(consultation.status) }}
                    >
                      {consultation.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="consultation-details">
                    <p><strong>Date:</strong> {new Date(consultation.scheduled_datetime).toLocaleString()}</p>
                    <p><strong>Type:</strong> {consultation.consultation_type}</p>
                    <p><strong>Email:</strong> {consultation.designer_id?.email}</p>
                  </div>
                  {consultation.notes && (
                    <div className="consultation-notes">
                      <strong>Notes:</strong> {consultation.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Consultations;