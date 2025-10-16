import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
      const data = await response.json();
      if (data.success) {
        setTotalUsers(data.users.length);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <footer className="decorvista-footer">
      <div className="footer-background">
        <div className="decorative-shape shape-1"></div>
        <div className="decorative-shape shape-2"></div>
        <div className="decorative-shape shape-3"></div>
      </div>
      
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-logo">
              <i className="bi bi-house-heart-fill"></i>
            </div>
            <h3 className='color-white'>DecorVista Admin</h3>
            <p>Manage your interior design platform with comprehensive admin tools and analytics.</p>
            <div className="design-stats">
              <div className="stat-item">
                <i className="bi bi-people-fill"></i>
                <span>User Management</span>
              </div>
              <div className="stat-item">
                <i className="bi bi-palette-fill"></i>
                <span>Design Control</span>
              </div>
            </div>
          </div>

          <div className="footer-stats">
            <h4><i className="bi bi-speedometer2"></i> System Status</h4>
            <div className="progress-cards">
              <div className="progress-card">
                <div className="progress-icon">
                  <i className="bi bi-server"></i>
                </div>
                <div className="progress-info">
                  <span className="progress-label">Server Status</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '100%'}}></div>
                  </div>
                  <span className="progress-text">Online</span>
                </div>
              </div>
              
              <div className="progress-card">
                <div className="progress-icon">
                  <i className="bi bi-people"></i>
                </div>
                <div className="progress-info">
                  <span className="progress-label">Active Users</span>
                  <span className="progress-value">{totalUsers}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} DecorVista Admin Panel. All rights reserved.</p>
            <p>Made with <i className="bi bi-heart-fill"></i> for design management</p>
          </div>
          <div className="footer-tech">
            <span>Powered by</span>
            <div className="tech-badges">
              <span className="tech-badge">React</span>
              <span className="tech-badge">Node.js</span>
              <span className="tech-badge">MongoDB</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;