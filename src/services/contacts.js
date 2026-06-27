import api from './api';

export const contactsAPI = {
  sync: (contacts) => api.post('/contacts/sync', { contacts }),

  getAll: (params) => api.get('/contacts', { params }),

  getById: (id) => api.get(`/contacts/${id}`),

  update: (id, data) => api.put(`/contacts/${id}`, data),

  delete: (id) => api.delete(`/contacts/${id}`),

  exportCSV: () =>
    api.get('/contacts/export', { responseType: 'blob' }),
};
