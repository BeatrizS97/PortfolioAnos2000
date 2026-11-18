// api/projects.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from './_supabase.js';
import { logError, PUBLIC_CACHE_CONTROL } from './_utils.js';

// Colunas devolvidas ao front (as mesmas do tipo Project).
const PROJECT_FIELDS =
  'id, title_pt, title_en, title_es, description_pt, description_en, description_es, tech_stack, github_url, live_url, image_url, category, featured, order_index, created_at, updated_at';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.from('projects').select(PROJECT_FIELDS).order('order_index', { ascending: true });
    if (error) throw error;

    res.setHeader('Cache-Control', PUBLIC_CACHE_CONTROL);
    return res.status(200).json({
      success: true,
      data: data ?? [],
      total: data?.length ?? 0,
    });
  } catch (error) {
    logError('projects', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch projects',
    });
  }
}
