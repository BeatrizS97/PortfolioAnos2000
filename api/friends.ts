// api/friends.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendPaginatedList } from './_utils.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  return sendPaginatedList(req, res, {
    table: 'friends',
    fields: 'id, name, avatar_url, role_pt, role_en, role_es',
    orderBy: 'order_index',
    ascending: true,
    logContext: 'friends',
    errorLabel: 'friends',
  });
}
