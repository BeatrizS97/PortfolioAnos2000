// api/education.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from './_supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;

    return res.status(200).json({ success: true, data: data ?? [] });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch education' });
  }
}