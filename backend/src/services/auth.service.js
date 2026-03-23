import crypto from 'node:crypto';
import { ApiError } from '../utils/apiError.js';
import { withTransaction } from '../db/pool.js';
import { createUser, getUserAuthByEmail, getPlayerProfileByUserId } from '../repositories/users.repository.js';
import { bootstrapNewPlayer } from './bootstrap.service.js';

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(':');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
}

export async function registerUserAndBootstrap({ username, email, password, doctrine, bastionName }) {
  return withTransaction(async (client) => {
    const existing = await getUserAuthByEmail(email, client);
    if (existing) throw new ApiError(409, 'EMAIL_TAKEN', 'An account with this email already exists.');
    const user = await createUser({ username, email, passwordHash: hashPassword(password) }, client);
    await bootstrapNewPlayer({ userId: user.id, displayName: username, doctrine, bastionName }, client);
    const profile = await getPlayerProfileByUserId(user.id, client);
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        doctrine: profile?.doctrine ?? doctrine,
      }
    };
  });
}

export async function loginUser({ email, password }) {
  const user = await getUserAuthByEmail(email);
  if (!user) throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
  if (!verifyPassword(password, user.password_hash)) throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
  const profile = await getPlayerProfileByUserId(user.id);
  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      doctrine: profile?.doctrine ?? null,
    }
  };
}

export async function getMe(user) {
  const profile = await getPlayerProfileByUserId(user.id);
  return { user: { id: user.id, username: user.username, email: user.email, doctrine: profile?.doctrine ?? null } };
}
