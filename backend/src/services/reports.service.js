import { withTransaction } from '../db/pool.js';
import { getPlayerProfileByUserId } from '../repositories/users.repository.js';
import { getLocationById, getNeutralForcesByLocationId, getPlayerOriginByUserId } from '../repositories/map.repository.js';
import { completeMarch, getDueMarchesByUserId, getMarchTroops, setMarchTroopSurvivors } from '../repositories/marches.repository.js';
import { createReport, getReportByIdForUser, listReportsByUserId, markReportRead } from '../repositories/reports.repository.js';
import { ApiError } from '../utils/apiError.js';

const attackStats = { reaver: 18, pikeguard: 11, ashbowman: 15, ravensworn: 2 };
const defenseStats = { reaver: 10, pikeguard: 22, ashbowman: 15, ravensworn: 2 };
const displayNames = { reaver: 'Reaver', pikeguard: 'Pikeguard', ashbowman: 'Ashbowman', ravensworn: 'Ravensworn' };
const roleNames = { scout: 'Scout', raid: 'Raid', attack: 'Attack' };

function locationLabel(location) { return location?.name ?? 'Unknown location'; }
function computeStrength(rows, statMap, qtyField) { return rows.reduce((sum, row) => sum + (Number(row[qtyField]) * (statMap[row.troop_type] ?? 0)), 0); }
function summarizeTroops(rows, qtyField) { return rows.filter(r => Number(r[qtyField]) > 0).map(r => ({ troop_type: r.troop_type, name: displayNames[r.troop_type] ?? r.troop_type, quantity: Number(r[qtyField]) })); }
function computeSurvivors(attackerTroops, attackStrength, defenseStrength) {
  if (!attackerTroops.length) return [];
  if (defenseStrength <= 0) return attackerTroops.map(t => ({ troop_type: t.troop_type, quantity_survived: Number(t.quantity_sent) }));
  const ratio = Math.min(1, defenseStrength / Math.max(1, attackStrength));
  const lossPct = Math.min(0.9, 0.2 + ratio * 0.5);
  return attackerTroops.map(t => ({ troop_type: t.troop_type, quantity_survived: Math.max(0, Math.floor(Number(t.quantity_sent) * (1 - lossPct))) }));
}
function buildLoot(location, victory, marchType) {
  if (!victory || marchType === 'scout') return { timber: 0, iron: 0, grain: 0, ember: 0 };
  if (location.location_type === 'ruin') return location.level >= 2 ? { timber: 220, iron: 170, grain: 140, ember: 6 } : { timber: 140, iron: 100, grain: 80, ember: 2 };
  if (location.location_type === 'beast_lair') return { timber: 260, iron: 220, grain: 170, ember: 8 };
  return { timber: 0, iron: 0, grain: 0, ember: 0 };
}

async function resolveOneMarch(march, client) {
  const [origin, target, troops, profile] = await Promise.all([
    getPlayerOriginByUserId(march.user_id, client),
    getLocationById(march.target_location_id, client),
    getMarchTroops(march.id, client),
    getPlayerProfileByUserId(march.user_id, client),
  ]);
  if (!origin || !target) { await completeMarch(march.id, client); return; }

  if (march.march_type === 'scout') {
    const defenders = target.location_type === 'player_bastion' ? [] : await getNeutralForcesByLocationId(target.id, client);
    await setMarchTroopSurvivors(march.id, troops.map(t => ({ troop_type: t.troop_type, quantity_survived: Number(t.quantity_sent) })), client);
    await completeMarch(march.id, client);
    await createReport({
      ownerUserId: march.user_id,
      reportType: 'scout',
      relatedMarchId: march.id,
      title: `Scout report: ${locationLabel(target)}`,
      summary: target.location_type === 'player_bastion' ? `Your scouts observed ${locationLabel(target)}.` : `Your scouts surveyed ${locationLabel(target)} and returned with intel.`,
      payload: { action: 'scout', target: { id: target.id, name: target.name, type: target.location_type, difficulty: target.difficulty_label, notes: target.notes }, defenders: summarizeTroops(defenders, 'quantity'), origin: { name: origin.name, x: origin.x, y: origin.y }, doctrine: profile?.doctrine ?? null },
    }, client);
    return;
  }

  const defenders = target.location_type === 'player_bastion' ? [] : await getNeutralForcesByLocationId(target.id, client);
  const attackStrength = computeStrength(troops, attackStats, 'quantity_sent');
  const defenseStrength = computeStrength(defenders, defenseStats, 'quantity');
  const victory = attackStrength >= Math.max(1, defenseStrength);
  const survivors = computeSurvivors(troops, attackStrength, defenseStrength);
  const loot = buildLoot(target, victory, march.march_type);

  await setMarchTroopSurvivors(march.id, survivors, client);
  await completeMarch(march.id, client);
  const outcomeLabel = victory ? 'Victory' : 'Defeat';
  await createReport({
    ownerUserId: march.user_id,
    reportType: march.march_type === 'raid' ? 'raid' : 'attack',
    relatedMarchId: march.id,
    title: `${roleNames[march.march_type]} report: ${locationLabel(target)}`,
    summary: `${outcomeLabel}. ${victory ? 'Your forces returned with spoils.' : 'The defenders held their ground.'}`,
    payload: { action: march.march_type, target: { id: target.id, name: target.name, type: target.location_type, difficulty: target.difficulty_label }, outcome: outcomeLabel.toLowerCase(), attack_strength: attackStrength, defense_strength: defenseStrength, attackers: summarizeTroops(troops, 'quantity_sent'), defenders: summarizeTroops(defenders, 'quantity'), survivors, loot, doctrine: profile?.doctrine ?? null },
  }, client);
}

export async function resolveDueMarchesForUser(userId) {
  return withTransaction(async (client) => {
    const dueMarches = await getDueMarchesByUserId(userId, client);
    for (const march of dueMarches) await resolveOneMarch(march, client);
    return { resolved: dueMarches.length };
  });
}

export async function listReportsForUser(userId) {
  await resolveDueMarchesForUser(userId);
  return listReportsByUserId(userId);
}

export async function getReportDetailForUser(userId, reportId) {
  await resolveDueMarchesForUser(userId);
  const report = await getReportByIdForUser(userId, reportId);
  if (!report) throw new ApiError(404, 'REPORT_NOT_FOUND', 'Report not found');
  await markReportRead(userId, reportId);
  return { ...report, is_read: true };
}
