import apiClient from '@/lib/apiClient';
import { USE_MOCKS } from '@/lib/mockMode';

let mockCommander = {
  id: 'mock-commander',
  name: 'Vaelor',
  archetype: 'occultist',
  archetype_label: 'Occultist',
  level: 2,
  xp: 75,
  xp_to_next_level: 200,
  bonuses: [
    { key: 'shrine', label: '+10% shrine effect' },
    { key: 'scout', label: '+1 first scout range' },
  ],
};

function labelFromArchetype(archetype) {
  return {
    warmaster: 'Warmaster',
    warden: 'Warden',
    harvester: 'Harvester',
    spymaster: 'Spymaster',
    occultist: 'Occultist',
  }[archetype] || 'Commander';
}

export async function getCommander() {
  if (USE_MOCKS) return { commander: mockCommander };
  const { data } = await apiClient.get('/commander');
  return data.data;
}

export async function createCommander(payload) {
  if (USE_MOCKS) {
    mockCommander = {
      id: 'mock-commander',
      name: payload.name,
      archetype: payload.archetype,
      archetype_label: labelFromArchetype(payload.archetype),
      level: 1,
      xp: 0,
      xp_to_next_level: 100,
      bonuses: [{ key: payload.archetype, label: `${labelFromArchetype(payload.archetype)} passive active` }],
    };
    return { commander: mockCommander };
  }
  const { data } = await apiClient.post('/commander/create', payload);
  return data.data;
}
