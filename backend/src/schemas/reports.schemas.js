import { z } from '../utils/validation.js';

export const reportIdParamsSchema = z.object({
  reportId: z.string().uuid(),
});
