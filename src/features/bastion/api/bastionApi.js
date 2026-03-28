import apiClient from '@/lib/apiClient';
import { USE_MOCKS } from '@/lib/mockMode';
import { bastionMock } from '../data/bastionMock';

function normalizeBuilding(building) {
  return {
    type: building.building_type,
    name: building.name,
    category: building.category,
    level: building.level,
    currentEffect: building.current_effect,
    nextEffect: building.next_effect,
    upgradeCost: building.upgrade_cost,
    upgradeTimeSeconds: building.upgrade_time_seconds,
    canUpgrade: building.can_upgrade,
    lockedReason: building.locked_reason,
  };
}

function getMockBundle() {
  return {
    bastion: {
      id: 'mock-bastion',
      name: bastionMock.bastion.name,
      doctrine: bastionMock.bastion.doctrine,
      title: bastionMock.bastion.title,
      tutorial: bastionMock.bastion.tutorial,
      queues: {
        building: bastionMock.bastion.queues?.building || null,
        training: bastionMock.bastion.queues?.training || [],
      },
      troopSummary: bastionMock.bastion.troopSummary || [],
      resources: { timber: 500, iron: 500, grain: 400, ember: 100 },
      resourceRates: { timber: 60, iron: 50, grain: 55, ember: 4 },
    },
    buildings: (bastionMock.buildings || []).map((building) => ({
      type: building.type,
      name: building.name,
      category: building.category || 'core',
      level: building.level,
      currentEffect: building.currentEffect,
      nextEffect: building.nextEffect,
      upgradeCost: building.upgradeCost,
      upgradeTimeSeconds: building.upgradeTimeSeconds || null,
      upgradeTime: building.upgradeTime || null,
      canUpgrade: building.canUpgrade,
      lockedReason: building.lockedReason || null,
    })),
  };
}

export async function getBastionBundle() {
  if (USE_MOCKS) return getMockBundle();

  const { data } = await apiClient.get('/bastion');
  const payload = data.data;
  return {
    bastion: {
      id: payload.bastion.id,
      name: payload.bastion.name,
      doctrine: payload.bastion.doctrine_label || payload.bastion.doctrine,
      title: payload.bastion.title,
      tutorial: (payload.bastion.tutorial || []).map((t) => ({ id:t.id, label:t.label, progress:t.progress_percent, reward:t.reward_label })),
      queues: {
        building: payload.bastion.queues?.building?.active ? {
          name: payload.bastion.queues.building.building_name,
          eta: payload.bastion.queues.building.ends_at,
        } : null,
        training: payload.bastion.queues?.training?.active ? payload.bastion.queues.training.queue_items.map((q) => ({
          troopName: q.troop_name,
          quantity: q.quantity_total,
          eta: q.ends_at,
        })) : [],
      },
      troopSummary: (payload.bastion.troop_summary || []).map((t) => ({ name:t.name, quantity:t.quantity, role:t.role })),
      resources: payload.bastion.resources,
      resourceRates: payload.bastion.resource_rates,
    },
    buildings: (payload.buildings || []).map(normalizeBuilding),
  };
}

export async function upgradeBuilding({ buildingType }) {
  if (USE_MOCKS) {
    return { success: true, message: `${buildingType} queued for upgrade in demo mode.` };
  }
  const { data } = await apiClient.post('/bastion/buildings/upgrade', { buildingType });
  return data.data;
}

export async function trainTroops({ troopType, quantity }) {
  if (USE_MOCKS) {
    return { success: true, message: `Queued ${quantity} ${troopType} in demo mode.` };
  }
  const { data } = await apiClient.post('/bastion/troops/train', { troopType, quantity });
  return data.data;
}
