import express from 'express';
import { loginHandler, meHandler, registerHandler } from '../handlers/auth.handlers.js';
import { requireAuthExpress } from '../middleware/requireAuth.express.js';

export const authExpressRouter = express.Router();

authExpressRouter.post('/auth/register', async (req, res, next) => {
  try {
    const { statusCode, body } = await registerHandler({ body: req.body });
    res.status(statusCode).json(body);
  } catch (error) { next(error); }
});

authExpressRouter.post('/auth/login', async (req, res, next) => {
  try {
    const { statusCode, body } = await loginHandler({ body: req.body });
    res.status(statusCode).json(body);
  } catch (error) { next(error); }
});

authExpressRouter.get('/auth/me', requireAuthExpress, async (req, res, next) => {
  try {
    const { statusCode, body } = await meHandler({ user: req.user });
    res.status(statusCode).json(body);
  } catch (error) { next(error); }
});
