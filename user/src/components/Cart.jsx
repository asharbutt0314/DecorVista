import React, { useState, useEffect } from 'react';
import Checkout from './Checkout';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    setLoading(false);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    
    const updatedCart = cartItems.map(item =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
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

  if (showCheckout) {
    return <Checkout onBack={() => setShowCheckout(false)} />;
  }

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
            <i className="bi bi-cart-fill"></i>
          </div>
          <h1 style={{ 
            fontSize: '3rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 1rem 0'
          }}>Shopping Cart</h1>
          <p style={{ 
            fontSize: '1.2rem',
            color: '#6b7280',
            fontWeight: '500',
            margin: '0'
          }}>Review your selected items</p>
        </div>
      
        {cartItems.length === 0 ? (
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
              <i className="bi bi-cart-x"></i>
            </div>
            <h3 style={{ 
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '0.5rem'
            }}>Your cart is empty</h3>
            <p style={{ 
              color: '#6b7280',
              fontSize: '1.1rem'
            }}>Add some products to get started!</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '2rem' }}>
              {cartItems.map(item => (
                <div key={item.productId} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '2rem', 
                  background: 'white',
                  borderRadius: '16px',
                  marginBottom: '1.5rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}>
                <img 
                  src={item.image} 
                  alt={item.name}
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    objectFit: 'cover', 
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <div style={{ flex: '1', marginLeft: '1.5rem' }}>
                  <h4 style={{ 
                    margin: '0 0 0.5rem 0',
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    color: '#1e293b'
                  }}>{item.name}</h4>
                  <p style={{ 
                    margin: '0',
                    color: '#6b7280',
                    fontSize: '1.1rem',
                    fontWeight: '600'
                  }}>PKR {item.price.toLocaleString()}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button 
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    style={{ 
                      padding: '0.5rem 0.75rem', 
                      border: '2px solid #ff6b6b', 
                      background: 'white',
                      color: '#ff6b6b',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >-</button>
                  <span style={{ 
                    padding: '0.5rem 1rem', 
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontWeight: '600',
                    minWidth: '60px',
                    textAlign: 'center'
                  }}>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    style={{ 
                      padding: '0.5rem 0.75rem', 
                      border: '2px solid #ff6b6b', 
                      background: 'white',
                      color: '#ff6b6b',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >+</button>
                </div>
                <div style={{ 
                  marginLeft: '1.5rem',
                  fontSize: '1.3rem',
                  fontWeight: '800',
                  color: '#ff6b6b'
                }}>
                  PKR {(item.price * item.quantity).toLocaleString()}
                </div>
                <button 
                  onClick={() => removeItem(item.productId)}
                  style={{ 
                    marginLeft: '1rem', 
                    padding: '0.5rem 1rem', 
                    background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px',
                    fontWeight: '600',
                    boxShadow: '0 4px 14px 0 rgba(220, 53, 69, 0.39)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
            <div style={{ 
              background: 'white',
              borderRadius: '20px',
              padding: '2.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '2rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: '0'
              }}>Total: PKR {getTotalPrice().toLocaleString()}</h3>
              <button 
                onClick={() => setShowCheckout(true)}
                style={{ 
                  padding: '1.2rem 3rem', 
                  background: 'linear-gradient(135deg, #1f2937 0%, #ffffff 100%)', 
                  color: '#1f2937', 
                  border: 'none', 
                  borderRadius: '16px',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  fontWeight: '700',
                  boxShadow: '0 4px 14px 0 rgba(31, 41, 55, 0.39)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px 0 rgba(31, 41, 55, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 14px 0 rgba(31, 41, 55, 0.39)';
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;