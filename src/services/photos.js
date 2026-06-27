import api from './api';

export const photosAPI = {
  upload: (formData, onProgress) =>
    api.post('/photos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }),

  getAll: (params) => api.get('/photos', { params }),

  getById: (id) => api.get(`/photos/${id}`),

  delete: (id) => api.delete(`/photos/${id}`),

  download: (id) =>
    api.get(`/photos/${id}/download`, { responseType: 'blob' }),
};
