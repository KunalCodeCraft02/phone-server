import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { photosAPI } from '../services/photos';
import { QUERY_KEYS } from '../utils/constants';
import toast from 'react-hot-toast';

export function usePhotos(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PHOTOS, params],
    queryFn: async () => {
      const { data } = await photosAPI.getAll(params);
      return data;
    },
  });
}

export function usePhoto(id) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PHOTOS, id],
    queryFn: async () => {
      const { data } = await photosAPI.getById(id);
      return data;
    },
    enabled: !!id,
  });
}

export function useUploadPhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ formData, onProgress }) =>
      photosAPI.upload(formData, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PHOTOS });
      toast.success('Photo uploaded successfully');
    },
    onError: () => toast.error('Failed to upload photo'),
  });
}

export function useDeletePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => photosAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PHOTOS });
      toast.success('Photo deleted');
    },
    onError: () => toast.error('Failed to delete photo'),
  });
}
