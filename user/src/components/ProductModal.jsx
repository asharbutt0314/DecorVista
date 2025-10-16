import React, { useState } from 'react';

const ProductModal = ({ product, isOpen, onClose, onCartUpdate }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const addToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = existingCart.findIndex(item => item.productId === product._id);
    
    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push({
        productId: product._id,
        name: product.productName,
        price: product.price,
        image: product.images[0],
        quantity: quantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
    
    // Reset quantity and close modal
    setQuantity(1);
    onClose();
    
    // Open cart sidebar
    window.dispatchEvent(new CustomEvent('openCartSidebar'));
    
    if (onCartUpdate) {
      onCartUpdate();
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: 'rgba(0,0,0,0.5)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        zIndex: 1000 
      }}
      onClick={onClose}
    >
      <div 
        style={{ 
          background: 'white', 
          borderRadius: '16px', 
          maxWidth: '800px', 
          width: '90%', 
          maxHeight: '90vh', 
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', height: '500px' }}>
          <div style={{ flex: '1', padding: '2rem' }}>
            <img 
              src={product.images[selectedImage]} 
              alt={product.productName}
              style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.productName} ${index + 1}`}
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    objectFit: 'cover', 
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: selectedImage === index ? '2px solid #ff6b6b' : '2px solid transparent'
                  }}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>

          <div style={{ flex: '1', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h2 style={{ margin: '0', fontSize: '1.8rem', color: '#333' }}>{product.productName}</h2>
              <button 
                onClick={onClose}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '2rem', 
                  cursor: 'pointer',
                  color: '#666'
                }}
              >×</button>
            </div>
            
            <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '1.1rem' }}>by {product.brand}</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ color: '#ffa500' }}>{'★'.repeat(Math.floor(product.rating))}</span>
              <span style={{ color: '#666' }}>({product.totalReviews} reviews)</span>
            </div>
            
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111', marginBottom: '1.5rem' }}>
              PKR {product.price.toLocaleString()}
            </div>
            
            <div style={{ marginBottom: '1.5rem', flex: '1' }}>
              <p style={{ color: '#666', lineHeight: '1.6' }}>{product.description}</p>
              
              <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                <div style={{ marginBottom: '0.5rem' }}><strong>Room:</strong> {product.room.replace('_', ' ')}</div>
                {product.style && <div style={{ marginBottom: '0.5rem' }}><strong>Style:</strong> {product.style}</div>}
                {product.material && <div style={{ marginBottom: '0.5rem' }}><strong>Material:</strong> {product.material}</div>}
                {product.color && <div style={{ marginBottom: '0.5rem' }}><strong>Color:</strong> {product.color}</div>}
              </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: '500' }}>Quantity:</label>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ 
                    padding: '0.5rem 0.75rem', 
                    border: '1px solid #6366f1', 
                    background: 'white',
                    color: '#6366f1',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >-</button>
                <span style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', borderRadius: '4px', minWidth: '50px', textAlign: 'center' }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ 
                    padding: '0.5rem 0.75rem', 
                    border: '1px solid #6366f1', 
                    background: 'white',
                    color: '#6366f1',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >+</button>
              </div>
              
              <button 
                onClick={addToCart}
                disabled={product.availability === 'out_of_stock'}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  background: product.availability === 'out_of_stock' ? '#ccc' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: product.availability === 'out_of_stock' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: product.availability === 'out_of_stock' ? 'none' : '0 4px 14px 0 rgba(99, 102, 241, 0.39)'
                }}
                onMouseEnter={(e) => {
                  if (product.availability !== 'out_of_stock') {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px 0 rgba(99, 102, 241, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (product.availability !== 'out_of_stock') {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 14px 0 rgba(99, 102, 241, 0.39)';
                  }
                }}
              >
                {product.availability === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;