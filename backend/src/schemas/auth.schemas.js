import { z } from '../utils/validation.js';

export const registerBodySchema = z.object({
  username: z.string().min(3).max(24).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  doctrine: z.enum(['warborn','stone_oath','ember_rite','veil_path','harvest_covenant']).default('ember_rite'),
  bastionName: z.string().min(3).max(40).default('Ashenbastion'),
});

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});
