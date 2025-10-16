import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'bi-house-door-fill' },
    { path: '/portfolio', label: 'Portfolio', icon: 'bi-palette-fill' },
    { path: '/availability', label: 'Availability', icon: 'bi-calendar-check-fill' },
    { path: '/consultations', label: 'Consultations', icon: 'bi-chat-dots-fill' },
    { path: '/reviews', label: 'Reviews', icon: 'bi-star-fill' },
    { path: '/profile', label: 'Profile', icon: 'bi-person-circle' }
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <nav className="decorvista-nav">
      <div className="nav-wrapper">
        <Link className="brand" to="/">
          <div className="brand-logo">
            <i className="bi bi-palette-fill"></i>
          </div>
          <span className="brand-name">DecorVista Designer</span>
        </Link>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className="bi bi-list"></i>
        </button>

        <div className={`nav-items ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {navItems.map((item) => (
            <Link 
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </Link>
          ))}
          <button 
            className="nav-item logout-btn"
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;