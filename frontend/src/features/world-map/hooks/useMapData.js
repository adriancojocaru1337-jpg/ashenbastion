import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants/queryKeys';
import { getMapBundle } from '../api/mapApi';
export function useMapData() {
  const q = useQuery({ queryKey: queryKeys.mapBundle, queryFn: getMapBundle });
  return { locations: q.data?.locations ?? [], availableTroops: q.data?.availableTroops ?? [], isLoading: q.isLoading, error: q.error };
}
