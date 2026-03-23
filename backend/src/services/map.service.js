import { ApiError } from '../utils/apiError.js';
import { withTransaction } from '../db/pool.js';
import { getPlayerProfileByUserId } from '../repositories/users.repository.js';
import { getAvailableTroopsForBastion, getLocationById, getPlayerOriginByUserId, getVisibleMapLocationsForBastion } from '../repositories/map.repository.js';
import { createMarch, insertMarchTroops } from '../repositories/marches.repository.js';
import { resolveDueMarchesForUser } from './reports.service.js';

const troopSpeeds = { reaver:8, pikeguard:6, ashbowman:7, ravensworn:12 };
const troopRoles = { reaver:'Cheap raider', pikeguard:'Defensive infantry', ashbowman:'Balanced ranged', ravensworn:'Scout' };

export async function getMapBundleForUser(userId) {
  await resolveDueMarchesForUser(userId);
  const origin = await getPlayerOriginByUserId(userId);
  if (!origin) throw new ApiError(404,'BASTION_NOT_FOUND','Origin bastion not found');
  const [locations, availableTroops] = await Promise.all([
    getVisibleMapLocationsForBastion({ originX: origin.x, originY: origin.y }),
    getAvailableTroopsForBastion(origin.bastion_id)
  ]);
  return {
    world: { width:100, height:100 },
    player_origin: origin,
    locations: locations.map(l => ({ id:l.id, name:l.name, type:l.location_type, x:l.x, y:l.y, owner:l.owner_display_name ? { player_id:l.owner_user_id, display_name:l.owner_display_name } : null, difficulty:l.difficulty_label, notes:l.notes })),
    available_troops: availableTroops.map(t => ({ troop_type:t.troop_type, name:t.troop_type, available:Number(t.available), speed:troopSpeeds[t.troop_type], role:troopRoles[t.troop_type] }))
  };
}

export async function createMarchForUser(userId, payload) {
  return withTransaction(async (client) => {
    const origin = await getPlayerOriginByUserId(userId, client);
    if (!origin) throw new ApiError(404,'BASTION_NOT_FOUND','Origin bastion not found');
    const target = await getLocationById(payload.targetId, client);
    if (!target) throw new ApiError(404,'INVALID_TARGET','The selected target does not exist.');
    if (payload.action === 'scout' && payload.troops.some(t => t.troopType !== 'ravensworn')) throw new ApiError(400,'INVALID_SCOUT_COMPOSITION','Scout marches may only include scouting units.');
    const available = await getAvailableTroopsForBastion(origin.bastion_id, client);
    const availableMap = Object.fromEntries(available.map(t=>[t.troop_type, Number(t.available)]));
    for (const t of payload.troops) if ((availableMap[t.troopType] ?? 0) < t.quantity) throw new ApiError(409,'INSUFFICIENT_TROOPS','You do not have enough available troops for this march.');
    const distance = Math.max(Math.abs(origin.x - target.x), Math.abs(origin.y - target.y));
    const slowestSpeed = Math.min(...payload.troops.map(t => troopSpeeds[t.troopType]));
    const travelTimeSeconds = Math.max(5, distance * 5);
    const arrivesAt = new Date(Date.now() + travelTimeSeconds * 1000);
    const profile = await getPlayerProfileByUserId(userId, client);
    const march = await createMarch({ originBastionId: origin.bastion_id, targetLocationId: target.id, marchType: payload.action, arrivesAt, distance, doctrineSnapshot: profile?.doctrine ?? null }, client);
    await insertMarchTroops(march.id, payload.troops, client);
    return { message:'March dispatched.', march: { march_id:march.id, action:march.march_type, origin:{ bastion_id:origin.bastion_id, name:origin.name, x:origin.x, y:origin.y }, target:{ location_id:target.id, name:target.name, type:target.location_type, x:target.x, y:target.y }, troops: payload.troops.map(t=>({ troop_type:t.troopType, quantity:t.quantity })), distance, slowest_speed:slowestSpeed, travel_time_seconds:travelTimeSeconds, departs_at:march.departs_at, arrives_at:march.arrives_at, status:march.status } };
  });
}
