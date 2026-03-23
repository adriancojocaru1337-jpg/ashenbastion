import { getReportHandler, listReportsHandler } from '../handlers/reports.handlers.js';
export async function reportsFastifyRoutes(fastify) {
  fastify.get('/api/reports', async (request, reply) => {
    const { statusCode, body } = await listReportsHandler({ user: request.user });
    return reply.code(statusCode).send(body);
  });
  fastify.get('/api/reports/:reportId', async (request, reply) => {
    const { statusCode, body } = await getReportHandler({ user: request.user, params: request.params });
    return reply.code(statusCode).send(body);
  });
}
