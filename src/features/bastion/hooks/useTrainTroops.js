import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trainTroops } from '../api/bastionApi';
import { queryKeys } from '@/shared/constants/queryKeys';

export function useTrainTroops() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: trainTroops,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.bastionBundle });
      qc.invalidateQueries({ queryKey: queryKeys.mapBundle });
    },
  });
}
