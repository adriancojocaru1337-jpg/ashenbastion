import { fail } from '../utils/http.js';
export function errorHandlerExpress(err, _req, res, _next) { const { statusCode, body } = fail(err); res.status(statusCode).json(body); }
