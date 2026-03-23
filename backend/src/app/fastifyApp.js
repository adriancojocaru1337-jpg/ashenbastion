import Fastify from 'fastify';
import cors from '@fastify/cors';
import { authFastifyRoutes } from '../routes/auth.routes.fastify.js';
import { bastionFastifyRoutes } from '../routes/bastion.routes.fastify.js';
import { mapFastifyRoutes } from '../routes/map.routes.fastify.js';
import { reportsFastifyRoutes } from '../routes/reports.routes.fastify.js';
import { setDemoUserFastify } from '../middleware/setDemoUser.fastify.js';
import { fail } from '../utils/http.js';
import { ApiError } from '../utils/apiError.js';

export async function createFastifyApp() {
  const fastify = Fastify({ logger: true });
  await fastify.register(cors, { origin: true, allowedHeaders: ['Content-Type', 'x-user-id'] });
  fastify.addHook('preHandler', setDemoUserFastify);
  fastify.addHook('preHandler', async (request) => {
    if (request.routerPath?.startsWith('/api/auth/')) return;
    if (!request.user) throw new ApiError(401, 'UNAUTHORIZED', 'Authentication required');
  });
  fastify.setErrorHandler((error, _request, reply) => {
    const { statusCode, body } = fail(error);
    reply.code(statusCode).send(body);
  });
  await fastify.register(authFastifyRoutes);
  await fastify.register(bastionFastifyRoutes);
  await fastify.register(mapFastifyRoutes);
  await fastify.register(reportsFastifyRoutes);
  return fastify;
}
