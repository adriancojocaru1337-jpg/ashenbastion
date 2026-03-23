import apiClient from '@/lib/apiClient';

function normalizeLocation(location) {
  return {
    id: location.id,
    name: location.name,
    type: location.type,
    x: location.x,
    y: location.y,
    owner: location.owner?.display_name || null,
    difficulty: location.difficulty,
    notes: location.notes,
  };
}

function normalizeTroop(troop) {
  return {
    key: troop.troop_type,
    name: troop.name,
    available: troop.available,
    speed: troop.speed,
    role: troop.role,
  };
}

export async function getMapBundle() {
  const { data } = await apiClient.get('/map');
  return {
    locations: (data.data.locations || []).map(normalizeLocation),
    availableTroops: (data.data.available_troops || []).map(normalizeTroop),
  };
}

export async function createMarch(payload) {
  const { data } = await apiClient.post('/map/marches', payload);
  return data.data;
}
