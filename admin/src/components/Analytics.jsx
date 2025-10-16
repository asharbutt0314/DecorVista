import React, { useState, useEffect } from 'react';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    monthlyRevenue: [],
    topProducts: [],
    userGrowth: [],
    orderStatus: {}
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      
      // Fetch data from existing APIs
      const [usersRes, designersRes, productsRes, ordersRes, reviewsRes, consultationsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/designer/all`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/consultations/admin/all`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const users = usersRes.ok ? await usersRes.json() : { success: false };
      const designers = designersRes.ok ? await designersRes.json() : { success: false };
      const products = productsRes.ok ? await productsRes.json() : { success: false };
      const orders = ordersRes.ok ? await ordersRes.json() : { success: false };
      const reviews = reviewsRes.ok ? await reviewsRes.json() : { success: false };
      const consultations = consultationsRes.ok ? await consultationsRes.json() : { success: false };

      // Process data
      const totalUsers = users.success ? users.users?.length || 0 : 0;
      const totalDesigners = designers.success ? designers.designers?.length || 0 : 0;
      const totalProducts = products.success ? products.products?.length || 0 : 0;
      const totalOrders = orders.success ? orders.orders?.length || 0 : 0;
      const totalReviews = reviews.success ? reviews.reviews?.length || 0 : 0;
      const totalConsultations = consultations.success ? consultations.consultations?.length || 0 : 0;

      // Calculate revenue from orders
      let totalRevenue = 0;
      const ordersByMonth = {};
      const orderStatusCount = {};
      
      if (orders.success && orders.orders) {
        orders.orders.forEach(order => {
          totalRevenue += order.totalAmount || 0;
          
          const month = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short' });
          ordersByMonth[month] = (ordersByMonth[month] || 0) + (order.totalAmount || 0);
          
          const status = order.status || 'pending';
          orderStatusCount[status] = (orderStatusCount[status] || 0) + 1;
        });
      }

      // Get top products by sales
      const productSales = {};
      if (orders.success && orders.orders) {
        orders.orders.forEach(order => {
          if (order.items) {
            order.items.forEach(item => {
              const productName = item.productName || item.name || 'Unknown Product';
              productSales[productName] = (productSales[productName] || 0) + (item.quantity || 1);
            });
          }
        });
      }

      const topProducts = Object.entries(productSales)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, sales]) => ({ name, sales }));

      // User growth by month
      const usersByMonth = {};
      if (users.success && users.users) {
        users.users.forEach(user => {
          const month = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short' });
          usersByMonth[month] = (usersByMonth[month] || 0) + 1;
        });
      }

      const monthlyRevenue = Object.entries(ordersByMonth).map(([month, revenue]) => ({ month, revenue }));
      const userGrowth = Object.entries(usersByMonth).map(([month, users]) => ({ month, users }));

      setAnalytics({
        totalUsers: totalUsers + totalDesigners,
        totalDesigners,
        totalOrders,
        totalRevenue,
        totalProducts,
        totalReviews,
        totalConsultations,
        monthlyRevenue,
        topProducts,
        userGrowth,
        orderStatus: orderStatusCount
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalytics({
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        monthlyRevenue: [],
        topProducts: [],
        userGrowth: [],
        orderStatus: {}
      });
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-content">
          <div className="header-icon">
            <i className="bi bi-graph-up-arrow"></i>
          </div>
          <h1>Analytics & Reports</h1>
          <p>Monitor platform performance and statistics</p>
        </div>
      </div>

      <div className="admin-actions mb-4">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Analytics & Reports
              </h4>
                <select
                  className="form-select form-select-sm"
                  style={{ width: 'auto', backgroundColor: 'white' }}
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 3 months</option>
                  <option value="365">Last year</option>
                </select>
              </div>
            </div>
            <div className="card-body">
              {/* Stats Cards */}
              <div className="row mb-4">
                <div className="col-md-2 mb-3">
                  <div className="card bg-primary text-white">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="card-title">Total Users</h6>
                          <h3 className="mb-0">{(analytics.totalUsers || 0).toLocaleString()}</h3>
                        </div>
                        <i className="bi bi-people display-6"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 mb-3">
                  <div className="card bg-purple text-white" style={{backgroundColor: '#8b5cf6'}}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="card-title">Designers</h6>
                          <h3 className="mb-0">{(analytics.totalDesigners || 0).toLocaleString()}</h3>
                        </div>
                        <i className="bi bi-palette display-6"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 mb-3">
                  <div className="card bg-success text-white">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="card-title">Orders</h6>
                          <h3 className="mb-0">{(analytics.totalOrders || 0).toLocaleString()}</h3>
                        </div>
                        <i className="bi bi-cart-check display-6"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 mb-3">
                  <div className="card bg-info text-white">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="card-title">Revenue</h6>
                          <h3 className="mb-0">PKR {(analytics.totalRevenue || 0).toLocaleString()}</h3>
                        </div>
                        <i className="bi bi-currency-dollar display-6"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 mb-3">
                  <div className="card bg-warning text-white">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="card-title">Products</h6>
                          <h3 className="mb-0">{(analytics.totalProducts || 0).toLocaleString()}</h3>
                        </div>
                        <i className="bi bi-box display-6"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 mb-3">
                  <div className="card bg-secondary text-white">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="card-title">Consultations</h6>
                          <h3 className="mb-0">{(analytics.totalConsultations || 0).toLocaleString()}</h3>
                        </div>
                        <i className="bi bi-calendar-check display-6"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="row">
                <div className="col-md-8 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Monthly Revenue</h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {(analytics.monthlyRevenue || []).map((item, index) => (
                          <div key={index} className="col-md-2 mb-2">
                            <div className="text-center">
                              <div className="bg-primary text-white rounded p-2">
                                <small>{item.month}</small>
                                <div className="fw-bold">PKR {(item.revenue || 0).toLocaleString()}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Order Status</h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {Object.entries(analytics.orderStatus || {}).map(([status, count]) => (
                          <div key={status} className="col-12 mb-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="text-capitalize">{status.replace('_', ' ')}</span>
                              <span className="badge bg-primary">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Top Selling Products</h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {(analytics.topProducts || []).map((item, index) => (
                          <div key={index} className="col-12 mb-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <span>{item.name}</span>
                              <span className="badge bg-success">{item.sales} sales</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">User Growth</h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {(analytics.userGrowth || []).map((item, index) => (
                          <div key={index} className="col-md-2 mb-2">
                            <div className="text-center">
                              <div className="bg-info text-white rounded p-2">
                                <small>{item.month}</small>
                                <div className="fw-bold">{item.users}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Analytics;