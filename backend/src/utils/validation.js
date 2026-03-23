import { z } from 'zod';
import { ApiError } from './apiError.js';
export function parseOrThrow(schema, data) { const r = schema.safeParse(data); if (!r.success) throw new ApiError(400,'VALIDATION_ERROR','Request validation failed', r.error.flatten()); return r.data; }
export { z };
