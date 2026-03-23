import { parseOrThrow } from '../utils/validation.js';
import { ok } from '../utils/http.js';
import { loginBodySchema, registerBodySchema } from '../schemas/auth.schemas.js';
import { getMe, loginUser, registerUserAndBootstrap } from '../services/auth.service.js';

export async function registerHandler({ body }) {
  const parsed = parseOrThrow(registerBodySchema, body);
  return ok(await registerUserAndBootstrap(parsed), 201);
}

export async function loginHandler({ body }) {
  const parsed = parseOrThrow(loginBodySchema, body);
  return ok(await loginUser(parsed));
}

export async function meHandler({ user }) {
  return ok(await getMe(user));
}
