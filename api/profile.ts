// api/profile.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from './_supabase.js';
import { logError, PUBLIC_CACHE_CONTROL } from './_utils.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('profile')
      .select(
        'id, full_name, headline_pt, headline_en, headline_es, location, about_me_pt, about_me_en, about_me_es, about_extra_pt, about_extra_en, about_extra_es, about_hub_connect_pt, about_hub_connect_en, about_hub_connect_es, photo_url, email, linkedin_url, github_url'
      )
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    res.setHeader('Cache-Control', PUBLIC_CACHE_CONTROL);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    logError('profile', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch profile' });
  }
}
