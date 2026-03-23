import { getMapHandler, createMarchHandler } from '../handlers/map.handlers.js';
export async function mapFastifyRoutes(fastify) {
  fastify.get('/api/map', async (request, reply)=>{ const { statusCode, body } = await getMapHandler({ user: request.user }); return reply.code(statusCode).send(body); });
  fastify.post('/api/map/marches', async (request, reply)=>{ const { statusCode, body } = await createMarchHandler({ user: request.user, body: request.body }); return reply.code(statusCode).send(body); });
}
