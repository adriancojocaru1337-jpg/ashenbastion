import { z } from '../utils/validation.js';
export const createMarchBodySchema = z.object({
  targetId: z.string().min(1),
  action: z.enum(['scout','raid','attack']),
  troops: z.array(z.object({ troopType: z.enum(['reaver','pikeguard','ashbowman','ravensworn']), quantity: z.number().int().positive() })).min(1)
});
