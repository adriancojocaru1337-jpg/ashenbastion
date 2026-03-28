import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMarch } from '../api/mapApi';
import { queryKeys } from '@/shared/constants/queryKeys';

export function useMarchSetup({ selectedLocation, availableTroops }) {
  const [marchType, setMarchTypeState] = useState('raid');
  const [troopSelections, setTroopSelections] = useState({});
  const qc = useQueryClient();

  const normalizedSelections = useMemo(() => Object.fromEntries((availableTroops ?? []).map((t) => [t.key, troopSelections[t.key] ?? 0])), [availableTroops, troopSelections]);
  const selectedTroops = useMemo(() => (availableTroops ?? []).filter((t) => (normalizedSelections[t.key] ?? 0) > 0), [availableTroops, normalizedSelections]);
  const totalUnits = useMemo(() => selectedTroops.reduce((sum, t) => sum + (normalizedSelections[t.key] ?? 0), 0), [selectedTroops, normalizedSelections]);
  const slowestSpeed = useMemo(() => selectedTroops.length ? Math.min(...selectedTroops.map((t) => t.speed)) : 0, [selectedTroops]);
  const distance = useMemo(() => selectedLocation ? Math.max(Math.abs(selectedLocation.x - 10), Math.abs(selectedLocation.y - 10)) : 0, [selectedLocation]);
  const etaMinutes = useMemo(() => !totalUnits || !slowestSpeed ? null : Math.max(1, Math.ceil((distance / slowestSpeed) * 60)), [distance, slowestSpeed, totalUnits]);

  const mutation = useMutation({
    mutationFn: createMarch,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.mapBundle });
      qc.invalidateQueries({ queryKey: queryKeys.bastionBundle });
      qc.invalidateQueries({ queryKey: queryKeys.reports });
    }
  });

  function setMarchType(nextType) {
    setMarchTypeState(nextType);
    if (nextType === 'scout') {
      const next = Object.fromEntries((availableTroops ?? []).map((t) => [t.key, 0]));
      if (next.ravensworn !== undefined) next.ravensworn = Math.min(1, availableTroops.find(t => t.key === 'ravensworn')?.available ?? 0);
      setTroopSelections(next);
    }
  }

  function setTroopQuantity(troopKey, value) {
    const max = availableTroops.find((t) => t.key === troopKey)?.available ?? 0;
    setTroopSelections((current) => ({ ...current, [troopKey]: Math.max(0, Math.min(max, value)) }));
  }

  async function submitMarch() {
    if (!selectedLocation) return;
    return mutation.mutateAsync({
      targetId: selectedLocation.id,
      action: marchType,
      troops: Object.entries(normalizedSelections).filter(([, q]) => q > 0).map(([troopType, quantity]) => ({ troopType, quantity })),
    });
  }

  return { marchType, setMarchType, troopSelections: normalizedSelections, setTroopQuantity, totalUnits, slowestSpeed, distance, etaMinutes, submitMarch, isSubmitting: mutation.isPending, submitError: mutation.error ?? null, submitResult: mutation.data ?? null };
}
