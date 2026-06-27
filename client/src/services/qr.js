import api from './api';

export const qrAPI = {
  saveScan: (data) => api.post('/qr', data),

  getAll: (params) => api.get('/qr', { params }),

  getById: (id) => api.get(`/qr/${id}`),

  delete: (id) => api.delete(`/qr/${id}`),
};
