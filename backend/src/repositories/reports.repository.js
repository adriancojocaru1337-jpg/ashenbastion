import { pool } from '../db/pool.js';

export async function createReport({ ownerUserId, reportType, relatedMarchId = null, title, summary, payload }, client = pool) {
  const { rows } = await client.query(
    `INSERT INTO reports (owner_user_id, report_type, related_march_id, title, summary, payload_json)
     VALUES ($1, $2::report_type, $3, $4, $5, $6::jsonb)
     RETURNING *`,
    [ownerUserId, reportType, relatedMarchId, title, summary, JSON.stringify(payload ?? {})]
  );
  return rows[0] ?? null;
}

export async function listReportsByUserId(userId, client = pool) {
  const { rows } = await client.query(
    `SELECT id, report_type, related_march_id, title, summary, payload_json, created_at, is_read
     FROM reports
     WHERE owner_user_id = $1
     ORDER BY created_at DESC
     LIMIT 50`,
    [userId]
  );
  return rows;
}

export async function getReportByIdForUser(userId, reportId, client = pool) {
  const { rows } = await client.query(
    `SELECT id, report_type, related_march_id, title, summary, payload_json, created_at, is_read
     FROM reports
     WHERE owner_user_id = $1 AND id = $2`,
    [userId, reportId]
  );
  return rows[0] ?? null;
}

export async function markReportRead(userId, reportId, client = pool) {
  const { rows } = await client.query(`UPDATE reports SET is_read = true WHERE owner_user_id = $1 AND id = $2 RETURNING *`, [userId, reportId]);
  return rows[0] ?? null;
}
