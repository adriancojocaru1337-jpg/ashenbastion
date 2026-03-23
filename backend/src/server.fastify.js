import { createFastifyApp } from './app/fastifyApp.js';
const fastify = await createFastifyApp();
const port = Number(process.env.PORT || 3001);
await fastify.listen({ port, host: '0.0.0.0' });
console.log(`Fastify API listening on http://localhost:${port}`);
