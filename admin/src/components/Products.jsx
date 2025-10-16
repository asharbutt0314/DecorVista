import React, { useState, useEffect } from 'react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    price: '',
    description: '',
    images: [''],
    categories: [],
    room: '',
    style: '',
    material: '',
    color: ''
  });

  const rooms = ['living_room', 'bedroom', 'kitchen', 'bathroom', 'dining_room', 'office', 'outdoor'];
  const styles = ['modern', 'traditional', 'contemporary', 'minimalist', 'rustic', 'industrial', 'scandinavian'];

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const url = editingProduct 
        ? `${import.meta.env.VITE_API_URL}/api/products/${editingProduct._id}`
        : `${import.meta.env.VITE_API_URL}/api/products`;
      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          images: formData.images.filter(img => img.trim() !== '')
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
        setShowModal(false);
        resetForm();
        fetchProducts();
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      brand: product.brand,
      price: product.price.toString(),
      description: product.description,
      images: product.images.length > 0 ? product.images : [''],
      categories: product.categories.map(cat => cat._id || cat),
      room: product.room,
      style: product.style || '',
      material: product.material || '',
      color: product.color || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        
        if (data.success) {
          alert('Product deleted successfully!');
          fetchProducts();
        } else {
          alert(data.message || 'Delete failed');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      brand: '',
      price: '',
      description: '',
      images: [''],
      categories: [],
      room: '',
      style: '',
      material: '',
      color: ''
    });
    setEditingProduct(null);
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const updateImageField = (index, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const removeImageField = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        updateImageField(index, compressedDataUrl);
      };
      
      img.src = URL.createObjectURL(file);
    }
  };

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
    <>
      <div className="admin-dashboard">
        <div className="admin-header">
          <div className="header-content">
            <div className="header-icon">
              <i className="bi bi-grid-3x3-gap-fill"></i>
            </div>
            <h1>Products Management</h1>
            <p>Monitor and manage product inventory</p>
          </div>
        </div>

        <div className="admin-actions mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <i className="bi bi-grid-3x3-gap-fill me-2"></i>
                Products Management
              </h4>
              <button 
                className="btn btn-light"
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
              >
                <i className="bi bi-plus-circle me-1"></i>
                Add Product
              </button>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <h6 className="text-muted">Total Products: {products.length}</h6>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-grid-3x3-gap display-1 text-muted"></i>
                  <h5 className="mt-3 text-muted">No products found</h5>
                  <p className="text-muted">Add your first product to get started</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th>Brand</th>
                        <th>Price</th>
                        <th>Room</th>
                        <th>Style</th>
                        <th>Rating</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img 
                                src={product.images[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iMjUiIHk9IjI4IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='} 
                                alt={product.productName}
                                className="me-3"
                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                              />
                              <div>
                                <h6 className="mb-0">{product.productName}</h6>
                                <small className="text-muted">{product.description.substring(0, 50)}...</small>
                              </div>
                            </div>
                          </td>
                          <td>{product.brand}</td>
                          <td>
                            <strong className="text-success">PKR {product.price}</strong>
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {product.room.replace('_', ' ')}
                            </span>
                          </td>
                          <td>{product.style || 'N/A'}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="text-warning me-1">★</span>
                              {product.rating || 0}
                              <small className="text-muted ms-1">({product.totalReviews || 0})</small>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${product.isActive ? 'bg-success' : 'bg-secondary'}`}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button 
                                className="btn btn-outline-primary"
                                onClick={() => handleEdit(product)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button 
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(product._id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
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
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="modal show" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '600px', width: '90%' }}>
            <div className="modal-content" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{ overflowY: 'auto', maxHeight: 'calc(90vh - 120px)' }}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Product Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.productName}
                        onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Brand *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.brand}
                        onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Room *</label>
                      <select
                        className="form-select"
                        value={formData.room}
                        onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                        required
                      >
                        <option value="">Select Room</option>
                        {rooms.map(room => (
                          <option key={room} value={room}>
                            {room.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Description *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Style</label>
                      <select
                        className="form-select"
                        value={formData.style}
                        onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
                      >
                        <option value="">Select Style</option>
                        {styles.map(style => (
                          <option key={style} value={style}>
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label">Product Images</label>
                      {formData.images.map((image, index) => (
                        <div key={index} className="input-group mb-2">
                          <input
                            type="url"
                            className="form-control"
                            placeholder="Image URL"
                            value={image}
                            onChange={(e) => updateImageField(index, e.target.value)}
                          />
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={(e) => handleImageUpload(e, index)}
                            style={{ flex: '0 0 auto', width: '120px' }}
                          />
                          {formData.images.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => removeImageField(index)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={addImageField}
                      >
                        <i className="bi bi-plus"></i> Add Image
                      </button>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Products;