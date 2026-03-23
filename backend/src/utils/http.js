export function ok(data, statusCode = 200) { return { statusCode, body: { ok: true, data } }; }
export function fail(error) { return { statusCode: error.statusCode || 500, body: { ok: false, error: { code: error.code || 'INTERNAL_ERROR', message: error.message || 'Unexpected error', ...(error.details ? { details: error.details } : {}) } } }; }
