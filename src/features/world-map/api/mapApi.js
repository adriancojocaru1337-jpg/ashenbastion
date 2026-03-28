import apiClient from '@/lib/apiClient';
import { USE_MOCKS } from '@/lib/mockMode';
import { mapLocationsMock, marchTroopsMock } from '../data/mapMock';

export async function getMapBundle() {
  if (USE_MOCKS) {
    return {
      world: { width: 21, height: 21 },
      playerOrigin: { x: 10, y: 10 },
      locations: mapLocationsMock,
      availableTroops: marchTroopsMock.map((t) => ({
        key: t.key,
        troopType: t.troop_type,
        name: t.name,
        available: t.available,
        speed: t.speed,
        role: t.role,
      })),
    };
  }

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
  if (USE_MOCKS) {
    const targetName = mapLocationsMock.find((location) => location.id === payload.targetId)?.name || 'Unknown target';
    return {
      success: true,
      message: `Demo ${payload.action} sent successfully.`,
      march: {
        id: `mock-march-${Date.now()}`,
        action: payload.action,
        target: { name: targetName },
        travel_time_seconds: 45,
      },
    };
  }
  const { data } = await apiClient.post('/map/marches', payload);
  return data.data;
}
