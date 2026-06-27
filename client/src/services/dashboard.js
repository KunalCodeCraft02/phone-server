import api from './api';

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),

  getActivity: (params) => api.get('/dashboard/activity', { params }),
};
