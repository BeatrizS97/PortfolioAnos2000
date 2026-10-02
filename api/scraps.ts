// api/scraps.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from './_supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabase = getSupabaseClient();
 
  if (req.method === 'GET') {
    // Validação dos parâmetros de consulta para paginação
    try {
      const limit = Number(req.query.limit ?? 10); // Limite de itens por página, padrão 10
      const page = Number(req.query.page ?? 1); // Página atual, padrão 1
      const from = (page - 1) * limit; // Índice inicial para a consulta
      const to = from + limit - 1; // Índice final para a consulta

      const { data, error, count } = await supabase
        .from('scraps')
        .select('*', { count: 'exact' })
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const total = count ?? 0;
      return res.status(200).json({
        success: true,
        data: data ?? [],
        hasMore: from + limit < total,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Failed to fetch scraps' });
    }
  }

  if (req.method === 'POST') {
    // Validação do corpo da requisição para garantir que authorName e message estão presentes
    try {
      const { authorName, message } = req.body as { authorName?: string; message?: string };

      // Valida se authorName e message não são nulos ou vazios
      if (!authorName?.trim() || !message?.trim()) {
        return res.status(400).json({ success: false, error: 'authorName e message são obrigatórios' });
      }

      const { data, error } = await supabase
        .from('scraps')
        .insert({ author_name: authorName, message, is_public: true })
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Failed to create scrap' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
