import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/consultations/designer`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setConsultations(data.consultations);
      }
    } catch (error) {
      // Error fetching consultations
    } finally {
      setLoading(false);
    }
  };

  const updateConsultationStatus = async (consultationId, newStatus) => {
    try {
      // Updating consultation status
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/consultations/${consultationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchConsultations();
        alert('Status updated successfully!');
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (error) {
      // Error updating consultation status
      alert('Error updating status');
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

  const filteredConsultations = consultations.filter(consultation => 
    filter === 'all' || consultation.status === filter
  );

  if (loading) {
    return (
      <div className="decorvista-dashboard">
        <div className="content-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading consultations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="decorvista-dashboard">
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <div className="welcome-icon">
            <i className="bi bi-calendar-check-fill"></i>
          </div>
          <div className="welcome-text">
            <h1>My Consultations</h1>
            <p>Manage your client consultations and appointments</p>
          </div>
        </div>
      </div>

      <div className="dashboard-stats" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: '2rem' }}>
        {['all', 'pending', 'confirmed', 'in_progress', 'completed'].map(status => (
          <div
            key={status}
            className="stat-card"
            onClick={() => setFilter(status)}
            style={{
              cursor: 'pointer',
              background: filter === status ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'white',
              color: filter === status ? 'white' : '#374151',
              padding: '1rem'
            }}
          >
            <div className="stat-icon" style={{ 
              width: '40px', 
              height: '40px', 
              fontSize: '1rem',
              background: filter === status ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
            }}>
              <i className="bi bi-calendar"></i>
            </div>
            <div className="stat-info">
              <h3 style={{ fontSize: '1.2rem' }}>{consultations.filter(c => status === 'all' || c.status === status).length}</h3>
              <p style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>{status.replace('_', ' ')}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        {filteredConsultations.length === 0 ? (
          <div className="content-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ color: '#6b7280' }}>
              <i className="bi bi-calendar-x" style={{ fontSize: '4rem', marginBottom: '1.5rem', display: 'block', color: '#d1d5db' }}></i>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>No consultations found</h3>
              <p style={{ fontSize: '1rem', margin: 0 }}>Consultations will appear here when clients book with you</p>
            </div>
          </div>
        ) : (
          filteredConsultations.map(consultation => (
            <div key={consultation._id} className="content-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>
                    <i className="bi bi-person-circle" style={{ marginRight: '0.5rem', color: '#6366f1' }}></i>
                    {consultation.user_id?.username || 'Client'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <i className="bi bi-calendar" style={{ color: '#6366f1' }}></i>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      {new Date(consultation.scheduled_datetime).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div style={{
                  background: getStatusColor(consultation.status),
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  {consultation.status.replace('_', ' ')}
                </div>
              </div>

              <div style={{ 
                background: '#f8fafc', 
                padding: '1.5rem', 
                borderRadius: '12px',
                marginBottom: '1.5rem'
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <i className="bi bi-tag" style={{ color: '#6366f1', marginRight: '0.5rem' }}></i>
                    <strong style={{ color: '#374151' }}>Type:</strong>
                    <span style={{ marginLeft: '0.5rem', color: '#6b7280' }}>
                      {consultation.consultation_type}
                    </span>
                  </div>
                </div>
                {consultation.notes && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <i className="bi bi-chat-text" style={{ color: '#6366f1', marginRight: '0.5rem' }}></i>
                      <strong style={{ color: '#374151' }}>Notes:</strong>
                    </div>
                    <p style={{ margin: 0, color: '#6b7280', lineHeight: '1.5', paddingLeft: '1.5rem' }}>
                      {consultation.notes}
                    </p>
                  </div>
                )}
              </div>

              {consultation.status === 'pending' && (
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button
                    onClick={() => updateConsultationStatus(consultation._id, 'confirmed')}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)'
                    }}
                  >
                    <i className="bi bi-check-circle" style={{ marginRight: '0.5rem' }}></i>
                    Accept
                  </button>
                  <button
                    onClick={() => updateConsultationStatus(consultation._id, 'cancelled')}
                    style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)'
                    }}
                  >
                    <i className="bi bi-x-circle" style={{ marginRight: '0.5rem' }}></i>
                    Decline
                  </button>
                </div>
              )}

              {consultation.status === 'confirmed' && (
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => updateConsultationStatus(consultation._id, 'in_progress')}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)'
                    }}
                  >
                    <i className="bi bi-play-circle" style={{ marginRight: '0.5rem' }}></i>
                    Start Consultation
                  </button>
                </div>
              )}

              {consultation.status === 'in_progress' && (
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => updateConsultationStatus(consultation._id, 'completed')}
                    style={{
                      background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      boxShadow: '0 4px 14px 0 rgba(107, 114, 128, 0.39)'
                    }}
                  >
                    <i className="bi bi-check2-circle" style={{ marginRight: '0.5rem' }}></i>
                    Mark Complete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Consultations;