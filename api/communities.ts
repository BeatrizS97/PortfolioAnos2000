// api/communities.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from './_supabase';

// Função handler que lida com as requisições para a rota /api/communities.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') { 
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Tenta buscar os dados de comunidades do Supabase.
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .order('members_count', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ success: true, data: data ?? [] });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch communities' });
  }
}