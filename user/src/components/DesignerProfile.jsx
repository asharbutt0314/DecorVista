import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DesignerProfile = () => {
  const { designerId } = useParams();
  const navigate = useNavigate();
  const [designer, setDesigner] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDesignerData();
  }, [designerId]);

  const fetchDesignerData = async () => {
    try {
      // Fetch designer info
  const designerResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/designer/${designerId}`);
      const designerData = await designerResponse.json();
      
      if (designerData.success) {
        setDesigner(designerData.designer);
      }

      // Fetch designer portfolio
  const portfolioResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/designers/portfolio/${designerId}`);
      const portfolioData = await portfolioResponse.json();
      
      if (portfolioData.success) {
        setPortfolio(portfolioData.portfolio || []);
      }

      // Fetch designer availability
      console.log('Fetching availability for designer:', designerId);
  const availabilityResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/availability/designer/${designerId}`);
      console.log('Availability response status:', availabilityResponse.status);
      const availabilityData = await availabilityResponse.json();
      console.log('Availability data:', availabilityData);
      
      if (availabilityData.success) {
        const openSlots = availabilityData.availability.filter(slot => slot.status === 'open').slice(0, 8);
        console.log('Open slots:', openSlots);
        setAvailability(openSlots);
      }

      // Fetch designer reviews
  const reviewsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/designer/${designerId}`);
      const reviewsData = await reviewsResponse.json();
      
      if (reviewsData.success) {
        setReviews(reviewsData.reviews.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching designer data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div>Loading designer profile...</div>
      </div>
    );
  }

  if (!designer) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Designer not found</h2>
        <button onClick={() => navigate('/designers')} className="btn-primary">
          Back to Designers
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/designers')} 
        style={{ 
          background: 'none', 
          border: '1px solid #6366f1', 
          color: '#6366f1', 
          padding: '0.5rem 1rem', 
          borderRadius: '8px',
          marginBottom: '2rem',
          cursor: 'pointer'
        }}
      >
        ← Back to Designers
      </button>

      <div style={{ 
        background: 'white', 
        borderRadius: '20px', 
        padding: '2rem', 
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            color: 'white',
            fontWeight: 'bold'
          }}>
            {designer.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>{designer.username}</h1>
            <p style={{ color: '#64748b', margin: '0 0 1rem 0' }}>{designer.email}</p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ 
                background: '#f1f5f9', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '20px', 
                fontSize: '0.875rem',
                color: '#475569'
              }}>
                <i className="bi bi-chat-dots-fill" style={{ color: '#3b82f6', marginRight: '0.25rem' }}></i>
                {reviews.length} Reviews
              </span>
              <span style={{ 
                background: '#f1f5f9', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '20px', 
                fontSize: '0.875rem',
                color: '#475569'
              }}>
                <i className="bi bi-images" style={{ marginRight: '0.25rem' }}></i>
                {portfolio.length} Projects
              </span>
              <span style={{ 
                background: '#f1f5f9', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '20px', 
                fontSize: '0.875rem',
                color: '#475569'
              }}>
                <i className="bi bi-calendar-check" style={{ marginRight: '0.25rem' }}></i>
                {availability.length} Available Slots
              </span>
              {designer.specialization && (
                <span style={{ 
                  background: '#6366f1', 
                  color: 'white',
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '20px', 
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  <i className="bi bi-house-door" style={{ marginRight: '0.25rem' }}></i>
                  {designer.specialization.charAt(0).toUpperCase() + designer.specialization.slice(1)}
                </span>
              )}
              {designer.yearsofexperience > 0 && (
                <span style={{ 
                  background: '#f59e0b', 
                  color: 'white',
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '20px', 
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  <i className="bi bi-award" style={{ marginRight: '0.25rem' }}></i>
                  {designer.yearsofexperience} Years Experience
                </span>
              )}
              {designer.hourlyRate > 0 && (
                <span style={{ 
                  background: '#10b981', 
                  color: 'white',
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '20px', 
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  <i className="bi bi-currency-dollar" style={{ marginRight: '0.25rem' }}></i>
                  ${designer.hourlyRate}/hr
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {(designer.specialization || designer.yearsofexperience > 0 || designer.hourlyRate > 0 || designer.portfolio) && (
        <div style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '2rem', 
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Professional Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {designer.specialization && (
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <i className="bi bi-house-door" style={{ color: '#6366f1', marginRight: '0.5rem', fontSize: '1.2rem' }}></i>
                  <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1rem' }}>Specialization</h3>
                </div>
                <p style={{ margin: 0, color: '#64748b', fontWeight: '600' }}>
                  {designer.specialization.charAt(0).toUpperCase() + designer.specialization.slice(1)} Design
                </p>
              </div>
            )}
            {designer.yearsofexperience > 0 && (
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <i className="bi bi-award" style={{ color: '#f59e0b', marginRight: '0.5rem', fontSize: '1.2rem' }}></i>
                  <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1rem' }}>Experience</h3>
                </div>
                <p style={{ margin: 0, color: '#64748b', fontWeight: '600' }}>
                  {designer.yearsofexperience} {designer.yearsofexperience === 1 ? 'Year' : 'Years'}
                </p>
              </div>
            )}
            {designer.hourlyRate > 0 && (
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <i className="bi bi-currency-dollar" style={{ color: '#10b981', marginRight: '0.5rem', fontSize: '1.2rem' }}></i>
                  <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1rem' }}>Hourly Rate</h3>
                </div>
                <p style={{ margin: 0, color: '#64748b', fontWeight: '600' }}>
                  ${designer.hourlyRate} per hour
                </p>
              </div>
            )}
            {designer.portfolio && (
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <i className="bi bi-briefcase" style={{ color: '#8b5cf6', marginRight: '0.5rem', fontSize: '1.2rem' }}></i>
                  <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1rem' }}>Portfolio</h3>
                </div>
                <p style={{ margin: 0, color: '#64748b', fontWeight: '600' }}>
                  {designer.portfolio}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ 
        background: 'white', 
        borderRadius: '20px', 
        padding: '2rem', 
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Available Time Slots</h2>
        
        <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>Debug: Found {availability.length} available slots</div>
        {availability.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            <i className="bi bi-calendar-x" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block' }}></i>
            <p>No available time slots at the moment</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            {availability.map((slot) => (
              <div key={slot._id} style={{
                background: '#f0f9ff',
                border: '1px solid #0ea5e9',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <div style={{ fontWeight: '600', color: '#0c4a6e', marginBottom: '0.5rem' }}>
                  {new Date(slot.available_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div style={{ color: '#0369a1', fontSize: '0.9rem' }}>
                  {slot.start_time} - {slot.end_time}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: '20px', 
        padding: '2rem', 
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Client Reviews</h2>
        
        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            <i className="bi bi-chat-dots" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block' }}></i>
            <p>No reviews yet</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {reviews.map((review) => (
              <div key={review._id} style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                      {review.user_id?.username || 'Anonymous'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div>
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`bi bi-star${i < review.rating ? '-fill' : ''}`} style={{ color: '#fbbf24' }}></i>
                        ))}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>({review.rating}/5)</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ margin: 0, color: '#374151', lineHeight: '1.5' }}>
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: '20px', 
        padding: '2rem', 
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Portfolio</h2>
        
        {portfolio.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <i className="bi bi-images" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
            <h3>No portfolio items yet</h3>
            <p>This designer hasn't added any projects to their portfolio.</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {portfolio.map((project) => (
              <div key={project._id} style={{
                background: '#f8fafc',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease'
              }}>
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img 
                    src={project.image_url} 
                    alt={project.project_title}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                  />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.125rem' }}>
                      {project.project_title}
                    </h3>
                    <span style={{
                      background: '#6366f1',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {project.category.replace('_', ' ')}
                    </span>
                  </div>
                  <p style={{ color: '#64748b', margin: 0, lineHeight: '1.5' }}>
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignerProfile;