import { ApiError } from '../utils/apiError.js';
import { resolveDueMarchesForUser } from './reports.service.js';
import { withTransaction } from '../db/pool.js';
import { getPlayerProfileByUserId } from '../repositories/users.repository.js';
import { getActiveBuildingQueueByBastionId, getActiveTrainingQueueByBastionId, getBastionByUserId, getBuildingsByBastionId, getTroopStacksByBastionId, spendResourcesAndQueueBuildingUpgrade } from '../repositories/bastion.repository.js';

const doctrineLabels = { warborn:'Warborn Creed', stone_oath:'Stone Oath', ember_rite:'Ember Rite', veil_path:'Veil Path', harvest_covenant:'Harvest Covenant' };
const troopRoles = { reaver:'Cheap raider', pikeguard:'Defensive infantry', ashbowman:'Balanced ranged', ravensworn:'Scout' };
const costs = {
  keep:{timber:120,iron:120,grain:80,ember:0,seconds:120},
  lumberyard:{timber:110,iron:80,grain:50,ember:0,seconds:45},
  ironMine:{timber:110,iron:80,grain:50,ember:0,seconds:45},
  granary:{timber:110,iron:80,grain:50,ember:0,seconds:45},
  storehouse:{timber:130,iron:100,grain:70,ember:0,seconds:60},
  barracks:{timber:140,iron:120,grain:80,ember:0,seconds:60}
};

export async function getBastionBundleForUser(userId) {
  await resolveDueMarchesForUser(userId);
  const bastion = await getBastionByUserId(userId);
  if (!bastion) throw new ApiError(404, 'BASTION_NOT_FOUND', 'Bastion not found');
  const [profile, buildings, activeBuildingQueue, trainingQueue, troopStacks] = await Promise.all([
    getPlayerProfileByUserId(userId),
    getBuildingsByBastionId(bastion.id),
    getActiveBuildingQueueByBastionId(bastion.id),
    getActiveTrainingQueueByBastionId(bastion.id),
    getTroopStacksByBastionId(bastion.id)
  ]);
  return {
    bastion: {
      id: bastion.id,
      name: bastion.name,
      doctrine: profile?.doctrine,
      doctrine_label: doctrineLabels[profile?.doctrine] ?? null,
      title: profile?.title ?? 'Warden of the Bastion',
      coordinates: { x: bastion.x, y: bastion.y },
      resources: { timber: bastion.timber, iron: bastion.iron, grain: bastion.grain, ember: bastion.ember },
      resource_rates: { timber_per_hour: bastion.timber_per_hour, iron_per_hour: bastion.iron_per_hour, grain_per_hour: bastion.grain_per_hour, ember_per_hour: bastion.ember_per_hour },
      storage: { capacity: bastion.storage_capacity },
      queues: {
        building: activeBuildingQueue ? { active:true, building_type: activeBuildingQueue.building_type, building_name: activeBuildingQueue.building_type, target_level: activeBuildingQueue.level + 1, started_at: activeBuildingQueue.upgrade_started_at, ends_at: activeBuildingQueue.upgrade_ends_at, progress_percent: 0 } : { active:false, queue_items:[] },
        training: { active: trainingQueue.length > 0, queue_items: trainingQueue }
      },
      troop_summary: troopStacks.map(t=>({ troop_type:t.troop_type, name:t.troop_type, quantity:t.quantity, role: troopRoles[t.troop_type] ?? '' })),
      tutorial: []
    },
    buildings: buildings.map(b=>({
      building_type: b.building_type,
      name: b.building_type,
      category: 'General',
      level: b.level,
      current_effect: 'Current effect pending config',
      next_effect: 'Next effect pending config',
      upgrade_cost: { timber: costs[b.building_type]?.timber ?? 0, iron: costs[b.building_type]?.iron ?? 0, grain: costs[b.building_type]?.grain ?? 0, ember: costs[b.building_type]?.ember ?? 0 },
      upgrade_time_seconds: costs[b.building_type]?.seconds ?? 60,
      can_upgrade: !b.upgrade_ends_at,
      locked_reason: null
    }))
  };
}

export async function queueBuildingUpgradeForUser(userId, buildingType) {
  return withTransaction(async (client) => {
    const bastion = await getBastionByUserId(userId, client);
    if (!bastion) throw new ApiError(404,'BASTION_NOT_FOUND','Bastion not found');
    const activeQueue = await getActiveBuildingQueueByBastionId(bastion.id, client);
    if (activeQueue) throw new ApiError(409,'BUILDING_QUEUE_BUSY','Another building upgrade is already in progress.');
    const selected = costs[buildingType];
    if (!selected) throw new ApiError(400,'INVALID_BUILDING_TYPE','Invalid building type');
    const result = await spendResourcesAndQueueBuildingUpgrade({ bastionId: bastion.id, buildingType, cost: selected, upgradeSeconds: selected.seconds }, client);
    if (!result || !result.building) throw new ApiError(409,'INSUFFICIENT_RESOURCES','Not enough resources to upgrade this building.');
    return {
      message: `${buildingType} upgrade queued.`,
      queued_upgrade: { building_type: result.building.building_type, from_level: result.building.level, to_level: result.building.level + 1, started_at: result.building.upgrade_started_at, ends_at: result.building.upgrade_ends_at },
      resources_after_spend: { timber: result.resources.timber, iron: result.resources.iron, grain: result.resources.grain, ember: result.resources.ember }
    };
  });
}
