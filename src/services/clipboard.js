import api from './api';

export const clipboardAPI = {
  sync: (items) => api.post('/clipboard/sync', { items }),

  getAll: (params) => api.get('/clipboard', { params }),

  getById: (id) => api.get(`/clipboard/${id}`),

  delete: (id) => api.delete(`/clipboard/${id}`),
};
