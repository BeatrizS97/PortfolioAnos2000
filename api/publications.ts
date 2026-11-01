// api/publications.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from './_supabase.js';
import { getPagination, logError } from './_utils.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { limit, from, to } = getPagination(req);
    const supabase = getSupabaseClient();
    const { data, error, count } = await supabase
      .from('publications')
      .select('id, authors, year, title_pt, title_en, title_es, venue, doi, order_index', { count: 'exact' })
      .order('order_index', { ascending: true })
      .range(from, to);

    if (error) throw error;

    const total = count ?? 0;
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
    return res.status(200).json({ success: true, data: data ?? [], hasMore: from + limit < total, total });
  } catch (error) {
    logError('publications', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch publications' });
  }
}