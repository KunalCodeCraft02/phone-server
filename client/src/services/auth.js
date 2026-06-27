import api from './api';

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),

  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),

  logout: () => api.post('/auth/logout'),

  getProfile: () => api.get('/auth/profile'),

  updateProfile: (data) => api.put('/auth/profile', data),

  changePassword: (oldPassword, newPassword) =>
    api.put('/auth/change-password', { oldPassword, newPassword }),

  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),

  refreshToken: (refreshToken) =>
    api.post('/auth/refresh', { refreshToken }),
};
