import { pool } from '../db/pool.js';

export async function createMarch({ originBastionId, targetLocationId, marchType, arrivesAt, distance, doctrineSnapshot }, client = pool) {
  const { rows } = await client.query(
    `INSERT INTO marches (origin_bastion_id, target_location_id, march_type, status, departs_at, arrives_at, distance, doctrine_snapshot)
     VALUES ($1,$2,$3::march_action_type,'travelling',now(),$4,$5,$6::doctrine_type) RETURNING *`,
    [originBastionId, targetLocationId, marchType, arrivesAt, distance, doctrineSnapshot]
  );
  return rows[0];
}

export async function insertMarchTroops(marchId, troops, client = pool) {
  for (const troop of troops) {
    await client.query(`INSERT INTO march_troops (march_id, troop_type, quantity_sent) VALUES ($1,$2::troop_type,$3)`, [marchId, troop.troopType, troop.quantity]);
  }
}

export async function getMarchTroops(marchId, client = pool) {
  const { rows } = await client.query(`SELECT troop_type, quantity_sent, quantity_survived FROM march_troops WHERE march_id = $1 ORDER BY troop_type`, [marchId]);
  return rows;
}

export async function setMarchTroopSurvivors(marchId, survivors, client = pool) {
  for (const troop of survivors) {
    await client.query(`UPDATE march_troops SET quantity_survived = $3 WHERE march_id = $1 AND troop_type = $2::troop_type`, [marchId, troop.troop_type, troop.quantity_survived]);
  }
}

export async function getDueMarchesByUserId(userId, client = pool) {
  const { rows } = await client.query(
    `SELECT m.*, b.user_id
     FROM marches m
     JOIN bastions b ON b.id = m.origin_bastion_id
     WHERE b.user_id = $1
       AND m.status = 'travelling'
       AND m.arrives_at <= now()
     ORDER BY m.arrives_at ASC`,
    [userId]
  );
  return rows;
}

export async function completeMarch(marchId, client = pool) {
  const { rows } = await client.query(`UPDATE marches SET status = 'completed' WHERE id = $1 RETURNING *`, [marchId]);
  return rows[0] ?? null;
}
