import apiClient from '@/lib/apiClient';
import { USE_MOCKS } from '@/lib/mockMode';

const mockReports = [
  {
    id: 'report-1',
    title: 'Scout Report: Fallen Ruin',
    report_type: 'scout',
    created_at: new Date().toISOString(),
    summary: 'Sparse defenders and low threat. A first raid looks viable.',
    payload_json: {
      target: { name: 'Fallen Ruin', type: 'ruin', difficulty: 'Low', notes: 'Broken walls and scattered embers.' },
      defenders: [{ name: 'Ashen Drudge', quantity: 6 }, { name: 'Bone Hound', quantity: 2 }],
      survivors: [{ troop_type: 'ravensworn', quantity_survived: 1 }],
    },
  },
  {
    id: 'report-2',
    title: 'Raid Result: Fallen Ruin',
    report_type: 'raid',
    created_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    summary: 'The raiders returned with timber and ember fragments.',
    payload_json: {
      outcome: 'Victory',
      target: { name: 'Fallen Ruin', type: 'ruin' },
      loot: { timber: 120, iron: 30, grain: 20, ember: 6 },
      survivors: [{ troop_type: 'reaver', quantity_survived: 6 }, { troop_type: 'pikeguard', quantity_survived: 3 }],
      defenders: [{ name: 'Ashen Drudge', quantity: 0 }],
    },
  },
];

export async function getReports() {
  if (USE_MOCKS) return mockReports;
  const { data } = await apiClient.get('/reports');
  return data.data;
}
