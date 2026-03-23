import { parseOrThrow } from '../utils/validation.js';
import { ok } from '../utils/http.js';
import { upgradeBuildingBodySchema } from '../schemas/bastion.schemas.js';
import { getBastionBundleForUser, queueBuildingUpgradeForUser } from '../services/bastion.service.js';
export async function getBastionHandler({ user }) { return ok(await getBastionBundleForUser(user.id)); }
export async function upgradeBuildingHandler({ user, body }) { const parsed = parseOrThrow(upgradeBuildingBodySchema, body); return ok(await queueBuildingUpgradeForUser(user.id, parsed.buildingType)); }
