import React, { useState, useEffect } from 'react';

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/consultations/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setConsultations(data.consultations);
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConsultationStatus = async (consultationId, newStatus) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/consultations/${consultationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (data.success) {
        alert('Consultation status updated successfully!');
        fetchConsultations();
      }
    } catch (error) {
      console.error('Error updating consultation:', error);
      alert('Error updating consultation status');
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-warning',
      confirmed: 'bg-info',
      in_progress: 'bg-primary',
      completed: 'bg-success',
      cancelled: 'bg-danger'
    };
    return statusColors[status] || 'bg-secondary';
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = searchTerm === '' || 
                         consultation.user_id?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.designer_id?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.consultation_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <i className="bi bi-calendar-check-fill"></i>
          </div>
          <h1>Consultations Management</h1>
          <p>Monitor and manage design consultations</p>
        </div>
      </div>

      <div className="admin-actions mb-4">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <i className="bi bi-calendar-check me-2"></i>
                Consultations Management
              </h4>
            </div>
          </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search consultations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="col-md-5">
                  <h6 className="text-muted mt-2">Total Consultations: {filteredConsultations.length}</h6>
                </div>
              </div>

              {filteredConsultations.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-calendar-x display-1 text-muted"></i>
                  <h5 className="mt-3 text-muted">No consultations found</h5>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Client</th>
                        <th>Designer</th>
                        <th>Type</th>
                        <th>Notes</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredConsultations.map((consultation) => (
                        <tr key={consultation._id}>
                          <td>
                            <div>
                              <div className="fw-semibold">{consultation.user_id?.username || 'N/A'}</div>
                              <small className="text-muted">{consultation.user_id?.email || 'N/A'}</small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="fw-semibold">{consultation.designer_id?.username || 'Unassigned'}</div>
                              <small className="text-muted">{consultation.designer_id?.email || ''}</small>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {consultation.consultation_type || 'General'}
                            </span>
                          </td>
                          <td>
                            <strong className="text-success">
                              {consultation.notes || 'N/A'}
                            </strong>
                          </td>
                          <td>
                            <span className={`badge ${getStatusBadge(consultation.status)}`}>
                              {consultation.status?.replace('_', ' ').charAt(0).toUpperCase() + 
                               consultation.status?.replace('_', ' ').slice(1) || 'Pending'}
                            </span>
                          </td>
                          <td>
                            <div>
                              <div>{consultation.scheduled_datetime ? new Date(consultation.scheduled_datetime).toLocaleDateString() : 'N/A'}</div>
                              <small className="text-muted">
                                {consultation.scheduled_datetime ? new Date(consultation.scheduled_datetime).toLocaleTimeString() : 'Any time'}
                              </small>
                            </div>
                          </td>
                          <td>
                            <select 
                              className="form-select form-select-sm" 
                              value={consultation.status}
                              onChange={(e) => updateConsultationStatus(consultation._id, e.target.value)}
                              style={{ width: '140px' }}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
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

export default Consultations;