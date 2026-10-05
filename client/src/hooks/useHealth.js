import { useQuery } from '@tanstack/react-query';
import { checkHealth } from '../services/api.js';

export function useHealth() {
  return useQuery({
    queryKey: ['server-health'],
    queryFn: checkHealth,
    refetchInterval: 15000,
    retry: 2,
  });
}
