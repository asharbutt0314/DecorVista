import React from 'react';
  
const Footer = () => {
  return (
    <footer className="designer-footer">
      <div className="footer-background">
        <div className="decorvista-shape shape-1"></div>
        <div className="decorvista-shape shape-2"></div>
        <div className="decorvista-shape shape-3"></div>
      </div>
      
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-logo">
              <i className="bi bi-palette-fill"></i>
            </div>
            <h3>DecorVista Designer</h3>
            <p>Empowering interior designers to showcase their creativity and connect with clients worldwide.</p>
            
            <div className="design-stats">
              <div className="stat-item">
                <i className="bi bi-palette"></i>
                <span>Creative Tools</span>
              </div>
              <div className="stat-item">
                <i className="bi bi-people"></i>
                <span>Client Connect</span>
              </div>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4><i className="bi bi-grid-3x3-gap"></i> Designer Panel</h4>
              <a href="/"><i className="bi bi-house-door"></i> Dashboard</a>
              <a href="/portfolio"><i className="bi bi-palette"></i> Portfolio</a>
              <a href="/consultations"><i className="bi bi-chat-dots"></i> Consultations</a>
              <a href="/profile"><i className="bi bi-person-circle"></i> Profile</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>Made with <i className="bi bi-heart-fill"></i> for Interior Designers</p>
            <p>&copy; 2024 DecorVista Designer Panel. All rights reserved.</p>
          </div>
          
          <div className="footer-tech">
            <span>Built with</span>
            <div className="tech-badges">
              <span className="tech-badge">React</span>
              <span className="tech-badge">Node.js</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;