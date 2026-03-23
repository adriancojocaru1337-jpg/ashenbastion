import { getBastionHandler, upgradeBuildingHandler } from '../handlers/bastion.handlers.js';
export async function bastionFastifyRoutes(fastify) {
  fastify.get('/api/bastion', async (request, reply)=>{ const { statusCode, body } = await getBastionHandler({ user: request.user }); return reply.code(statusCode).send(body); });
  fastify.post('/api/bastion/buildings/upgrade', async (request, reply)=>{ const { statusCode, body } = await upgradeBuildingHandler({ user: request.user, body: request.body }); return reply.code(statusCode).send(body); });
}
