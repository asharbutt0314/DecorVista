import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import CartIcon from "../../../components/CartIcon";
import CartSidebar from "../../../components/CartSidebar";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleOpenCartSidebar = () => {
      setShowCartSidebar(true);
    };
    
    window.addEventListener('openCartSidebar', handleOpenCartSidebar);
    return () => window.removeEventListener('openCartSidebar', handleOpenCartSidebar);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (!localStorage.getItem('user')) {
        window.location.replace('/login')
      }
    }
    
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navItems = [
    { path: '/dashboard', icon: 'bi-house-door-fill', label: 'Home' },
    { path: '/designers', icon: 'bi-people-fill', label: 'Designers' },
    { path: '/inspiration', icon: 'bi-lightbulb-fill', label: 'Inspiration' },
    { path: '/orders', icon: 'bi-bag-check-fill', label: 'Orders' },
    { path: '/blog', icon: 'bi-journal-text', label: 'Blog' },
    { path: '/profile', icon: 'bi-person-circle', label: 'Profile'}
  ];

  return (
    <>
      <nav className="decorvista-nav">
        <div className="nav-wrapper">
          <Link className="brand" to="/dashboard">
            <div className="brand-logo">
              <i className="bi bi-house-heart-fill"></i>
            </div>
            <span className="brand-name">DecorVista</span>
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
            <div className="nav-item" onClick={() => { window.location.href = '/cart'; setIsMobileMenuOpen(false); }} style={{ position: 'relative' }}>
              <i className="bi bi-cart-fill"></i>
              <span>Cart</span>
              <CartIcon />
            </div>
            <button 
              className="nav-item logout-btn"
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.history.pushState(null, null, '/login');
                window.location.replace('/login');
              }}
              style={{
                background: 'none',
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
      <CartSidebar isOpen={showCartSidebar} onClose={() => setShowCartSidebar(false)} />
    </>
  );
};

export default Navbar;