import api from './api';

export const locationAPI = {
  sendLocation: (data) => api.post('/location', data),

  getHistory: (params) => api.get('/location/history', { params }),

  getLatest: () => api.get('/location/latest'),
};
