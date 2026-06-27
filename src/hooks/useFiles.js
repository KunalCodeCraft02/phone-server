import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { filesAPI } from '../services/files';
import { QUERY_KEYS } from '../utils/constants';
import toast from 'react-hot-toast';

export function useFiles(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.FILES, params],
    queryFn: async () => {
      const { data } = await filesAPI.getAll(params);
      return data;
    },
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ formData, onProgress }) =>
      filesAPI.upload(formData, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FILES });
      toast.success('File uploaded successfully');
    },
    onError: () => toast.error('Failed to upload file'),
  });
}

export function useDownloadFile() {
  return useMutation({
    mutationFn: async ({ id, filename }) => {
      const { data } = await filesAPI.download(id);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: () => toast.error('Failed to download file'),
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => filesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FILES });
      toast.success('File deleted');
    },
    onError: () => toast.error('Failed to delete file'),
  });
}
