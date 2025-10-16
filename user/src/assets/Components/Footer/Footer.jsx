import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalDesigners, setTotalDesigners] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch products
      const productsResponse = await fetch('http://localhost:5000/api/products');
      const productsData = await productsResponse.json();
      
      if (productsData.success) {
        setTotalProducts(productsData.products.length);
      }

      // Fetch designers
      const usersResponse = await fetch('http://localhost:5000/api/auth/users');
      const usersData = await usersResponse.json();
      
      if (usersData.success) {
        const designers = usersData.users.filter(user => user.role === 'designer');
        setTotalDesigners(designers.length);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
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
            <h3>DecorVista</h3>
            <p>Transform your space with expert interior design and premium home decor products.</p>
            <div className="design-stats">
              <div className="stat-item">
                <i className="bi bi-palette-fill"></i>
                <span>Design Inspiration</span>
              </div>
              <div className="stat-item">
                <i className="bi bi-people-fill"></i>
                <span>Expert Designers</span>
              </div>
            </div>
          </div>



          <div className="footer-stats">
            <h4><i className="bi bi-heart-fill"></i> Your Journey</h4>
            <div className="progress-cards">
              <div className="progress-card">
                <div className="progress-icon">
                  <i className="bi bi-grid-3x3-gap-fill"></i>
                </div>
                <div className="progress-info">
                  <span className="progress-label">Products Available</span>
                  <span className="progress-value">{totalProducts}</span>
                  <span className="progress-text">&nbsp;Premium items</span>
                </div>
              </div>
              
              <div className="progress-card">
                <div className="progress-icon">
                  <i className="bi bi-palette-fill"></i>
                </div>
                <div className="progress-info">
                  <span className="progress-label">Expert Designers</span>
                  <span className="progress-value">{totalDesigners}</span>
                  <span className="progress-text">&nbsp;Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} DecorVista. All rights reserved.</p>
            <p>Made with <i className="bi bi-heart-fill"></i> for design enthusiasts</p>
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