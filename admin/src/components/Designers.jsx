import React, { useState, useEffect } from 'react';

const Designers = () => {
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDesigners();
  }, []);

  const fetchDesigners = async () => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/designer/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setDesigners(data.designers);
      }
    } catch (error) {
      console.error('Error fetching designers:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDesigner = async (designerId) => {
    if (!confirm('Are you sure you want to delete this designer?')) return;
    
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/designer/${designerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        alert('Designer deleted successfully');
        fetchDesigners();
      } else {
        alert('Failed to delete designer');
      }
    } catch (error) {
      console.error('Error deleting designer:', error);
      alert('Error deleting designer');
    }
  };

  const toggleDesignerStatus = async (designerId, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/designer/${designerId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      const data = await response.json();
      
      if (data.success) {
        alert(`Designer ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        fetchDesigners();
      } else {
        alert('Failed to update designer status');
      }
    } catch (error) {
      console.error('Error updating designer status:', error);
      alert('Error updating designer status');
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
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-content">
          <div className="header-icon">
            <i className="bi bi-palette-fill"></i>
          </div>
          <h1>Designers Management</h1>
          <p>Monitor and manage interior designers</p>
        </div>
      </div>

      <div className="admin-actions mb-4">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">
              <i className="bi bi-palette-fill me-2"></i>
              Interior Designers Management
            </h4>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <h6 className="text-muted">Total Designers: {designers.length}</h6>
              </div>
            </div>

            {designers.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-people display-1 text-muted"></i>
                <h5 className="mt-3 text-muted">No designers found</h5>
                <p className="text-muted">Designers will appear here once they register</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Designer</th>
                      <th>Email</th>
                      <th>Specialization</th>
                      <th>Experience</th>
                      <th>Hourly Rate</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {designers.map((designer) => (
                      <tr key={designer._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-circle bg-primary text-white me-3">
                              {designer.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h6 className="mb-0">{designer.username}</h6>
                              <small className="text-muted">
                                {designer.profile?.firstName} {designer.profile?.lastName}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>{designer.email}</td>
                        <td>
                          {designer.specialization ? (
                            <span className="badge bg-info">
                              {designer.specialization.charAt(0).toUpperCase() + designer.specialization.slice(1)}
                            </span>
                          ) : (
                            <span className="text-muted">Not set</span>
                          )}
                        </td>
                        <td>
                          {designer.yearsofexperience > 0 ? (
                            <span className="badge bg-warning">
                              {designer.yearsofexperience} years
                            </span>
                          ) : (
                            <span className="text-muted">Not set</span>
                          )}
                        </td>
                        <td>
                          {designer.hourlyRate > 0 ? (
                            <span className="text-success fw-bold">
                              ${designer.hourlyRate}/hr
                            </span>
                          ) : (
                            <span className="text-muted">Not set</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${designer.isActive ? 'bg-success' : 'bg-danger'}`}>
                            {designer.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <small className="text-muted">
                            {new Date(designer.createdAt).toLocaleDateString()}
                          </small>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              className={`btn btn-sm ${designer.isActive ? 'btn-warning' : 'btn-success'}`}
                              onClick={() => toggleDesignerStatus(designer._id, designer.isActive)}
                              title={designer.isActive ? 'Deactivate' : 'Activate'}
                            >
                              <i className={`bi ${designer.isActive ? 'bi-pause' : 'bi-play'}`}></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteDesigner(designer._id)}
                              title="Delete Designer"
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
  );
};

export default Designers;