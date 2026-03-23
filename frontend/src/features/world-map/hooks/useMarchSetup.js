import { useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createMarch } from '../api/mapApi';

export function useMarchSetup({ selectedLocation, availableTroops }) {
  const [marchType, setMarchTypeState] = useState('raid');
  const [troopSelections, setTroopSelections] = useState({});

  useEffect(() => {
    setTroopSelections(Object.fromEntries((availableTroops ?? []).map((troop) => [troop.key, 0])));
  }, [availableTroops]);

  const selectedTroops = useMemo(() => (availableTroops ?? []).filter((troop) => (troopSelections[troop.key] ?? 0) > 0), [availableTroops, troopSelections]);
  const totalUnits = useMemo(() => selectedTroops.reduce((sum, troop) => sum + (troopSelections[troop.key] ?? 0), 0), [selectedTroops, troopSelections]);
  const slowestSpeed = useMemo(() => selectedTroops.length ? Math.min(...selectedTroops.map((troop) => troop.speed)) : 0, [selectedTroops]);
  const distance = useMemo(() => selectedLocation ? Math.max(Math.abs(selectedLocation.x - 10), Math.abs(selectedLocation.y - 10)) : 0, [selectedLocation]);
  const etaMinutes = useMemo(() => totalUnits && slowestSpeed ? Math.max(1, Math.ceil((distance / slowestSpeed) * 60)) : null, [distance, slowestSpeed, totalUnits]);
  const mutation = useMutation({ mutationFn: createMarch });

  function setMarchType(nextType) {
    setMarchTypeState(nextType);
    if (nextType === 'scout') {
      setTroopSelections(Object.fromEntries((availableTroops ?? []).map((troop) => [troop.key, troop.key === 'ravensworn' ? Math.min(1, troop.available) : 0])));
    }
  }

  function setTroopQuantity(troopKey, value) {
    const troop = (availableTroops ?? []).find((t) => t.key === troopKey);
    const bounded = Math.max(0, Math.min(value, troop?.available ?? 0));
    setTroopSelections((current) => ({ ...current, [troopKey]: bounded }));
  }

  async function submitMarch() {
    if (!selectedLocation || !totalUnits) return null;
    const payload = {
      targetId: selectedLocation.id,
      action: marchType,
      troops: Object.entries(troopSelections).filter(([,q]) => q > 0).map(([troopType, quantity]) => ({ troopType, quantity })),
    };
    return mutation.mutateAsync(payload);
  }

  return { marchType, setMarchType, troopSelections, setTroopQuantity, selectedTroops, totalUnits, slowestSpeed, distance, etaMinutes, submitMarch, isSubmitting: mutation.isPending, submitError: mutation.error ?? null, submitResult: mutation.data ?? null };
}
