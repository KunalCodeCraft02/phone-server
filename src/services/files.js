import api from './api';

export const filesAPI = {
  upload: (formData, onProgress) =>
    api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }),

  getAll: (params) => api.get('/files', { params }),

  getById: (id) => api.get(`/files/${id}`),

  download: (id) =>
    api.get(`/files/${id}/download`, { responseType: 'blob' }),

  delete: (id) => api.delete(`/files/${id}`),

  getFolders: (parentId) =>
    api.get('/files/folders', { params: { parentId } }),
};
