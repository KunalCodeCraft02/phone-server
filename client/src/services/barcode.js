import api from './api';

export const barcodeAPI = {
  saveScan: (data) => api.post('/barcode', data),

  getAll: (params) => api.get('/barcode', { params }),

  getById: (id) => api.get(`/barcode/${id}`),

  delete: (id) => api.delete(`/barcode/${id}`),
};
