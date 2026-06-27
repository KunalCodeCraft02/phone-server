import api from './api';

export const devicesAPI = {
  register: (data) => api.post('/devices', data),

  getAll: () => api.get('/devices'),

  getById: (id) => api.get(`/devices/${id}`),

  update: (id, data) => api.put(`/devices/${id}`, data),

  remove: (id) => api.delete(`/devices/${id}`),

  heartbeat: (id, data) => api.post(`/devices/${id}/heartbeat`, data),
};
