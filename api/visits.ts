// api/visits.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from './_supabase.js';
import { applyRateLimit, logError } from './_utils.js';

// Registra a PRIMEIRA visita de um navegador (o front só chama esta rota uma vez por navegador, ver src/services/visitsService.ts).
// Cada visita vira uma linha na tabela site_visits; o total é o número de linhas (veja como consultar no schema.sql, bloco 13).
// Não guarda IP, nome nem nenhum outro dado da pessoa: só o momento da visita.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Limita quantas visitas cada IP pode registrar (impede inflar o contador chamando a rota várias vezes).
  // A resposta 429 já é enviada dentro da função.
  if (applyRateLimit(req, res, 'visits')) return;

  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('site_visits').insert({});
    if (error) throw error;

    return res.status(201).json({ success: true });
  } catch (error) {
    logError('visits', error);
    return res.status(500).json({ success: false, error: 'Failed to register visit' });
  }
}