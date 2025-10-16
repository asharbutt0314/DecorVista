import React, { useState, useEffect } from 'react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/user`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffa500',
      confirmed: '#007bff',
      processing: '#6f42c1',
      shipped: '#17a2b8',
      delivered: '#28a745',
      cancelled: '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading orders...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', color: '#333' }}>My Orders</h1>
      
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <h3>No orders found</h3>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {orders.map(order => (
            <div 
              key={order._id}
              style={{ 
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0', color: '#333' }}>Order #{order.orderNumber}</h3>
                  <p style={{ margin: '0.25rem 0', color: '#666' }}>Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span 
                    style={{ 
                      background: getStatusColor(order.status),
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    {order.status.toUpperCase()}
                  </span>
                  <div style={{ marginTop: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    ₹{order.totalAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Items ({order.items.length})</h4>
                {order.items.map((item, index) => (
                  <div 
                    key={index}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '0.5rem 0',
                      borderBottom: index < order.items.length - 1 ? '1px solid #f0f0f0' : 'none'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: '500' }}>{item.product?.productName || 'Product'}</span>
                      <span style={{ color: '#666', marginLeft: '0.5rem' }}>x{item.quantity}</span>
                    </div>
                    <span style={{ fontWeight: '500' }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {order.shippingAddress && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
                  <h5 style={{ margin: '0 0 0.5rem 0' }}>Shipping Address</h5>
                  <p style={{ margin: '0', fontSize: '0.875rem', color: '#666' }}>
                    {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                  style={{ 
                    padding: '0.5rem 1rem',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
                </button>
                
                {order.status === 'delivered' && (
                  <button 
                    style={{ 
                      padding: '0.5rem 1rem',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Write Review
                  </button>
                )}
                
                {['pending', 'confirmed'].includes(order.status) && (
                  <button 
                    style={{ 
                      padding: '0.5rem 1rem',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel Order
                  </button>
                )}
              </div>

              {selectedOrder === order._id && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <strong>Payment Method:</strong> {order.paymentMethod.replace('_', ' ')}
                    </div>
                    <div>
                      <strong>Payment Status:</strong> 
                      <span style={{ color: order.paymentStatus === 'paid' ? '#28a745' : '#ffa500', marginLeft: '0.5rem' }}>
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                    {order.notes && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <strong>Notes:</strong> {order.notes}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;