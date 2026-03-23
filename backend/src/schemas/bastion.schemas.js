import { z } from '../utils/validation.js';
export const upgradeBuildingBodySchema = z.object({
  buildingType: z.enum(['keep','lumberyard','ironMine','granary','emberKiln','storehouse','barracks','range','watchtower'])
});
