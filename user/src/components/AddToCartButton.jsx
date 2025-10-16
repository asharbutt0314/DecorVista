import React, { useState } from 'react';

const AddToCartButton = ({ product, quantity = 1, onCartUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);

  const addToCart = () => {
    setIsAdding(true);
    
    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists
    const existingItemIndex = existingCart.findIndex(item => item.productId === product._id);
    
    if (existingItemIndex > -1) {
      // Update quantity
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      existingCart.push({
        productId: product._id,
        name: product.productName,
        price: product.price,
        image: product.images[0],
        quantity: quantity
      });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Notify parent component
    if (onCartUpdate) {
      onCartUpdate(existingCart.length);
    }
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <button 
      onClick={addToCart}
      disabled={isAdding || product.availability === 'out_of_stock'}
      style={{ 
        padding: '0.75rem 1.5rem',
        background: isAdding ? '#28a745' : (product.availability === 'out_of_stock' ? '#ccc' : '#ff6b6b'),
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: product.availability === 'out_of_stock' ? 'not-allowed' : 'pointer',
        fontSize: '1rem',
        fontWeight: '500',
        transition: 'all 0.3s ease'
      }}
    >
      {isAdding ? '✓ Added!' : (product.availability === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart')}
    </button>
  );
};

export default AddToCartButton;