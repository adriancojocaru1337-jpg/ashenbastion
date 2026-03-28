
import { useQuery } from '@tanstack/react-query';
import { getActiveBlessing, getShrineDetail, getShrines } from '../api/shrineApi';

export function useShrines() {
  return useQuery({ queryKey: ['shrines'], queryFn: getShrines });
}

export function useShrineDetail(id) {
  return useQuery({ queryKey: ['shrine', id], queryFn: () => getShrineDetail(id), enabled: !!id });
}

export function useActiveBlessing() {
  return useQuery({ queryKey: ['active-blessing'], queryFn: getActiveBlessing });
}
