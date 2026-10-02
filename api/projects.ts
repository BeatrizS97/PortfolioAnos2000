// api/projects.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from './_supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabaseClient();
    const { category, featured } = req.query;

    let query = supabase.from('projects').select('*');

    if (typeof category === 'string') {
      query = query.eq('category', category);
    }
    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    query = query.order('order_index', { ascending: true });

    const { data, error } = await query;
    if (error) throw error;

    return res.status(200).json({
      success: true,
      data: data ?? [],
      total: data?.length ?? 0,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch projects',
    });
  }
}
