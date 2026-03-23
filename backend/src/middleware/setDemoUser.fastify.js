import { getUserById } from '../repositories/users.repository.js';

export async function setDemoUserFastify(request, _reply) {
  const userId = request.headers['x-user-id'] || process.env.DEMO_USER_ID;
  if (!userId) return;
  const user = await getUserById(userId);
  if (user) request.user = user;
}
