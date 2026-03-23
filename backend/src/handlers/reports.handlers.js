import { parseOrThrow } from '../utils/validation.js';
import { ok } from '../utils/http.js';
import { reportIdParamsSchema } from '../schemas/reports.schemas.js';
import { getReportDetailForUser, listReportsForUser } from '../services/reports.service.js';

export async function listReportsHandler({ user }) {
  return ok(await listReportsForUser(user.id));
}

export async function getReportHandler({ user, params }) {
  const parsed = parseOrThrow(reportIdParamsSchema, params);
  return ok(await getReportDetailForUser(user.id, parsed.reportId));
}
