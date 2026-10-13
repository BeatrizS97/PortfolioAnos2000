// api/scraps.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from './_supabase';
import { logError, applyRateLimit, sanitizeText } from './_utils';

// Colunas devolvidas ao front (as mesmas do tipo Scrap).
const SCRAP_FIELDS = 'id, author_name, author_avatar, message, is_public, created_at';

// Tamanhos máximos aceitos num recado novo.
const MAX_AUTHOR_NAME_LENGTH = 80;
const MAX_MESSAGE_LENGTH = 500;

export default async function handler(req: VercelRequest, res: VercelResponse) {
 
  if (req.method === 'GET') {
    // Validação dos parâmetros de consulta para paginação
    try {
      const supabase = getSupabaseClient();
      const limit = Number(req.query.limit ?? 10); // Limite de itens por página, padrão 10
      const page = Number(req.query.page ?? 1); // Página atual, padrão 1
      const from = (page - 1) * limit; // Índice inicial para a consulta
      const to = from + limit - 1; // Índice final para a consulta

      const { data, error, count } = await supabase
        .from('scraps')
        .select(SCRAP_FIELDS, { count: 'exact' })
        .eq('is_public', true)
        // Recados excluídos (soft delete) não aparecem. O filtro é feito aqui porque a chave service_role ignora o RLS.
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const total = count ?? 0;
      return res.status(200).json({
        success: true,
        data: data ?? [],
        hasMore: from + limit < total,
        total,
      });
    } catch (error) {
      logError('scraps:get', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch scraps' });
    }
  }

  if (req.method === 'POST') {
    // Limita quantos recados cada IP pode enviar (anti-spam). A resposta 429 já é enviada dentro da função.
    if (applyRateLimit(req, res, 'scraps-post')) return;

    // Validação do corpo da requisição para garantir que authorName e message estão presentes
    try {
      const supabase = getSupabaseClient();
      const { authorName, message } = req.body as { authorName?: string; message?: string };

      // Remove HTML/JS dos textos antes de validar e salvar (se o valor não for texto, vira string vazia).
      const cleanName = sanitizeText(authorName);
      const cleanMessage = sanitizeText(message);

      // Valida se authorName e message não são nulos ou vazios
      if (!cleanName || !cleanMessage) {
        return res.status(400).json({ success: false, error: 'authorName e message são obrigatórios' });
      }

      if (cleanName.length > MAX_AUTHOR_NAME_LENGTH || cleanMessage.length > MAX_MESSAGE_LENGTH) {
        return res.status(400).json({
          success: false,
          error: `Nome (máx. ${MAX_AUTHOR_NAME_LENGTH}) ou recado (máx. ${MAX_MESSAGE_LENGTH}) muito longo.`,
        });
      }

      const { data, error } = await supabase
        .from('scraps')
        .insert({ author_name: cleanName, message: cleanMessage, is_public: true })
        .select(SCRAP_FIELDS)
        .single();

      if (error) throw error;

      return res.status(201).json({ success: true, data });
    } catch (error) {
      logError('scraps:post', error);
      return res.status(500).json({ success: false, error: 'Failed to create scrap' });
    }
  }

  if (req.method === 'DELETE') {
    // Limita as tentativas por IP para dificultar adivinhar a ADMIN_KEY por força bruta.
    // A resposta 429 já é enviada dentro da função.
    if (applyRateLimit(req, res, 'scraps-delete')) return;

    // Só a Beatriz pode excluir: o front envia a chave digitada no header x-admin-key.
    try {
      const supabase = getSupabaseClient();
      const adminKey = process.env.ADMIN_KEY;

      // Sem ADMIN_KEY configurada no servidor, ninguém exclui nada (evita aceitar qualquer chave).
      if (!adminKey) {
        logError('scraps:delete', new Error('Variável ADMIN_KEY não configurada.'));
        return res.status(500).json({ success: false, error: 'Admin não configurado' });
      }

      const sentKey = req.headers['x-admin-key'];
      if (typeof sentKey !== 'string' || sentKey !== adminKey) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      // O front chama DELETE /api/scraps?id=<uuid>
      const id = req.query.id;
      if (typeof id !== 'string' || !id.trim()) {
        return res.status(400).json({ success: false, error: 'id é obrigatório' });
      }

      // Soft delete: em vez de apagar a linha, marca deleted_at. O recado some do site, mas continua no banco.
      // .select('id') devolve as linhas apagadas; se vier vazio, o recado não existia.
      const { data, error } = await supabase
        .from('scraps')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .is('deleted_at', null)
        .select('id');
      if (error) throw error;

      if (!data || data.length === 0) {
        return res.status(404).json({ success: false, error: 'Recado não encontrado' });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      logError('scraps:delete', error);
      return res.status(500).json({ success: false, error: 'Failed to delete scrap' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}