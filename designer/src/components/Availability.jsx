import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Availability = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    available_date: '',
    start_time: '',
    end_time: ''
  });
  const [weeklyAvailability, setWeeklyAvailability] = useState({
    selectedDays: [],
    start_time: '',
    end_time: ''
  });
  const [showWeeklyForm, setShowWeeklyForm] = useState(false);

  const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/availability`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAvailability(data.availability);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAvailability = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        alert('Availability added successfully!');
        setFormData({ available_date: '', start_time: '', end_time: '' });
        fetchAvailability();
      }
    } catch (error) {
      console.error('Error adding availability:', error);
    }
  };

  const addWeeklyAvailability = async (e) => {
    e.preventDefault();
    if (weeklyAvailability.selectedDays.length !== 4) {
      alert('Please select exactly 4 days for weekly availability');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const today = new Date();
      const promises = [];
      
      // Add availability for next 4 weeks
      for (let week = 0; week < 4; week++) {
        weeklyAvailability.selectedDays.forEach(day => {
          const dayIndex = daysOfWeek.findIndex(d => d.value === day);
          const date = new Date(today);
          date.setDate(today.getDate() + (week * 7) + (dayIndex - today.getDay() + 7) % 7);
          
          promises.push(
            fetch(`${import.meta.env.VITE_API_URL}/api/availability`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                available_date: date.toISOString().split('T')[0],
                start_time: weeklyAvailability.start_time,
                end_time: weeklyAvailability.end_time
              })
            })
          );
        });
      }
      
      await Promise.all(promises);
      alert('Weekly availability added successfully!');
      setWeeklyAvailability({ selectedDays: [], start_time: '', end_time: '' });
      setShowWeeklyForm(false);
      fetchAvailability();
    } catch (error) {
      console.error('Error adding weekly availability:', error);
    }
  };

  const handleDaySelection = (day) => {
    const selected = weeklyAvailability.selectedDays;
    if (selected.includes(day)) {
      setWeeklyAvailability({
        ...weeklyAvailability,
        selectedDays: selected.filter(d => d !== day)
      });
    } else if (selected.length < 4) {
      setWeeklyAvailability({
        ...weeklyAvailability,
        selectedDays: [...selected, day]
      });
    }
  };

  if (loading) {
    return (
      <div className="decorvista-dashboard">
        <div className="content-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading availability...</p>
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
            <h1>Manage Availability</h1>
            <p>Set your weekly schedule for client consultations</p>
          </div>
        </div>
      </div>

      <div className="content-card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3><i className="bi bi-calendar-plus"></i> Set Weekly Availability (4 Days)</h3>
        </div>
        <div style={{ padding: '1.5rem' }}>

          <form onSubmit={addWeeklyAvailability}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#374151' }}>Select 4 Days (Next 4 weeks):</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
                {daysOfWeek.map(day => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => handleDaySelection(day.value)}
                    style={{
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      background: weeklyAvailability.selectedDays.includes(day.value) ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'white',
                      color: weeklyAvailability.selectedDays.includes(day.value) ? 'white' : '#374151',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              <div style={{ 
                marginTop: '0.75rem', 
                padding: '0.5rem 1rem', 
                background: '#f8fafc', 
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#64748b'
              }}>
                Selected: {weeklyAvailability.selectedDays.length}/4 days
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Start Time:</label>
                <input
                  type="time"
                  value={weeklyAvailability.start_time}
                  onChange={(e) => setWeeklyAvailability({...weeklyAvailability, start_time: e.target.value})}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '2px solid #e5e7eb', 
                    borderRadius: '12px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>End Time:</label>
                <input
                  type="time"
                  value={weeklyAvailability.end_time}
                  onChange={(e) => setWeeklyAvailability({...weeklyAvailability, end_time: e.target.value})}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '2px solid #e5e7eb', 
                    borderRadius: '12px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button 
                type="submit" 
                style={{ 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                  color: 'white', 
                  padding: '0.75rem 2rem', 
                  border: 'none', 
                  borderRadius: '12px', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)'
                }}
              >
                <i className="bi bi-calendar-plus" style={{ marginRight: '0.5rem' }}></i>
                Add Weekly Availability
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="content-card">
        <div className="card-header">
          <h3><i className="bi bi-calendar-week"></i> Current Availability</h3>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {availability.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6b7280' }}>
              <i className="bi bi-calendar-x" style={{ fontSize: '4rem', marginBottom: '1.5rem', display: 'block', color: '#d1d5db' }}></i>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>No availability slots</h3>
              <p style={{ fontSize: '1rem', margin: 0 }}>Add your weekly availability to start receiving bookings</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {availability.map(slot => (
                <div key={slot._id} className="workout-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                      <i className="bi bi-calendar-date" style={{ marginRight: '0.5rem', color: '#6366f1' }}></i>
                      {new Date(slot.available_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                      <i className="bi bi-clock" style={{ marginRight: '0.5rem' }}></i> 
                      {slot.start_time} - {slot.end_time}
                    </div>
                  </div>
                  <span style={{ 
                    padding: '0.5rem 1rem', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    background: slot.status === 'open' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                               slot.status === 'booked' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 
                               'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {slot.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Availability;