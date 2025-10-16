import React, { useState, useEffect } from 'react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
    
    // Listen for order status updates
    const handleOrderUpdate = () => {
      loadOrders();
    };
    
    // Poll for updates every 10 seconds
    const interval = setInterval(() => {
      loadOrders();
    }, 10000);
    
    window.addEventListener('orderStatusUpdated', handleOrderUpdate);
    window.addEventListener('storage', handleOrderUpdate);
    
    return () => {
      window.removeEventListener('orderStatusUpdated', handleOrderUpdate);
      window.removeEventListener('storage', handleOrderUpdate);
      clearInterval(interval);
    };
  }, []);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const orders = await response.json();
        setOrders(orders.reverse()); // Show latest orders first
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#3b82f6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) return (
    <div style={{ 
      background: '#f1f5f9', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
    </div>
  );

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          background: 'white',
          borderRadius: '20px',
          padding: '3rem',
          marginBottom: '2rem',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ 
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            color: 'white',
            boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
            margin: '0 auto 1rem auto'
          }}>
            <i className="bi bi-clipboard-check-fill"></i>
          </div>
          <h1 style={{ 
            fontSize: '3rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 1rem 0'
          }}>Order History</h1>
          <p style={{ 
            fontSize: '1.2rem',
            color: '#6b7280',
            fontWeight: '500',
            margin: '0'
          }}>Track your previous orders</p>
        </div>
      
        {orders.length === 0 ? (
          <div style={{ 
            background: 'white',
            borderRadius: '20px',
            padding: '4rem',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ 
              fontSize: '4rem',
              marginBottom: '1rem',
              opacity: '0.5',
              color: '#6366f1'
            }}>
              <i className="bi bi-box-seam"></i>
            </div>
            <h3 style={{ 
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '0.5rem'
            }}>No orders yet</h3>
            <p style={{ 
              color: '#6b7280',
              fontSize: '1.1rem'
            }}>Your order history will appear here once you place an order!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order, orderIndex) => (
              <div key={order._id || order.id || orderIndex} style={{ 
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <div>
                    <h3 style={{ 
                      margin: '0 0 0.5rem 0',
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      color: '#1e293b'
                    }}>Order #{order._id?.slice(-6) || order.id}</h3>
                    <p style={{ 
                      margin: '0',
                      color: '#6b7280',
                      fontSize: '0.9rem'
                    }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Date not available'}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '0.5rem 1rem',
                      background: getStatusColor(order.status),
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                      marginBottom: '0.5rem'
                    }}>
                      {order.status}
                    </div>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: '800',
                      color: '#6366f1'
                    }}>
                      PKR {order.totalAmount.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ 
                    margin: '0 0 1rem 0',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Items Ordered:</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {order.items.map((item, itemIndex) => (
                      <div key={`${orderIndex}-${item.productId || itemIndex}`} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.75rem',
                        background: '#f9fafb',
                        borderRadius: '8px'
                      }}>
                        <img
                          src={item.image || item.product?.images?.[0] || '/placeholder-image.jpg'}
                          alt={item.name || item.product?.productName}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '6px'
                          }}
                        />
                        <div style={{ flex: '1', marginLeft: '1rem' }}>
                          <h5 style={{ 
                            margin: '0 0 0.25rem 0',
                            fontSize: '1rem',
                            fontWeight: '600'
                          }}>{item.name}</h5>
                          <p style={{ 
                            margin: '0',
                            color: '#6b7280',
                            fontSize: '0.9rem'
                          }}>
                            Qty: {item.quantity} × PKR {item.price.toLocaleString()}
                          </p>
                        </div>
                        <div style={{ 
                          fontWeight: '700',
                          color: '#374151'
                        }}>
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '2rem',
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div>
                    <h4 style={{ 
                      margin: '0 0 0.5rem 0',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#374151'
                    }}>Customer Details:</h4>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}>
                      <strong>Name:</strong> {order.customerDetails?.fullName || order.shippingAddress?.fullName || 'N/A'}
                    </p>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}>
                      <strong>Email:</strong> {order.customerDetails?.email || order.user?.email || 'N/A'}
                    </p>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}>
                      <strong>Phone:</strong> {order.customerDetails?.phone || order.shippingAddress?.phone || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h4 style={{ 
                      margin: '0 0 0.5rem 0',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#374151'
                    }}>Delivery Address:</h4>
                    <p style={{ margin: '0', fontSize: '0.9rem', lineHeight: '1.4' }}>
                      {order.customerDetails?.address || order.shippingAddress?.address || 'N/A'}<br/>
                      {order.customerDetails?.city || order.shippingAddress?.city || 'N/A'}
                      {(order.customerDetails?.postalCode || order.shippingAddress?.postalCode) && `, ${order.customerDetails?.postalCode || order.shippingAddress?.postalCode}`}
                    </p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                      <strong>Payment:</strong> {(order.customerDetails?.paymentMethod || order.paymentMethod || 'cash_on_delivery').replace('_', ' ').toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;