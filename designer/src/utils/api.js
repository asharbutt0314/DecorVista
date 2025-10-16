const API_BASE = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const api = {
  // Auth endpoints
  auth: {
    login: (data) => fetch(`${API_BASE}/api/designer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    forgotPassword: (data) => fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    changePassword: (data) => fetch(`${API_BASE}/api/auth/change-password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }),
    resetPassword: (data) => fetch(`${API_BASE}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  },

  // Designer endpoints
  designer: {
    getAll: () => fetch(`${API_BASE}/api/designer/all`, {
      headers: getAuthHeaders()
    }),
    getById: (id) => fetch(`${API_BASE}/api/designer/${id}`, {
      headers: getAuthHeaders()
    }),
    update: (id, data) => fetch(`${API_BASE}/api/designer/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
  },

  // User endpoints
  user: {
    update: (id, data) => fetch(`${API_BASE}/api/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
  },

  // Dashboard endpoints
  dashboard: {
    getDesignerData: () => fetch(`${API_BASE}/api/dashboard/designer`, {
      headers: getAuthHeaders()
    })
  },

  // Consultation endpoints
  consultations: {
    getDesignerConsultations: () => fetch(`${API_BASE}/api/consultations/designer`, {
      headers: getAuthHeaders()
    }),
    updateStatus: (id, status) => fetch(`${API_BASE}/api/consultations/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    })
  },

  // Review endpoints
  reviews: {
    getDesignerReviews: () => fetch(`${API_BASE}/api/reviews/my-designer-reviews`, {
      headers: getAuthHeaders()
    }),
    respond: (id, comment) => fetch(`${API_BASE}/api/reviews/${id}/respond`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ comment })
    })
  }
};