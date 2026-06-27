import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { qrAPI } from '../services/qr';
import { QUERY_KEYS } from '../utils/constants';
import toast from 'react-hot-toast';

export function useQRList(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.QR, params],
    queryFn: async () => {
      const { data } = await qrAPI.getAll(params);
      return data;
    },
  });
}

export function useSaveQRScan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => qrAPI.saveScan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QR });
      toast.success('QR scan saved');
    },
    onError: () => toast.error('Failed to save QR scan'),
  });
}

export function useDeleteQR() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => qrAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.QR });
      toast.success('QR entry deleted');
    },
    onError: () => toast.error('Failed to delete QR entry'),
  });
}
