import { useQuery, useMutation } from '@tanstack/react-query';
import { locationAPI } from '../services/location';
import toast from 'react-hot-toast';

export function useLocationHistory(params) {
  return useQuery({
    queryKey: ['location', 'history', params],
    queryFn: async () => {
      const { data } = await locationAPI.getHistory(params);
      return data;
    },
  });
}

export function useLatestLocation() {
  return useQuery({
    queryKey: ['location', 'latest'],
    queryFn: async () => {
      const { data } = await locationAPI.getLatest();
      return data;
    },
    refetchInterval: 10000,
  });
}

export function useSendLocation() {
  return useMutation({
    mutationFn: (data) => locationAPI.sendLocation(data),
    onSuccess: () => toast.success('Location sent'),
    onError: () => toast.error('Failed to send location'),
  });
}
