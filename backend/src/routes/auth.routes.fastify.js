import { loginHandler, meHandler, registerHandler } from '../handlers/auth.handlers.js';

export async function authFastifyRoutes(fastify) {
  fastify.post('/api/auth/register', async (request, reply) => {
    const { statusCode, body } = await registerHandler({ body: request.body });
    return reply.code(statusCode).send(body);
  });

  fastify.post('/api/auth/login', async (request, reply) => {
    const { statusCode, body } = await loginHandler({ body: request.body });
    return reply.code(statusCode).send(body);
  });

  fastify.get('/api/auth/me', async (request, reply) => {
    const { statusCode, body } = await meHandler({ user: request.user });
    return reply.code(statusCode).send(body);
  });
}
