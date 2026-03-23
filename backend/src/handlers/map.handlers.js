import { parseOrThrow } from '../utils/validation.js';
import { ok } from '../utils/http.js';
import { createMarchBodySchema } from '../schemas/map.schemas.js';
import { createMarchForUser, getMapBundleForUser } from '../services/map.service.js';
export async function getMapHandler({ user }) { return ok(await getMapBundleForUser(user.id)); }
export async function createMarchHandler({ user, body }) { const parsed = parseOrThrow(createMarchBodySchema, body); return ok(await createMarchForUser(user.id, parsed)); }
