import React, { useState, useEffect } from 'react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
    image: '',
    parentCategory: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const url = editingCategory 
        ? `http://localhost:5000/api/categories/${editingCategory._id}`
        : 'http://localhost:5000/api/categories';
      
      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          parentCategory: formData.parentCategory || null
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
        setShowModal(false);
        resetForm();
        fetchCategories();
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      categoryName: category.categoryName,
      description: category.description || '',
      image: category.image || '',
      parentCategory: category.parentCategory?._id || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
        const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        
        if (data.success) {
          alert('Category deleted successfully!');
          fetchCategories();
        } else {
          alert(data.message || 'Delete failed');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      categoryName: '',
      description: '',
      image: '',
      parentCategory: ''
    });
    setEditingCategory(null);
  };

  const getParentCategories = () => {
    return categories.filter(cat => !cat.parentCategory);
  };

  const getSubcategories = (parentId) => {
    return categories.filter(cat => cat.parentCategory?._id === parentId);
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
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <i className="bi bi-tags-fill me-2"></i>
                Categories Management
              </h4>
              <button 
                className="btn btn-light"
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
              >
                <i className="bi bi-plus-circle me-1"></i>
                Add Category
              </button>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <h6 className="text-muted">Total Categories: {categories.length}</h6>
                </div>
              </div>

              {categories.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-tags display-1 text-muted"></i>
                  <h5 className="mt-3 text-muted">No categories found</h5>
                  <p className="text-muted">Add your first category to organize products</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Parent Category</th>
                        <th>Subcategories</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => (
                        <tr key={category._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {category.image && (
                                <img 
                                  src={category.image} 
                                  alt={category.categoryName}
                                  className="me-3"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }}
                                />
                              )}
                              <div>
                                <h6 className="mb-0">{category.categoryName}</h6>
                              </div>
                            </div>
                          </td>
                          <td>
                            <small className="text-muted">
                              {category.description ? 
                                (category.description.length > 50 ? 
                                  category.description.substring(0, 50) + '...' : 
                                  category.description
                                ) : 
                                'No description'
                              }
                            </small>
                          </td>
                          <td>
                            {category.parentCategory ? (
                              <span className="badge bg-secondary">
                                {category.parentCategory.categoryName}
                              </span>
                            ) : (
                              <span className="badge bg-primary">Main Category</span>
                            )}
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {getSubcategories(category._id).length} subcategories
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${category.isActive ? 'bg-success' : 'bg-secondary'}`}>
                              {category.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(category.createdAt).toLocaleDateString()}
                            </small>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button 
                                className="btn btn-outline-primary"
                                onClick={() => handleEdit(category)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button 
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(category._id)}
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

      {/* Category Modal */}
      {showModal && (
        <div className="modal show" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-dialog" style={{ margin: '20px', maxWidth: '500px', width: '90%', maxHeight: '90vh' }}>
            <div className="modal-content" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{ overflowY: 'auto', maxHeight: 'calc(90vh - 120px)' }}>
                  <div className="mb-3">
                    <label className="form-label">Category Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.categoryName}
                      onChange={(e) => setFormData(prev => ({ ...prev, categoryName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Optional description for this category"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category Image</label>
                    <input
                      type="url"
                      className="form-control"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Parent Category</label>
                    <select
                      className="form-select"
                      value={formData.parentCategory}
                      onChange={(e) => setFormData(prev => ({ ...prev, parentCategory: e.target.value }))}
                    >
                      <option value="">None (Main Category)</option>
                      {getParentCategories().map(category => (
                        <option key={category._id} value={category._id}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                    <div className="form-text">
                      Leave empty to create a main category, or select a parent to create a subcategory
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
                      {editingCategory ? 'Update Category' : 'Create Category'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;