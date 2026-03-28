import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants/queryKeys';
import { getBastionBundle } from '../api/bastionApi';
export function useBastionData() {
  const q = useQuery({ queryKey: queryKeys.bastionBundle, queryFn: getBastionBundle });
  return { bastion: q.data?.bastion ?? null, buildings: q.data?.buildings ?? [], isLoading: q.isLoading, error: q.error };
}
