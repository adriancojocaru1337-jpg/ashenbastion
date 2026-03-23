import { pool } from '../db/pool.js';

export async function getPlayerOriginByUserId(userId, client = pool) {
  const { rows } = await client.query('SELECT id AS bastion_id, x, y, name FROM bastions WHERE user_id = $1', [userId]);
  return rows[0] ?? null;
}

export async function getVisibleMapLocationsForBastion({ originX, originY, radius = 12 }, client = pool) {
  const { rows } = await client.query(
    `SELECT ml.*, pp.display_name AS owner_display_name, b.user_id AS owner_user_id
     FROM map_locations ml
     LEFT JOIN bastions b ON b.id = ml.owner_bastion_id
     LEFT JOIN player_profiles pp ON pp.user_id = b.user_id
     WHERE ml.is_active = true AND ABS(ml.x - $1) <= $3 AND ABS(ml.y - $2) <= $3
     ORDER BY ml.y, ml.x`,
    [originX, originY, radius]
  );
  return rows;
}

export async function getLocationById(locationId, client = pool) {
  const { rows } = await client.query(
    `SELECT ml.*, pp.display_name AS owner_display_name, b.user_id AS owner_user_id
     FROM map_locations ml
     LEFT JOIN bastions b ON b.id = ml.owner_bastion_id
     LEFT JOIN player_profiles pp ON pp.user_id = b.user_id
     WHERE ml.id = $1`,
    [locationId]
  );
  return rows[0] ?? null;
}

export async function getAvailableTroopsForBastion(bastionId, client = pool) {
  const { rows } = await client.query(
    `SELECT ts.troop_type, ts.quantity - COALESCE((
      SELECT SUM(mt.quantity_sent)
      FROM march_troops mt JOIN marches m ON m.id = mt.march_id
      WHERE m.origin_bastion_id = ts.bastion_id AND m.status IN ('travelling','resolving','returning') AND mt.troop_type = ts.troop_type
    ),0) AS available
    FROM troop_stacks ts WHERE ts.bastion_id = $1 ORDER BY ts.troop_type`, [bastionId]
  );
  return rows;
}

export async function getNeutralForcesByLocationId(locationId, client = pool) {
  const { rows } = await client.query(
    `SELECT troop_type, quantity FROM neutral_forces WHERE location_id = $1 ORDER BY troop_type`,
    [locationId]
  );
  return rows;
}

export async function seedNeutralMapLocations(client = pool) {
  const rows = [
    ['ruin','Fallen Ruin',12,9,1,'Low','Sparse defenders. Suitable for a first raid.', [['reaver',4]]],
    ['ruin','Shattered Reliquary',8,13,2,'Medium','A richer ruin with better rewards and stronger resistance.', [['reaver',8],['pikeguard',3]]],
    ['beast_lair','Worg Lair',15,12,2,'Medium','A dangerous neutral target guarded by beasts.', [['reaver',10],['pikeguard',5]]]
  ];
  for (const [type, name, x, y, level, difficulty, notes, forces] of rows) {
    const inserted = await client.query(
      `INSERT INTO map_locations (location_type, name, x, y, level, difficulty_label, notes)
       VALUES ($1::map_location_type,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (x,y) DO UPDATE SET difficulty_label = EXCLUDED.difficulty_label
       RETURNING id`,
      [type, name, x, y, level, difficulty, notes]
    );
    const locationId = inserted.rows[0].id;
    for (const [troopType, quantity] of forces) {
      await client.query(
        `INSERT INTO neutral_forces (location_id, troop_type, quantity)
         VALUES ($1, $2::troop_type, $3)
         ON CONFLICT (location_id, troop_type) DO UPDATE SET quantity = EXCLUDED.quantity`,
        [locationId, troopType, quantity]
      );
    }
  }
}
