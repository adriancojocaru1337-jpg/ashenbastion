import express from 'express';
import cors from 'cors';
import { authExpressRouter } from '../routes/auth.routes.express.js';
import { bastionExpressRouter } from '../routes/bastion.routes.express.js';
import { mapExpressRouter } from '../routes/map.routes.express.js';
import { reportsExpressRouter } from '../routes/reports.routes.express.js';
import { requireAuthExpress } from '../middleware/requireAuth.express.js';
import { errorHandlerExpress } from '../middleware/errorHandler.express.js';

export function createExpressApp() {
  const app = express();
  app.use(cors({ origin: true, exposedHeaders: ['x-user-id'], allowedHeaders: ['Content-Type', 'x-user-id'] }));
  app.use(express.json());
  app.use('/api', authExpressRouter);
  app.use('/api', requireAuthExpress, bastionExpressRouter);
  app.use('/api', requireAuthExpress, mapExpressRouter);
  app.use('/api', requireAuthExpress, reportsExpressRouter);
  app.use(errorHandlerExpress);
  return app;
}
