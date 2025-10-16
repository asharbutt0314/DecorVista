import React, { useState, useEffect } from 'react';
import './Blog.css';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const categories = [
    { value: 'all', label: 'All Articles' },
    { value: 'tips', label: 'Design Tips' },
    { value: 'trends', label: 'Latest Trends' },
    { value: 'diy', label: 'DIY Projects' },
    { value: 'inspiration', label: 'Inspiration' },
    { value: 'guides', label: 'How-to Guides' }
  ];

  useEffect(() => {
    fetchBlogs();
    fetchFeaturedBlogs();
  }, [selectedCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'all' 
        ? 'http://localhost:5000/api/blogs'
        : `http://localhost:5000/api/blogs/category/${selectedCategory}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedBlogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blogs/featured');
      const data = await response.json();
      
      if (data.success) {
        setFeaturedBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Error fetching featured blogs:', error);
    }
  };

  const fetchFullBlog = async (slug) => {
    try {
      const response = await fetch(`http://localhost:5000/api/blogs/${slug}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedBlog(data.blog);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching full blog:', error);
    }
  };

  const handleReadMore = (blog) => {
    fetchFullBlog(blog.slug);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBlog(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      tips: 'bi-lightbulb-fill',
      trends: 'bi-fire',
      diy: 'bi-hammer',
      inspiration: 'bi-star-fill',
      guides: 'bi-book-fill'
    };
    return icons[category] || 'bi-pencil-fill';
  };

  if (loading && blogs.length === 0) {
    return <div className="loading">Loading blog articles...</div>;
  }

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>Interior Design Blog</h1>
        <p>Discover the latest trends, tips, and inspiration for your home</p>
      </div>

      {featuredBlogs.length > 0 && selectedCategory === 'all' && (
        <section className="featured-section">
          <h2>Featured Articles</h2>
          <div className="featured-grid">
            {featuredBlogs.slice(0, 3).map(blog => (
              <article key={blog._id} className="featured-card">
                <div className="featured-image">
                  <img 
                    src={blog.featuredImage || '/placeholder-blog.jpg'} 
                    alt={blog.title}
                  />
                  <div className="featured-overlay">
                    <span className="category-badge">
                      <i className={`bi ${getCategoryIcon(blog.category)}`}></i> {blog.category.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="featured-content">
                  <h3>{blog.title}</h3>
                  <p className="excerpt">{blog.excerpt}</p>
                  <div className="blog-meta">
                    <span className="author">By {blog.author.username}</span>
                    <span className="date">{formatDate(blog.publishedAt)}</span>
                    <span className="read-time">{blog.readTime} min read</span>
                  </div>
                  <button className="btn-read-more" onClick={() => handleReadMore(blog)}>Read More</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="blog-section">
        <div className="blog-filters">
          <h2>Browse Articles</h2>
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.value}
                className={`category-filter ${selectedCategory === category.value ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.value !== 'all' && <i className={`bi ${getCategoryIcon(category.value)}`}></i>} {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="blog-grid">
          {blogs.length === 0 ? (
            <div className="no-blogs">
              <h3>No articles found</h3>
              <p>Try selecting a different category</p>
            </div>
          ) : (
            blogs.map(blog => (
              <article key={blog._id} className="blog-card">
                <div className="blog-image">
                  <img 
                    src={blog.featuredImage || '/placeholder-blog.jpg'} 
                    alt={blog.title}
                  />
                  <span className="category-tag">
                    <i className={`bi ${getCategoryIcon(blog.category)}`}></i> {blog.category}
                  </span>
                </div>
                <div className="blog-content">
                  <h3>{blog.title}</h3>
                  <p className="excerpt">{blog.excerpt}</p>
                  <div className="blog-stats">
                    <span className="views"><i className="bi bi-eye-fill"></i> {blog.views || 0}</span>
                    <span className="likes"><i className="bi bi-heart-fill"></i> {blog.likes || 0}</span>
                    <span className="read-time"><i className="bi bi-clock-fill"></i> {blog.readTime} min</span>
                  </div>
                  <div className="blog-footer">
                    <div className="author-info">
                      <div>
                        <span className="author-name">{blog.author.username}</span>
                        <span className="publish-date">{formatDate(blog.publishedAt)}</span>
                      </div>
                    </div>
                    <button className="btn-read" onClick={() => handleReadMore(blog)}>Read Article</button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>



      {/* Blog Modal */}
      {showModal && selectedBlog && (
        <div className="blog-modal-overlay" onClick={closeModal}>
          <div className="blog-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <i className="bi bi-x-lg"></i>
            </button>
            
            <div className="modal-header">
              <img 
                src={selectedBlog.featuredImage || '/placeholder-blog.jpg'} 
                alt={selectedBlog.title}
                className="modal-featured-image"
              />
              <div className="modal-header-content">
                <span className="modal-category">
                  <i className={`bi ${getCategoryIcon(selectedBlog.category)}`}></i>
                  {selectedBlog.category.toUpperCase()}
                </span>
                <h1>{selectedBlog.title}</h1>
                <div className="modal-meta">
                  <div className="author-section">
                    <div>
                      <span className="author-name">By {selectedBlog.author?.username}</span>
                      <span className="publish-info">
                        {formatDate(selectedBlog.publishedAt)} • {selectedBlog.readTime} min read
                      </span>
                    </div>
                  </div>
                  <div className="blog-stats">
                    <span><i className="bi bi-eye-fill"></i> {selectedBlog.views || 0}</span>
                    <span><i className="bi bi-heart-fill"></i> {selectedBlog.likes || 0}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="blog-excerpt">
                <p><strong>{selectedBlog.excerpt}</strong></p>
              </div>
              
              <div className="blog-content">
                {selectedBlog.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                <div className="blog-tags">
                  <h4>Tags:</h4>
                  <div className="tags-list">
                    {selectedBlog.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;