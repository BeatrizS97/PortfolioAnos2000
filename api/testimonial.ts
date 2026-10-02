// api/testimonial.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from './_supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Validação do corpo da requisição para garantir que name, email e message estão presentes
  try {
    const { name, email, message } = req.body as { name?: string; email?: string; message?: string };

    // Valida se name, email e message não são nulos ou vazios
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, message: 'Preencha nome, email e depoimento.' });
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase.from('testimonial_requests').insert({ name, email, message });
    if (error) throw error;

    // Falta integrar com provedor de e-mail (Resend/SendGrid) para notificar
    // quando um novo depoimento chegar ao sistema. Verificar em contact.ts.

    return res.status(200).json({ success: true, message: 'Depoimento enviado! Obrigada 💌' });
  } catch (error) {
    // Validação para verificar se o erro é devido à configuração do Supabase (variáveis de ambiente não configuradas)
    const isConfigError = error instanceof Error && error.message.includes('SUPABASE_URL');
    const message = isConfigError
      ? 'Envio de depoimentos indisponível no momento (banco de dados não configurado). Tente novamente mais tarde.'
      : 'Erro ao enviar depoimento.';

    return res.status(500).json({ success: false, message });
  }
}