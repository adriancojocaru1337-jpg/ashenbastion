import express from 'express';
import { getBastionHandler, upgradeBuildingHandler } from '../handlers/bastion.handlers.js';
export const bastionExpressRouter = express.Router();
bastionExpressRouter.get('/bastion', async (req,res,next)=>{ try { const { statusCode, body } = await getBastionHandler({ user:req.user }); res.status(statusCode).json(body); } catch (e) { next(e); } });
bastionExpressRouter.post('/bastion/buildings/upgrade', async (req,res,next)=>{ try { const { statusCode, body } = await upgradeBuildingHandler({ user:req.user, body:req.body }); res.status(statusCode).json(body); } catch (e) { next(e); } });
