// api/certifications.ts

// Importa os tipos VercelRequest e VercelResponse para tipagem das requisições e respostas.
import type { VercelRequest, VercelResponse } from '@vercel/node';
// Importa a função getSupabaseClient para obter o cliente Supabase.
import { getSupabaseClient } from './_supabase.js';
// Importa o helper de paginação (mesmo padrão do scraps.ts) e o log estruturado de erros.
import { getPagination, logError } from './_utils.js';

// Função handler que lida com as requisições para a rota /api/certifications.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') { // Verifica se o método da requisição é GET. Se não for, retorna um erro 405 (Method Not Allowed).
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Tenta buscar os dados de certificações do Supabase.
  try {
    const { limit, from, to } = getPagination(req);
    const supabase = getSupabaseClient();
    const { data, error, count } = await supabase
      .from('certifications') // Seleciona a tabela 'certifications' no Supabase
      .select('id, title_pt, title_en, title_es, order_index', { count: 'exact' }) // Seleciona apenas os campos usados pelo front
      .order('order_index', { ascending: true }) // Ordena os resultados pelo campo 'order_index' em ordem crescente
      .range(from, to);
    if (error) throw error;

    const total = count ?? 0;
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
    return res.status(200).json({ success: true, data: data ?? [], hasMore: from + limit < total, total });
  } catch (error) {
    logError('certifications', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch certifications' });
  }
}