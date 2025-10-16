import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../styles/navbar.css'

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [pendingOrders, setPendingOrders] = useState(0)
  const location = useLocation()

  useEffect(() => {
    const handlePopState = () => {
      if (!localStorage.getItem('admin')) {
        window.location.replace('/login')
      }
    }
    
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Fetch pending orders count
  useEffect(() => {
    fetchPendingOrders()
    
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchPendingOrders, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchPendingOrders = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const pending = data.orders.filter(order => order.status === 'pending').length
          setPendingOrders(pending)
        }
      }
    } catch (error) {
      console.error('Error fetching pending orders:', error)
    }
  }

  const navItems = [
    { path: '/', icon: 'bi-house-door-fill', label: 'Dashboard' },
    { path: '/users', icon: 'bi-people-fill', label: 'Users' },
    { path: '/products', icon: 'bi-grid-3x3-gap-fill', label: 'Products' },
    { path: '/orders', icon: 'bi-cart-check', label: 'Orders' },
    { path: '/analytics', icon: 'bi-graph-up', label: 'Analytics' },
    { path: '/settings', icon: 'bi-gear', label: 'Settings' }
  ]

  const handleLogout = () => {
    localStorage.clear()
    window.history.pushState(null, null, '/login')
    window.location.replace('/login')
  }

  return (
    <nav className="admin-nav">
      <div className="admin-nav-wrapper">
        <Link className="admin-brand" to="/">
          <div className="admin-brand-logo">
            <i className="bi bi-house-heart-fill"></i>
          </div>
          <span className="admin-brand-name">DecorVista Admin</span>
        </Link>

        <button 
          className="admin-mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className="bi bi-list"></i>
        </button>

        <div className={`admin-nav-items ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {navItems.map((item) => (
            <Link 
              key={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ position: 'relative' }}
            >
              <i className={item.icon}></i>
              <span>
                {item.label}
                {item.path === '/orders' && pendingOrders > 0 && (
                  <span className="pending-counter-badge">
                    {pendingOrders}
                  </span>
                )}
              </span>
            </Link>
          ))}
          <button 
            className="admin-nav-item logout-btn"
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <i className="bi-box-arrow-right"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar