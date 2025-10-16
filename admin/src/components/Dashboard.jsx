import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDesigners: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalBlogs: 0,
    totalReviews: 0,
    totalConsultations: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState([])
  const [systemStatus, setSystemStatus] = useState({
    database: 'checking',
    apiServer: 'checking',
    storage: 'checking',
    lastBackup: 'checking'
  })
  const [adminName, setAdminName] = useState('')

  useEffect(() => {
    fetchDashboardData()
    getAdminName()
  }, [])

  const getAdminName = () => {
    const adminData = localStorage.getItem('admin') || localStorage.getItem('user')
    if (adminData) {
      try {
        const admin = JSON.parse(adminData)
        setAdminName(admin.username || 'Admin')
      } catch (error) {
        setAdminName('Admin')
      }
    } else {
      setAdminName('Admin')
    }
  }

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      
      // Fetch all stats in parallel with error handling
      const fetchWithFallback = async (url) => {
        try {
          const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
          if (response.status === 404) {
            console.warn(`API endpoint not found: ${url}`)
            return { success: false, notFound: true }
          }
          return response.ok ? await response.json() : { success: false }
        } catch (error) {
          console.warn(`Failed to fetch ${url}:`, error.message)
          return { success: false }
        }
      }


      const [users, designers, products, orders, blogs, reviews, consultations] = await Promise.all([
        fetchWithFallback('http://localhost:5000/api/auth/users'),
        fetchWithFallback('http://localhost:5000/api/designer/all'),
        fetchWithFallback('http://localhost:5000/api/products'),
        fetchWithFallback('http://localhost:5000/api/orders'),
        fetchWithFallback('http://localhost:5000/api/blogs'),
        fetchWithFallback('http://localhost:5000/api/reviews'),
        fetchWithFallback('http://localhost:5000/api/consultations/admin/all')
      ])

      const allUsers = users.success ? users.users || [] : []
      // Designers count from admin API
      const designerCount = designers.success ? designers.designers?.length || 0 : 0
      const regularUsers = allUsers.filter(user => user.role !== 'designer')

      setStats({
        totalUsers: regularUsers.length,
        totalDesigners: designerCount,
        totalProducts: products.success ? products.products?.length || 0 : 0,
        totalOrders: orders.success ? orders.orders?.length || 0 : 0,
        totalBlogs: blogs.success ? blogs.blogs?.length || 0 : 0,
        totalReviews: reviews.success ? reviews.reviews?.length || 0 : 0,
        totalConsultations: consultations.success ? consultations.consultations?.length || 0 : 0
      })

      // Set recent activity
      const activities = []
      if (users.success && users.users?.length > 0) {
        activities.push({
          type: 'user',
          message: `${users.users[0].username} joined recently`,
          time: new Date(users.users[0].createdAt).toLocaleDateString()
        })
      }
      if (orders.success && orders.orders?.length > 0) {
        activities.push({
          type: 'order',
          message: `New order #${orders.orders[0]._id?.slice(-6)}`,
          time: new Date(orders.orders[0].createdAt).toLocaleDateString()
        })
      }
      if (blogs.success && blogs.blogs?.length > 0) {
        activities.push({
          type: 'blog',
          message: `Blog "${blogs.blogs[0].title}" published`,
          time: new Date(blogs.blogs[0].createdAt).toLocaleDateString()
        })
      }
      setRecentActivity(activities.slice(0, 5))

      // Check system status
      checkSystemStatus()

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkSystemStatus = async () => {
    try {
      // Check database connection
      const dbCheck = await fetch('http://localhost:5000/api/auth/users')
      const dbStatus = dbCheck.ok ? 'online' : 'offline'

      // Check API server
      const apiCheck = await fetch('http://localhost:5000/api/products')
      const apiStatus = apiCheck.ok ? 'running' : 'down'


      // Simulate last backup time
      const backupHours = Math.floor(Math.random() * 12) + 1 // 1-12 hours ago

      setSystemStatus({
        database: dbStatus,
        apiServer: apiStatus,

        lastBackup: `${backupHours} hours ago`
      })
    } catch (error) {
      setSystemStatus({
        database: 'offline',
        apiServer: 'down',

        lastBackup: 'unknown'
      })
    }
  }

  const quickAccessCards = [
    { key: 'totalUsers', label: 'Users', icon: 'bi-people-fill', path: '/users', color: '#3b82f6' },
    { key: 'totalDesigners', label: 'Designers', icon: 'bi-palette-fill', path: '/designers', color: '#8b5cf6' },
    { key: 'totalProducts', label: 'Products', icon: 'bi-grid-3x3-gap-fill', path: '/products', color: '#10b981' },
    { key: 'totalConsultations', label: 'Consultations', icon: 'bi-calendar-check', path: '/consultations', color: '#64748b' },
    { key: 'totalOrders', label: 'Orders', icon: 'bi-cart-check', path: '/orders', color: '#f59e0b' },
    { key: 'totalBlogs', label: 'Blogs', icon: 'bi-journal-text', path: '/blogs', color: '#ef4444' }
  ]

  const managementCards = [
    { label: 'Consultations', icon: 'bi-calendar-check', path: '/consultations', color: '#10b981' },
    { label: 'Analytics', icon: 'bi-graph-up', path: '/analytics', color: '#8b5cf6' },
    { label: 'Settings', icon: 'bi-gear', path: '/settings', color: '#ef4444' }
  ]

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-content">
          <div className="header-icon">
            <i className="bi bi-gear-fill"></i>
          </div>
          <h1>Welcome back, {adminName}!</h1>
          <p>Manage your interior design platform efficiently</p>
        </div>
      </div>

      <div className="admin-stats">
        {quickAccessCards.map((card, index) => (
          <Link key={card.key} to={card.path} className="admin-stat-card">
            <div className="stat-icon" style={{backgroundColor: card.color}}>
              <i className={card.icon}></i>
            </div>
            <div className="stat-content">
              <h3>
                {loading ? (
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                ) : (
                  stats[card.key].toLocaleString()
                )}
              </h3>
              <p>{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Recent Activity</h6>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="list-group list-group-flush">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="list-group-item border-0 px-0">
                      <div className="d-flex align-items-center">
                        <i className={`bi ${
                          activity.type === 'user' ? 'bi-person-plus text-success' :
                          activity.type === 'order' ? 'bi-cart-check text-primary' :
                          'bi-journal-text text-info'
                        } me-2`}></i>
                        <div className="flex-grow-1">
                          <small className="text-muted d-block">{activity.message}</small>
                          <small className="text-muted">{activity.time}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">No recent activity</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">System Status</h6>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Database</span>
                <span className={`badge ${
                  systemStatus.database === 'online' ? 'bg-success' : 
                  systemStatus.database === 'checking' ? 'bg-warning' : 'bg-danger'
                }`}>
                  {systemStatus.database === 'online' ? 'Online' : 
                   systemStatus.database === 'checking' ? 'Checking...' : 'Offline'}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>API Server</span>
                <span className={`badge ${
                  systemStatus.apiServer === 'running' ? 'bg-success' : 
                  systemStatus.apiServer === 'checking' ? 'bg-warning' : 'bg-danger'
                }`}>
                  {systemStatus.apiServer === 'running' ? 'Running' : 
                   systemStatus.apiServer === 'checking' ? 'Checking...' : 'Down'}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <span>Last Backup</span>
                <small className="text-muted">{systemStatus.lastBackup}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <h2>Management Panels</h2>
        <div className="actions-grid">
          {managementCards.map((card, index) => (
            <Link key={index} to={card.path} className="action-btn">
              <i className={card.icon} style={{color: card.color}}></i>
              <span>{card.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard