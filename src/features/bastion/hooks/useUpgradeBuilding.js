import { useMutation, useQueryClient } from '@tanstack/react-query';
import { upgradeBuilding } from '../api/bastionApi';
import { queryKeys } from '@/shared/constants/queryKeys';
export function useUpgradeBuilding() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: upgradeBuilding, onSuccess: ()=>{ qc.invalidateQueries({ queryKey: queryKeys.bastionBundle }); qc.invalidateQueries({ queryKey: queryKeys.mapBundle }); } });
}
