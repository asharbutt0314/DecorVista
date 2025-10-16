import React, { useState, useEffect } from 'react';

const CartSidebar = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      loadCart();
    }
  }, [isOpen]);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
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
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => onClose(), 300);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: `rgba(0,0,0,${isAnimating ? '0.5' : '0'})`, 
          zIndex: 999,
          transition: 'background 0.3s ease'
        }}
        onClick={handleClose}
      />
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        right: isAnimating ? 0 : '-400px', 
        width: '400px', 
        height: '100vh', 
        background: 'white', 
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
        transition: 'right 0.3s ease'
      }}>
        <div style={{ 
          padding: '1rem', 
          borderBottom: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0 }}>{cartItems.length === 0 ? 'Cart' : `Cart (${cartItems.length})`}</h3>
          <button 
            onClick={handleClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '1.5rem', 
              cursor: 'pointer' 
            }}
          >×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem 1rem', 
              color: '#6b7280',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60%'
            }}>
              <i className="bi bi-cart-x" style={{ 
                fontSize: '3rem', 
                color: '#d1d5db', 
                marginBottom: '1rem' 
              }}></i>
              <h3 style={{ 
                margin: '0 0 0.5rem 0', 
                fontSize: '1.2rem', 
                fontWeight: '600',
                color: '#374151'
              }}>Your cart is empty</h3>
              <p style={{ 
                margin: '0', 
                fontSize: '0.9rem',
                color: '#6b7280'
              }}>Add some products to get started!</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.productId} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '1rem 0', 
                borderBottom: '1px solid #eee'
              }}>
                <img 
                  src={item.image} 
                  alt={item.name}
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <div style={{ flex: 1, marginLeft: '0.75rem' }}>
                  <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}>{item.name}</h5>
                  <p style={{ margin: '0', color: '#666', fontSize: '0.8rem' }}>PKR {item.price.toLocaleString()}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      style={{ 
                        padding: '0.25rem 0.5rem', 
                        border: '1px solid #6366f1', 
                        background: 'white',
                        color: '#6366f1',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >-</button>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      minWidth: '30px',
                      textAlign: 'center'
                    }}>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      style={{ 
                        padding: '0.25rem 0.5rem', 
                        border: '1px solid #6366f1', 
                        background: 'white',
                        color: '#6366f1',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >+</button>
                  </div>
                </div>
                <button 
                  onClick={() => removeItem(item.productId)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#dc3545', 
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                  }}
                >×</button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div style={{ padding: '1rem', borderTop: '1px solid #ddd' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '1rem',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              <span>Total:</span>
              <span style={{color: '#6366f1'}}>PKR {getTotalPrice().toLocaleString()}</span>
            </div>
            <button 
              onClick={() => window.location.href = '/cart'}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '0.5rem',
                fontWeight: '600',
                boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
                transition: 'all 0.3s ease'
              }}
            >
              View Cart
            </button>
            <button 
              onClick={() => window.location.href = '/checkout'}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: '0 4px 14px 0 rgba(31, 41, 55, 0.39)',
                transition: 'all 0.3s ease'
              }}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;