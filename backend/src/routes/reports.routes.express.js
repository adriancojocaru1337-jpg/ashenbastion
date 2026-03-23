import express from 'express';
import { getReportHandler, listReportsHandler } from '../handlers/reports.handlers.js';
export const reportsExpressRouter = express.Router();
reportsExpressRouter.get('/reports', async (req,res,next)=>{ try { const { statusCode, body } = await listReportsHandler({ user:req.user }); res.status(statusCode).json(body); } catch (e) { next(e); } });
reportsExpressRouter.get('/reports/:reportId', async (req,res,next)=>{ try { const { statusCode, body } = await getReportHandler({ user:req.user, params:req.params }); res.status(statusCode).json(body); } catch (e) { next(e); } });
