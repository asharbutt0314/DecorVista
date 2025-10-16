import React, { useState, useEffect } from 'react';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    category: '',
    tags: '',
    status: 'draft',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: ''
    }
  });

  const categories = ['design-tips', 'inspiration', 'trends', 'tutorials', 'news'];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/blogs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 404) {
        console.warn('Blogs API endpoint not found on backend');
        setBlogs([]);
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      if (!token) {
        alert('Please login again');
        return;
      }
      const url = editingBlog 
        ? `http://localhost:5000/api/blogs/${editingBlog._id}`
        : 'http://localhost:5000/api/blogs';
      
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        seo: {
          ...formData.seo,
          keywords: formData.seo.keywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword)
        }
      };
      
      const response = await fetch(url, {
        method: editingBlog ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(blogData)
      });

      const data = await response.json();
      
      if (response.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.clear();
        window.location.href = '/login';
        return;
      }
      
      if (data.success) {
        alert(editingBlog ? 'Blog updated successfully!' : 'Blog created successfully!');
        setShowModal(false);
        resetForm();
        fetchBlogs();
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Error saving blog');
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      featuredImage: blog.featuredImage,
      category: blog.category,
      tags: blog.tags?.join(', ') || '',
      status: blog.status,
      seo: {
        metaTitle: blog.seo?.metaTitle || '',
        metaDescription: blog.seo?.metaDescription || '',
        keywords: blog.seo?.keywords?.join(', ') || ''
      }
    });
    setShowModal(true);
  };

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
        const response = await fetch(`http://localhost:5000/api/blogs/${blogId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        
        if (data.success) {
          alert('Blog deleted successfully!');
          fetchBlogs();
        } else {
          alert(data.message || 'Delete failed');
        }
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Error deleting blog');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      featuredImage: '',
      category: '',
      tags: '',
      status: 'draft',
      seo: {
        metaTitle: '',
        metaDescription: '',
        keywords: ''
      }
    });
    setEditingBlog(null);
  };

  const handleImageUpload = (e) => {
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
        setFormData(prev => ({ ...prev, featuredImage: compressedDataUrl }));
      };
      
      img.src = URL.createObjectURL(file);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      draft: 'bg-secondary',
      published: 'bg-success',
      archived: 'bg-warning'
    };
    return statusColors[status] || 'bg-secondary';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'design-tips': 'bi-lightbulb-fill',
      'trends': 'bi-fire',
      'tutorials': 'bi-book-fill',
      'inspiration': 'bi-star-fill',
      'news': 'bi-newspaper'
    };
    return icons[category] || 'bi-pencil-fill';
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
              <i className="bi bi-journal-text"></i>
            </div>
            <h1>Blog Management</h1>
            <p>Create and manage blog content</p>
          </div>
        </div>

        <div className="admin-actions mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="bi bi-journal-text me-2"></i>
                  Blog Management
                </h4>
                <button 
                  className="btn btn-light"
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  Add Blog Post
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <h6 className="text-muted">Total Blog Posts: {blogs.length}</h6>
                </div>
              </div>

              {blogs.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-journal-text display-1 text-muted"></i>
                  <h5 className="mt-3 text-muted">No blog posts found</h5>
                  <p className="text-muted">Create your first blog post to share design insights</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Article</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Views</th>
                        <th>Published</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.map((blog) => (
                        <tr key={blog._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img 
                                src={blog.featuredImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA2MCA0MCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iMzAiIHk9IjI0IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJsb2c8L3RleHQ+PC9zdmc+'} 
                                alt={blog.title}
                                className="me-3"
                                style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '8px' }}
                              />
                              <div>
                                <h6 className="mb-0">{blog.title}</h6>
                                <small className="text-muted">
                                  {blog.excerpt ? blog.excerpt.substring(0, 60) + '...' : 'No excerpt'}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-info">
                              <i className={getCategoryIcon(blog.category)}></i> {blog.category}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-circle bg-primary text-white me-2">
                                {blog.author?.username?.charAt(0).toUpperCase()}
                              </div>
                              <small>{blog.author?.username}</small>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${getStatusBadge(blog.status)}`}>
                              {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className="bi bi-eye me-1 text-muted"></i>
                              {blog.views || 0}
                            </div>
                          </td>
                          <td>
                            <small className="text-muted">
                              {blog.publishedAt ? 
                                new Date(blog.publishedAt).toLocaleDateString() : 
                                'Not published'
                              }
                            </small>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button 
                                className="btn btn-outline-primary"
                                onClick={() => handleEdit(blog)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button 
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(blog._id)}
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

      {/* Blog Modal */}
      {showModal && (
        <div className="modal show" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-dialog" style={{ margin: '20px', maxWidth: '500px', width: '90%', maxHeight: '90vh' }}>
            <div className="modal-content" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
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
                      <label className="form-label">Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Category *</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Excerpt *</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={formData.excerpt}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        placeholder="Brief description of the article"
                        required
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Content *</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Write your blog content here..."
                        required
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Featured Image *</label>
                      <div className="input-group mb-2">
                        <input
                          type="url"
                          className="form-control"
                          placeholder="Image URL"
                          value={formData.featuredImage}
                          onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          onChange={(e) => handleImageUpload(e)}
                          style={{ flex: '0 0 auto', width: '120px' }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Tags</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.tags}
                        onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="interior design, home decor, modern (comma separated)"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Meta Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.seo.metaTitle}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          seo: { ...prev.seo, metaTitle: e.target.value }
                        }))}
                        placeholder="SEO title"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Keywords</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.seo.keywords}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          seo: { ...prev.seo, keywords: e.target.value }
                        }))}
                        placeholder="keyword1, keyword2"
                      />
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
                      {editingBlog ? 'Update Blog Post' : 'Create Blog Post'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .avatar-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
        }
      `}</style>
    </>
  );
};

export default Blogs;