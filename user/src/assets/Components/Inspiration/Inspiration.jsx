import React, { useState, useEffect } from 'react';
import './Inspiration.css';

const Inspiration = () => {
  const [inspirations, setInspirations] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('all');

  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const rooms = [
    { value: 'all', label: 'All Rooms' },
    { value: 'living_room', label: 'Living Room' },
    { value: 'bedroom', label: 'Bedroom' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'bathroom', label: 'Bathroom' },
    { value: 'dining_room', label: 'Dining Room' },
    { value: 'office', label: 'Office' }
  ];

  useEffect(() => {
    fetchInspirations();

  }, [selectedRoom]);

  const fetchInspirations = async () => {
    try {
      const url = selectedRoom === 'all' 
        ? 'http://localhost:5000/api/products'
        : `http://localhost:5000/api/products/room/${selectedRoom}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setInspirations(data.products);
      }
    } catch (error) {
      console.error('Error fetching inspirations:', error);
    } finally {
      setLoading(false);
    }
  };



  const viewProductDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return <div className="loading">Loading inspiration gallery...</div>;
  }

  return (
    <div className="inspiration-container">
      <div className="inspiration-header">
        <h1>Design Inspiration Gallery</h1>
        <p>Discover beautiful interior designs to inspire your next project</p>
      </div>

      <div className="room-filters">
        {rooms.map(room => (
          <button
            key={room.value}
            className={`room-filter ${selectedRoom === room.value ? 'active' : ''}`}
            onClick={() => setSelectedRoom(room.value)}
          >
            {room.label}
          </button>
        ))}
      </div>

      <div className="inspiration-grid">
        {inspirations.length === 0 ? (
          <div className="no-inspirations">
            <h3>No designs found</h3>
            <p>Try selecting a different room</p>
          </div>
        ) : (
          inspirations.map(item => (
            <div key={item._id} className="inspiration-card">
              <div className="inspiration-image">
                <img 
                  src={item.images[0] || '/placeholder-image.jpg'} 
                  alt={item.productName}
                />
                <div className="inspiration-overlay">
                  <div className="inspiration-actions">
                    <button 
                      className="btn-view"
                      onClick={() => viewProductDetails(item)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
              <div className="inspiration-info">
                <h3>{item.productName}</h3>
                <div className="inspiration-meta">
                  <span className="room-tag">
                    {item.room.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className="style-tag">{item.style}</span>
                </div>
                <p className="description">{item.description}</p>
                <div className="inspiration-footer">
                  <span className="brand">{item.brand}</span>
                  <span className="price">PKR {item.price}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>



      {showModal && selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedProduct.productName}</h2>
              <button className="close-btn" onClick={closeModal}>
                <i className="bi bi-x"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="product-images">
                <img 
                  src={selectedProduct.images[0] || '/placeholder-image.jpg'} 
                  alt={selectedProduct.productName}
                />
              </div>
              <div className="product-details">
                <div className="product-meta">
                  <span className="room-badge">
                    {selectedProduct.room.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className="style-badge">{selectedProduct.style}</span>
                </div>
                <div className="price-section">
                  <span className="price">PKR {selectedProduct.price}</span>
                  <span className="brand">by {selectedProduct.brand}</span>
                </div>
                <div className="description-section">
                  <h3>Description</h3>
                  <p>{selectedProduct.description}</p>
                </div>
                {selectedProduct.dimensions && (
                  <div className="dimensions-section">
                    <h3>Dimensions</h3>
                    <p>{typeof selectedProduct.dimensions === 'object' ? JSON.stringify(selectedProduct.dimensions) : selectedProduct.dimensions}</p>
                  </div>
                )}
                {selectedProduct.material && (
                  <div className="material-section">
                    <h3>Material</h3>
                    <p>{typeof selectedProduct.material === 'object' ? JSON.stringify(selectedProduct.material) : selectedProduct.material}</p>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inspiration;