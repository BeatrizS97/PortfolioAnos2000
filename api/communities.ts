// api/communities.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from './_supabase';
import { getPagination, logError } from './_utils';

// Função handler que lida com as requisições para a rota /api/communities.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') { 
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Tenta buscar os dados de comunidades do Supabase.
  try {
    const { limit, from, to } = getPagination(req);
    const supabase = getSupabaseClient();
    const { data, error, count } = await supabase
      .from('communities')
      .select('id, name, members_count, category', { count: 'exact' })
      .order('members_count', { ascending: false })
      .range(from, to);

    if (error) throw error;

    const total = count ?? 0;
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
    return res.status(200).json({ success: true, data: data ?? [], hasMore: from + limit < total, total });
  } catch (error) {
    logError('communities', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch communities' });
  }
}