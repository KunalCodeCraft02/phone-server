import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../services/dashboard';
import { QUERY_KEYS } from '../utils/constants';

export function useStats() {
  return useQuery({
    queryKey: [...QUERY_KEYS.DASHBOARD, 'stats'],
    queryFn: async () => {
      const { data } = await dashboardAPI.getStats();
      return data;
    },
    refetchInterval: 30000,
  });
}

export function useActivity(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DASHBOARD, 'activity', params],
    queryFn: async () => {
      const { data } = await dashboardAPI.getActivity(params);
      return data;
    },
  });
}
