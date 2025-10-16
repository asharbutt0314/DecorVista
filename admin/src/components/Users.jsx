import { useState, useEffect } from 'react'
import axios from 'axios'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token')
      console.log('Admin token:', token ? 'Found' : 'Not found')
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('API Response:', response.data)
      
      if (response.data.success) {
        setUsers(response.data.users)
        console.log('Users loaded:', response.data.users.length)
      } else {
        console.log('API returned success: false')
        alert('Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      console.error('Error response:', error.response?.data)
      alert(`Error fetching users: ${error.response?.data?.message || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const editUser = (user) => {
    setEditingUser(user._id)
    setEditForm({ username: user.username, email: user.email, password: '' })
    setShowPassword(false)
  }

  const saveUser = async () => {
    try {
      // Validation
      if (!editForm.username || editForm.username.trim().length < 3) {
        alert('Username must be at least 3 characters long')
        return
      }
      
      if (editForm.password && editForm.password.length < 6) {
        alert('Password must be at least 6 characters long')
        return
      }
      
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
      const updateData = {
        username: editForm.username.trim()
      }
      if (editForm.password && editForm.password.trim()) {
        updateData.password = editForm.password
      }
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${editingUser}`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.data.success) {
        alert('User updated successfully!')
        fetchUsers()
        setEditingUser(null)
        setEditForm({})
      } else {
        alert(response.data.message || 'Update failed')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error updating user')
    }
  }

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('adminToken')
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.data.success) {
          alert('User deleted successfully!')
          fetchUsers()
        } else {
          alert(response.data.message || 'Delete failed')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Error deleting user')
      }
    }
  }

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-content">
          <div className="header-icon">
            <i className="bi bi-people-fill"></i>
          </div>
          <h1>Users Management</h1>
          <p>Monitor and manage platform users</p>
        </div>
      </div>

      <div className="admin-actions mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>All Users ({users.length})</h3>
          <div className="d-flex gap-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '300px' }}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="user-avatar me-3">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="fw-semibold">{user.username}</span>
                    </div>
                  </td>
                  <td className="text-muted">{user.email}</td>
                  <td>
                    <span className={`badge ${user.isVerified ? 'bg-success' : 'bg-warning'}`}>
                      {user.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="text-muted">
                    <div>
                      <div>{new Date(user.createdAt).toLocaleDateString()}</div>
                      <small className="text-muted">
                        {new Date(user.createdAt).toLocaleTimeString()}
                      </small>
                    </div>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => editUser(user)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-outline-danger"
                        onClick={() => deleteUser(user._id)}
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
      </div>

      {editingUser && (
        <div className="modal-overlay" style={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
          <div className="modal-content" style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            border: 'none',
            overflow: 'hidden'
          }}>
            <div className="modal-header" style={{
              background: 'rgba(15, 23, 42, 0.95)',
              color: 'white',
              padding: '1.5rem 2rem',
              borderBottom: '2px solid rgba(255, 107, 107, 0.3)'
            }}>
              <h5 style={{margin: 0, fontSize: '1.25rem', fontWeight: '600', color: 'white'}}>Edit User</h5>
              <button 
                className="btn-close"
                onClick={() => setEditingUser(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >×</button>
            </div>
            <div className="modal-body" style={{
              padding: '2rem',
              maxHeight: '60vh',
              overflowY: 'auto'
            }}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={editForm.email || ''}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Username *</label>
                <input 
                  type="text" 
                  className={`form-control ${editForm.username && editForm.username.length < 3 ? 'is-invalid' : ''}`}
                  value={editForm.username || ''}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  minLength="3"
                  required
                />
                {editForm.username && editForm.username.length < 3 && (
                  <div className="invalid-feedback">
                    Username must be at least 3 characters long
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: '600' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${editForm.password && editForm.password.length > 0 && editForm.password.length < 6 ? 'is-invalid' : ''}`}
                    placeholder="Enter new password (leave blank to keep current)"
                    value={editForm.password || ''}
                    onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                    minLength="6"
                    style={{
                      borderRadius: '12px',
                      border: '2px solid rgba(15, 23, 42, 0.2)',
                      padding: '12px 45px 12px 16px',
                      fontSize: '16px'
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      padding: '4px',
                      fontSize: '18px'
                    }}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                  </button>
                </div>
                {editForm.password && editForm.password.length > 0 && editForm.password.length < 6 && (
                  <div className="invalid-feedback">
                    Password must be at least 6 characters long
                  </div>
                )}
                <small className="form-text text-muted">
                  Leave blank to keep current password
                </small>
              </div>
            </div>
            <div className="modal-footer" style={{
              padding: '1.5rem 2rem',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button 
                className="btn"
                onClick={() => setEditingUser(null)}
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
              <button 
                className="btn"
                onClick={saveUser}
                style={{
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users