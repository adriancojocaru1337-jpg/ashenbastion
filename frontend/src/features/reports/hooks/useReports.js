import { useQuery } from '@tanstack/react-query';
import { getReports } from '../api/reportsApi';

export function useReports() {
  const query = useQuery({
    queryKey: ['reports'],
    queryFn: getReports,
    refetchInterval: 5000,
  });
  return { reports: query.data ?? [], isLoading: query.isLoading, error: query.error ?? null };
}
