import React, { useState, useEffect } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetchOrders();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchOrders();
    }, 3000); // Poll every 3 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Real-time pending counter effect
  useEffect(() => {
    const countPending = orders.filter(order => order.status === 'pending').length;
    setPendingCount(countPending);
    
    // Simulate real-time pending orders increment
    const pendingInterval = setInterval(() => {
      setPendingCount(prev => prev + Math.floor(Math.random() * 2)); // Random 0-1 increment
    }, 4000);
    
    return () => clearInterval(pendingInterval);
  }, [orders]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (data.success) {
        alert('Order status updated successfully!');
        fetchOrders();
        
        window.dispatchEvent(new CustomEvent('orderStatusUpdated', {
          detail: { orderId, newStatus }
        }));
      } else {
        alert(data.message || 'Error updating order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-warning',
      confirmed: 'bg-info',
      processing: 'bg-primary',
      shipped: 'bg-secondary',
      delivered: 'bg-success',
      cancelled: 'bg-danger'
    };
    return statusColors[status] || 'bg-secondary';
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user_id?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <i className="bi bi-cart-check"></i>
          </div>
          <h1>Orders Management</h1>
          <p>Monitor and manage customer orders</p>
        </div>
      </div>

      <div className="admin-actions mb-4">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <i className="bi bi-cart-check me-2"></i>
                Orders Management
              </h4>
            </div>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="col-md-3">
                <div className="d-flex gap-3 mt-2">
                  <h6 className="text-muted">Total: {filteredOrders.length}</h6>
                  <div className="pending-counter">
                    <span className="badge bg-warning text-dark pending-badge">
                      <i className="bi bi-clock-fill me-1"></i>
                      Pending: <span className="counter-number">{pendingCount}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-cart-x display-1 text-muted"></i>
                <h5 className="mt-3 text-muted">No orders found</h5>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <strong>#{order.orderNumber || order._id?.slice(-6) || 'N/A'}</strong>
                        </td>
                        <td>
                          <div>
                            <div className="fw-semibold">{order.user_id?.username || 'N/A'}</div>
                            <small className="text-muted">{order.user_id?.email || 'N/A'}</small>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-info">{order.items?.length || 0} items</span>
                        </td>
                        <td>
                          <strong className="text-success">PKR {(order.totalAmount || order.total || 0).toLocaleString()}</strong>
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadge(order.status)}`}>
                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                          </span>
                        </td>
                        <td>
                          <small className="text-muted">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                          </small>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-info me-2"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderModal(true);
                            }}
                          >
                            View Details
                          </button>
                          {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <span className="badge bg-secondary">Active</span>
                          )}
                          {(order.status === 'delivered' || order.status === 'cancelled') && (
                            <span className="badge bg-dark">Finalized</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {showOrderModal && selectedOrder && (
             <div className="modal show" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
              <div className="modal-header">
                <h5 className="modal-title">Order Details - #{selectedOrder.orderNumber || selectedOrder._id.slice(-6)}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowOrderModal(false)}
                ></button>
              </div>
              <div className="modal-body" style={{ overflowY: 'auto', maxHeight: 'calc(90vh - 120px)' }}>
                <div className="row">
                  <div className="col-md-6">
                    <h6>Customer Information</h6>
                    <p><strong>Name:</strong> {selectedOrder.user_id?.username || 'N/A'}</p>
                    <p><strong>Email:</strong> {selectedOrder.user_id?.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone || 'N/A'}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Order Information</h6>
                    <p><strong>Status:</strong> 
                      <span className={`badge ms-2 ${getStatusBadge(selectedOrder.status)}`}>
                        {selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1)}
                      </span>
                    </p>
                    <p><strong>Total:</strong> PKR {selectedOrder.totalAmount?.toLocaleString()}</p>
                    <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {new Date(selectedOrder.createdAt).toLocaleTimeString()}</p>                  </div>
                </div>
                
                <h6 className="mt-3">Shipping Address</h6>
                <p>
                  {selectedOrder.shippingAddress?.fullName}<br/>
                  {selectedOrder.shippingAddress?.address}<br/>
                  {selectedOrder.shippingAddress?.city} {selectedOrder.shippingAddress?.postalCode}
                </p>
                
                <h6 className="mt-3">Order Items</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              {item.product?.images?.[0] ? (
                                <img 
                                  src={item.product.images[0]} 
                                  alt={item.product?.productName || item.name || 'Product'}
                                  className="me-3"
                                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                                />
                              ) : (
                                <div 
                                  className="me-3 d-flex align-items-center justify-content-center"
                                  style={{ 
                                    width: '50px', 
                                    height: '50px', 
                                    backgroundColor: '#f3f4f6', 
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    color: '#9ca3af',
                                    border: '1px solid #e5e7eb'
                                  }}
                                >
                                  📦
                                </div>
                              )}
                              <span>{item.product?.productName || item.name || `Product ${item.product}`}</span>
                            </div>
                          </td>
                          <td>{item.quantity}</td>
                          <td>PKR {item.price?.toLocaleString()}</td>
                          <td>PKR {(item.price * item.quantity)?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                  <div className="mt-3">
                    <h6>Update Order Status</h6>
                    <div className="d-flex gap-2 flex-wrap">
                      <button className="btn btn-sm btn-warning" onClick={() => { updateOrderStatus(selectedOrder._id, 'confirmed'); setShowOrderModal(false); }}>Confirmed</button>
                      <button className="btn btn-sm btn-info" onClick={() => { updateOrderStatus(selectedOrder._id, 'processing'); setShowOrderModal(false); }}>Processing</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => { updateOrderStatus(selectedOrder._id, 'shipped'); setShowOrderModal(false); }}>Shipped</button>
                      <button className="btn btn-sm btn-success" onClick={() => { updateOrderStatus(selectedOrder._id, 'delivered'); setShowOrderModal(false); }}>Delivered</button>
                      <button className="btn btn-sm btn-danger" onClick={() => { updateOrderStatus(selectedOrder._id, 'cancelled'); setShowOrderModal(false); }}>Cancel</button>
                    </div>
                  </div>
                )}
                {(selectedOrder.status === 'delivered' || selectedOrder.status === 'cancelled') && (
                  <div className="mt-3">
                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      This order is finalized and cannot be modified.
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowOrderModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .pending-counter {
          animation: pulse 2s infinite;
        }
        
        .pending-badge {
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
        }
        
        .counter-number {
          display: inline-block;
          transition: all 0.5s ease;
          font-weight: bold;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); box-shadow: 0 4px 12px rgba(255, 193, 7, 0.5); }
          100% { transform: scale(1); }
        }
        
        .pending-counter:hover {
          animation: bounce 0.6s ease;
        }
        
        @keyframes bounce {
          0%, 20%, 60%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
          80% { transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
};

export default Orders;