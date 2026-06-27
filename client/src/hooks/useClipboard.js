import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clipboardAPI } from '../services/clipboard';
import { QUERY_KEYS } from '../utils/constants';
import toast from 'react-hot-toast';

export function useClipboardList(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CLIPBOARD, params],
    queryFn: async () => {
      const { data } = await clipboardAPI.getAll(params);
      return data;
    },
  });
}

export function useSyncClipboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items) => clipboardAPI.sync(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLIPBOARD });
      toast.success('Clipboard synced');
    },
    onError: () => toast.error('Failed to sync clipboard'),
  });
}

export function useDeleteClipboardItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => clipboardAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLIPBOARD });
      toast.success('Item deleted');
    },
    onError: () => toast.error('Failed to delete item'),
  });
}
