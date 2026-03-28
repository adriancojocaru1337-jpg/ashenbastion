import apiClient from '@/lib/apiClient';
import { USE_MOCKS } from '@/lib/mockMode';

const shrines = [
  {
    id: 'shrine-ember',
    name: 'Ember Shrine',
    shrine_type: 'ember',
    x: 14,
    y: 11,
    status: 'Dormant',
    bonus_label: '+5% timber income',
    description: 'A cracked altar where the first fire still smolders.',
    difficulty: 'Low',
    notes: 'Often contested by ash-cults and scavengers.',
    defender_summary: { troops: [{ troop_type: 'ember_guard', quantity: 8 }] },
    current_owner: null,
  },
  {
    id: 'shrine-veil',
    name: 'Veil Shrine',
    shrine_type: 'veil',
    x: 7,
    y: 13,
    status: 'Claimed',
    bonus_label: '+10% scout efficiency',
    description: 'Mist gathers around this relic site even at noon.',
    difficulty: 'Medium',
    notes: 'Vision distorts near the altar stones.',
    defender_summary: { troops: [{ troop_type: 'veil_watcher', quantity: 12 }] },
    current_owner: { player_name: 'Mordrail', bastion_name: 'Blackthorn Hold' },
  },
];

export async function getShrines() {
  if (USE_MOCKS) return { shrines };
  const { data } = await apiClient.get('/shrines');
  return data.data;
}

export async function getShrineDetail(id) {
  if (USE_MOCKS) {
    return { shrine: shrines.find((shrine) => shrine.id === id) || shrines[0] };
  }
  const { data } = await apiClient.get(`/shrines/${id}`);
  return data.data;
}

export async function getActiveBlessing() {
  if (USE_MOCKS) {
    return {
      blessing: {
        shrine_name: 'Ember Shrine',
        bonus_label: '+5% timber income',
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
      },
    };
  }
  const { data } = await apiClient.get('/bastion/bonuses');
  return data.data;
}
