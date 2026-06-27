import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { barcodeAPI } from '../services/barcode';
import { QUERY_KEYS } from '../utils/constants';
import toast from 'react-hot-toast';

export function useBarcodeList(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.BARCODE, params],
    queryFn: async () => {
      const { data } = await barcodeAPI.getAll(params);
      return data;
    },
  });
}

export function useSaveBarcodeScan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => barcodeAPI.saveScan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BARCODE });
      toast.success('Barcode scan saved');
    },
    onError: () => toast.error('Failed to save barcode scan'),
  });
}

export function useDeleteBarcode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => barcodeAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BARCODE });
      toast.success('Barcode entry deleted');
    },
    onError: () => toast.error('Failed to delete barcode entry'),
  });
}
