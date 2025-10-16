import React, { useState, useEffect } from 'react';
import { sampleProjects } from '../data/samplePortfolio';
import './Dashboard.css';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    project_title: '',
    description: '',
    image_url: '',
    category: ''
  });

  const categories = ['living_room', 'bedroom', 'kitchen', 'bathroom', 'office'];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        setProjects(sampleProjects);
        return;
      }
      
      const user = JSON.parse(userStr);
      const designerId = user._id || user.id;
      
      if (!designerId) {
        setProjects(sampleProjects);
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/designers/portfolio/${designerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        setProjects(data.portfolio || []);
      } else {
        setProjects(sampleProjects);
      }
    } catch (error) {
      setProjects(sampleProjects);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        alert('Please login again');
        return;
      }
      
      const user = JSON.parse(userStr);
      const designerId = user._id || user.id;
      
      if (!designerId) {
        alert('Designer ID not found. Please login again.');
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/designers/portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          designer_id: designerId
        })
      });

      const data = await response.json();
      if (data.success) {
        setProjects([data.portfolio, ...projects]);
        setShowModal(false);
        setFormData({ project_title: '', description: '', image_url: '', category: '' });
        alert('Project added successfully!');
      } else {
        alert(data.message || 'Failed to add project');
      }
    } catch (error) {
      // Error adding project
      alert('Error adding project');
    }
  };

  const deleteProject = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/designers/portfolio/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setProjects(projects.filter(p => p._id !== id));
          alert('Project deleted successfully!');
        } else {
          alert('Failed to delete project');
        }
      } catch (error) {
        // Error deleting project
        alert('Error deleting project');
      }
    }
  };

  return (
    <div className="decorvista-dashboard">
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <div className="welcome-icon">
            <i className="bi bi-images"></i>
          </div>
          <div className="welcome-text">
            <h1>My Portfolio</h1>
            <p>Showcase your interior design projects and creativity</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        <button 
          onClick={() => setShowModal(true)}
          style={{ 
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', 
            color: 'white', 
            padding: '0.75rem 1.5rem', 
            border: 'none', 
            borderRadius: '12px', 
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)'
          }}
        >
          <i className="bi bi-plus-circle" style={{ marginRight: '0.5rem' }}></i>
          Add Project
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {projects.length === 0 ? (
          <div className="content-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ color: '#6b7280' }}>
              <i className="bi bi-images" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block', color: '#d1d5db' }}></i>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>No Projects Yet</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Start building your portfolio</p>
              <button 
                onClick={() => setShowModal(true)}
                style={{ 
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', 
                  color: 'white', 
                  padding: '0.6rem 1.2rem', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                <i className="bi bi-plus-circle" style={{ marginRight: '0.4rem' }}></i>
                Add Project
              </button>
            </div>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project._id} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                <img 
                  src={project.image_url} 
                  alt={project.project_title}
                  style={{ 
                    width: '100%', 
                    height: '120px', 
                    objectFit: 'cover', 
                    borderRadius: '8px'
                  }}
                />
                <button 
                  onClick={() => deleteProject(project._id)}
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    background: 'rgba(239, 68, 68, 0.9)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem'
                  }}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#1e293b', lineHeight: '1.2' }}>
                    {project.project_title}
                  </h3>
                  <span style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    {project.category.replace('_', ' ')}
                  </span>
                </div>
                <p style={{ 
                  margin: 0, 
                  color: '#64748b', 
                  fontSize: '0.8rem', 
                  lineHeight: '1.3',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {project.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="content-card" style={{ width: '500px', maxWidth: '90vw' }}>
            <div className="card-header">
              <h3><i className="bi bi-plus-circle"></i> Add New Project</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Project Title:</label>
                <input
                  type="text"
                  placeholder="Enter project title"
                  value={formData.project_title}
                  onChange={(e) => setFormData({...formData, project_title: e.target.value})}
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
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Description:</label>
                <textarea
                  placeholder="Describe your project"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows="4"
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
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Image URL:</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
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
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Category:</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '2px solid #e5e7eb', 
                    borderRadius: '12px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
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
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;