import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { smsAPI } from '../services/sms';
import { QUERY_KEYS } from '../utils/constants';
import toast from 'react-hot-toast';

export function useSMSList(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.SMS, params],
    queryFn: async () => {
      const { data } = await smsAPI.getAll(params);
      return data;
    },
  });
}

export function useSendSMS() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => smsAPI.send(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SMS });
      toast.success('SMS sent successfully');
    },
    onError: () => toast.error('Failed to send SMS'),
  });
}

export function useDeleteSMS() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => smsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SMS });
      toast.success('SMS deleted');
    },
    onError: () => toast.error('Failed to delete SMS'),
  });
}
