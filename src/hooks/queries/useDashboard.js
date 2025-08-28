import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../axios-client';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await axiosClient.get('/dashboard/stats');
      return response.data.data;
    },
    // Refresh every minute
    refetchInterval: 60 * 1000,
    // Keep data fresh for 30 seconds
    staleTime: 30 * 1000,
    // Refetch on window focus
    refetchOnWindowFocus: true,
    // Refetch on reconnect
    refetchOnReconnect: true,
  });
}; 