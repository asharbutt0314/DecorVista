import React, { useState, useEffect } from 'react';

const CartIcon = ({ onClick }) => {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    updateCartCount();
    
    const handleStorageChange = () => {
      updateCartCount();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setItemCount(count);
  };

  return (
    <>
      {itemCount > 0 && (
        <span style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          background: '#ff6b6b',
          color: 'white',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          zIndex: '1'
        }}>
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </>
  );
};

export default CartIcon;