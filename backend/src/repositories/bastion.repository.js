import { pool } from '../db/pool.js';

export async function getBastionByUserId(userId, client = pool) {
  const { rows } = await client.query('SELECT * FROM bastions WHERE user_id = $1', [userId]);
  return rows[0] ?? null;
}
export async function createBastionForUser({ userId, name, x, y }, client = pool) {
  const { rows } = await client.query(
    `INSERT INTO bastions (user_id, name, x, y, timber, iron, grain, ember, timber_per_hour, iron_per_hour, grain_per_hour, ember_per_hour, storage_capacity)
     VALUES ($1,$2,$3,$4,500,500,400,100,60,50,55,0,1500)
     RETURNING *`,
    [userId, name, x, y]
  );
  return rows[0];
}
export async function getBuildingsByBastionId(bastionId, client = pool) {
  const { rows } = await client.query('SELECT * FROM bastion_buildings WHERE bastion_id = $1 ORDER BY building_type', [bastionId]);
  return rows;
}
export async function getActiveBuildingQueueByBastionId(bastionId, client = pool) {
  const { rows } = await client.query(`SELECT * FROM bastion_buildings WHERE bastion_id = $1 AND upgrade_ends_at IS NOT NULL AND upgrade_ends_at > now() ORDER BY upgrade_ends_at ASC LIMIT 1`, [bastionId]);
  return rows[0] ?? null;
}
export async function getTroopStacksByBastionId(bastionId, client = pool) {
  const { rows } = await client.query('SELECT * FROM troop_stacks WHERE bastion_id = $1 ORDER BY troop_type', [bastionId]);
  return rows;
}
export async function getActiveTrainingQueueByBastionId(bastionId, client = pool) {
  const { rows } = await client.query(`SELECT * FROM troop_training_queue WHERE bastion_id = $1 AND status IN ('queued','training') ORDER BY started_at`, [bastionId]);
  return rows;
}
export async function seedDefaultBuildingsForBastion(bastionId, client = pool) {
  const defaults = [['keep',1],['lumberyard',1],['iron_mine',1],['granary',1],['ember_kiln',0],['storehouse',1],['barracks',0],['range',0],['watchtower',0]];
  for (const [type, level] of defaults) {
    await client.query(`INSERT INTO bastion_buildings (bastion_id, building_type, level) VALUES ($1, $2::building_type, $3) ON CONFLICT (bastion_id, building_type) DO NOTHING`, [bastionId, type, level]);
  }
}
export async function seedDefaultTroopsForBastion(bastionId, client = pool) {
  const defaults = [['reaver',8],['pikeguard',4],['ashbowman',0],['ravensworn',2]];
  for (const [type, qty] of defaults) {
    await client.query(`INSERT INTO troop_stacks (bastion_id, troop_type, quantity) VALUES ($1, $2::troop_type, $3) ON CONFLICT (bastion_id, troop_type) DO UPDATE SET quantity = EXCLUDED.quantity`, [bastionId, type, qty]);
  }
}
export async function spendResourcesAndQueueBuildingUpgrade({ bastionId, buildingType, cost, upgradeSeconds }, client = pool) {
  const res = await client.query(
    `UPDATE bastions SET timber = timber - $2, iron = iron - $3, grain = grain - $4, ember = ember - $5
     WHERE id = $1 AND timber >= $2 AND iron >= $3 AND grain >= $4 AND ember >= $5 RETURNING *`,
    [bastionId, cost.timber, cost.iron, cost.grain, cost.ember]
  );
  if (!res.rows[0]) return null;
  const building = await client.query(
    `UPDATE bastion_buildings SET upgrade_started_at = now(), upgrade_ends_at = now() + ($3 || ' seconds')::interval
     WHERE bastion_id = $1 AND building_type = $2::building_type AND upgrade_ends_at IS NULL RETURNING *`,
    [bastionId, toDbBuildingType(buildingType), String(upgradeSeconds)]
  );
  return { resources: res.rows[0], building: building.rows[0] ?? null };
}
export function toDbBuildingType(buildingType) {
  return { ironMine:'iron_mine', emberKiln:'ember_kiln' }[buildingType] ?? buildingType;
}

export async function findOpenSpawnCoordinates(client = pool) {
  const candidates = [
    [10,10],[5,5],[15,5],[5,15],[15,15],[20,10],[10,20],[20,20],[25,10],[10,25]
  ];
  for (const [x,y] of candidates) {
    const { rows } = await client.query('SELECT 1 FROM bastions WHERE x = $1 AND y = $2 LIMIT 1', [x,y]);
    if (!rows[0]) return { x, y };
  }
  const { rows } = await client.query('SELECT COALESCE(MAX(x), 0) + 5 AS x, COALESCE(MAX(y), 0) + 5 AS y FROM bastions');
  return { x: rows[0].x, y: rows[0].y };
}
