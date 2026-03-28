
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCommander, createCommander } from '../api/commanderApi';

export function useCommander() {
  return useQuery({ queryKey: ['commander'], queryFn: getCommander });
}

export function useCreateCommander() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCommander,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['commander'] }),
  });
}
