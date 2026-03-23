import express from 'express';
import { getMapHandler, createMarchHandler } from '../handlers/map.handlers.js';
export const mapExpressRouter = express.Router();
mapExpressRouter.get('/map', async (req,res,next)=>{ try { const { statusCode, body } = await getMapHandler({ user:req.user }); res.status(statusCode).json(body); } catch (e) { next(e); } });
mapExpressRouter.post('/map/marches', async (req,res,next)=>{ try { const { statusCode, body } = await createMarchHandler({ user:req.user, body:req.body }); res.status(statusCode).json(body); } catch (e) { next(e); } });
