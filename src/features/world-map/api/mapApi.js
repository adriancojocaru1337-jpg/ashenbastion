import apiClient from '@/lib/apiClient';

export async function getMapBundle() {
  const { data } = await apiClient.get('/map');
  const payload = data.data;
  return {
    world: payload.world,
    playerOrigin: payload.player_origin,
    locations: (payload.locations || []).map((l) => ({
      id: l.id,
      name: l.name,
      type: l.type,
      x: l.x,
      y: l.y,
      owner: l.owner,
      difficulty: l.difficulty,
      notes: l.notes,
    })),
    availableTroops: (payload.available_troops || []).map((t) => ({
      key: t.troop_type,
      troopType: t.troop_type,
      name: t.name,
      available: t.available,
      speed: t.speed,
      role: t.role,
    })),
  };
}

export async function createMarch(payload) {
  const { data } = await apiClient.post('/map/marches', payload);
  return data.data;
}
