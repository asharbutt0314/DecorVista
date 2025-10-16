import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
      const data = await response.json();
      setProduct(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

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
    alert('Product added to cart!');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ flex: '1' }}>
        <div style={{ marginBottom: '1rem' }}>
          <img 
            src={product.images[selectedImage]} 
            alt={product.productName}
            style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.productName} ${index + 1}`}
              style={{ 
                width: '80px', 
                height: '80px', 
                objectFit: 'cover', 
                borderRadius: '4px',
                cursor: 'pointer',
                border: selectedImage === index ? '2px solid #ff6b6b' : '2px solid transparent'
              }}
              onClick={() => setSelectedImage(index)}
            />
          ))}
        </div>
      </div>

      <div style={{ flex: '1' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{product.productName}</h1>
        <p style={{ color: '#666', marginBottom: '1rem' }}>by {product.brand}</p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ color: '#ffa500' }}>{'★'.repeat(Math.floor(product.rating))}</span>
          <span>({product.totalReviews} reviews)</span>
        </div>
        
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff6b6b', marginBottom: '2rem' }}>
          ₹{product.price.toLocaleString()}
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3>Description</h3>
          <p>{product.description}</p>
          
          <div style={{ marginTop: '1rem' }}>
            <div><strong>Room:</strong> {product.room.replace('_', ' ')}</div>
            {product.style && <div><strong>Style:</strong> {product.style}</div>}
            {product.material && <div><strong>Material:</strong> {product.material}</div>}
            {product.color && <div><strong>Color:</strong> {product.color}</div>}
            {product.dimensions && (
              <div><strong>Dimensions:</strong> {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} {product.dimensions.unit}</div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <label>Quantity:</label>
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            style={{ padding: '0.5rem', border: '1px solid #ddd', background: 'white' }}
          >-</button>
          <span style={{ padding: '0.5rem 1rem', border: '1px solid #ddd' }}>{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            style={{ padding: '0.5rem', border: '1px solid #ddd', background: 'white' }}
          >+</button>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={addToCart}
            disabled={product.availability === 'out_of_stock'}
            style={{ 
              flex: '1', 
              padding: '1rem', 
              background: product.availability === 'out_of_stock' ? '#ccc' : '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: product.availability === 'out_of_stock' ? 'not-allowed' : 'pointer'
            }}
          >
            {product.availability === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button 
            style={{ 
              flex: '1', 
              padding: '1rem', 
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;