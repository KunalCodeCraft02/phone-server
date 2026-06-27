import api from './api';

export const smsAPI = {
  send: (data) => api.post('/sms/send', data),

  getAll: (params) => api.get('/sms', { params }),

  getById: (id) => api.get(`/sms/${id}`),

  delete: (id) => api.delete(`/sms/${id}`),

  markRead: (id) => api.put(`/sms/${id}/read`),
};
