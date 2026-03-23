import { ApiError } from '../utils/apiError.js';
import { getUserById } from '../repositories/users.repository.js';

export async function requireAuthExpress(req, _res, next) {
  try {
    const userId = req.header('x-user-id') || process.env.DEMO_USER_ID;
    if (!userId) return next(new ApiError(401, 'UNAUTHORIZED', 'Authentication required'));
    const user = await getUserById(userId);
    if (!user) return next(new ApiError(401, 'UNAUTHORIZED', 'Invalid user session'));
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
