// api/communities.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendPaginatedList } from './_utils.js';

// Função handler que lida com as requisições para a rota /api/communities.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') { 
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Busca as comunidades no Supabase, da que tem mais membros para a que tem menos.
  // A coluna icon diz qual desenho em pixel art a comunidade usa no Orkut.
  return sendPaginatedList(req, res, {
    table: 'communities',
    fields: 'id, name_pt, name_en, name_es, description_pt, description_en, description_es, members_count, category, icon',
    orderBy: 'members_count',
    ascending: false,
    logContext: 'communities',
    errorLabel: 'communities',
  });
}
