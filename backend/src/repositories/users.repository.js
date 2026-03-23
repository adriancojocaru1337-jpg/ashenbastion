import { pool } from '../db/pool.js';

export async function getUserById(userId, client = pool) {
  const { rows } = await client.query('SELECT id, username, email, created_at, last_login_at, is_verified, status FROM users WHERE id = $1', [userId]);
  return rows[0] ?? null;
}

export async function getUserAuthByEmail(email, client = pool) {
  const { rows } = await client.query('SELECT id, username, email, password_hash FROM users WHERE lower(email) = lower($1)', [email]);
  return rows[0] ?? null;
}

export async function createUser({ username, email, passwordHash }, client = pool) {
  const { rows } = await client.query(
    `INSERT INTO users (username, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, username, email, created_at`,
    [username, email, passwordHash]
  );
  return rows[0];
}

export async function getPlayerProfileByUserId(userId, client = pool) {
  const { rows } = await client.query('SELECT * FROM player_profiles WHERE user_id = $1', [userId]);
  return rows[0] ?? null;
}
export async function createPlayerProfile({ userId, displayName, doctrine, title = 'Warden of the Bastion' }, client = pool) {
  const { rows } = await client.query(
    `INSERT INTO player_profiles (user_id, display_name, doctrine, title)
     VALUES ($1, $2, $3::doctrine_type, $4)
     RETURNING *`,
    [userId, displayName, doctrine, title]
  );
  return rows[0];
}
