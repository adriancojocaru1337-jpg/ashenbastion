import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants/queryKeys';
import { getReports } from '../api/reportsApi';
export function useReports() {
  const q = useQuery({ queryKey: queryKeys.reports, queryFn: getReports, refetchInterval: 3000 });
  return { reports: q.data ?? [], isLoading: q.isLoading, error: q.error };
}
