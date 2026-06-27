import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { devicesAPI } from '../services/devices';
import { QUERY_KEYS } from '../utils/constants';
import toast from 'react-hot-toast';

export function useDevices() {
  return useQuery({
    queryKey: QUERY_KEYS.DEVICES,
    queryFn: async () => {
      const { data } = await devicesAPI.getAll();
      return data;
    },
    refetchInterval: 15000,
  });
}

export function useRegisterDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => devicesAPI.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEVICES });
      toast.success('Device registered');
    },
    onError: () => toast.error('Failed to register device'),
  });
}

export function useUpdateDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => devicesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEVICES });
      toast.success('Device updated');
    },
    onError: () => toast.error('Failed to update device'),
  });
}

export function useRemoveDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => devicesAPI.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEVICES });
      toast.success('Device removed');
    },
    onError: () => toast.error('Failed to remove device'),
  });
}
