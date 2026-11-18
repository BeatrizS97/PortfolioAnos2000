// api/testimonial.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from './_supabase.js';
import { sendEmail } from './_email.js';
import {
  messageSchema,
  sanitizeText,
  escapeHtml,
  formatValidationErrors,
  applyRateLimit,
  logError,
} from './_utils.js';

// Converte os marcadores da barra de formatação do formulário em HTML:
// **negrito** -> <strong>, __sublinhado__ -> <u>, _itálico_ -> <em>.
function formatMarkers(escapedText: string): string {
  return escapedText
    .replace(/\*\*(?=\S)([^\n]+?)(?<=\S)\*\*/gu, '<strong>$1</strong>')
    .replace(/(?<![\p{L}\p{N}_])__(?=\S)([^\n]+?)(?<=\S)__(?![\p{L}\p{N}_])/gu, '<u>$1</u>')
    .replace(/(?<![\p{L}\p{N}_])_(?=\S)([^\n_]+?)(?<=\S)_(?![\p{L}\p{N}_])/gu, '<em>$1</em>');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Limita quantos depoimentos cada IP pode enviar (anti-spam). A resposta 429 já é enviada dentro da função.
  if (applyRateLimit(req, res, 'testimonial')) return;

  // Validação do corpo da requisição para garantir que name, email e message estão presentes
  try {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const result = messageSchema.safeParse({
      name: sanitizeText(body.name),
      email: sanitizeText(body.email),
      message: sanitizeText(body.message),
    });

    // Valida se name, email e message não são nulos ou vazios
    if (!result.success) {
      return res.status(400).json({ success: false, ...formatValidationErrors(result.error) });
    }

    const { name, email, message } = result.data;

    const supabase = getSupabaseClient();
    const { error } = await supabase.from('testimonial_requests').insert({ name, email, message });
    if (error) throw error;

    // Falta integrar com provedor de e-mail (Resend/SendGrid) para notificar
    // quando um novo depoimento chegar ao sistema.
    // (Integrado abaixo com o Resend.) O depoimento já está salvo no banco, então se o e-mail falhar apenas registramos o erro.
    try {
      await sendEmail({
        subject: `Novo depoimento de ${name.replace(/[\r\n]+/g, ' ')}`,
        replyTo: email,
        html: `
          <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
          <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
          <p><strong>Depoimento:</strong></p>
          <p>${formatMarkers(escapeHtml(message)).replace(/\n/g, '<br>')}</p>
        `,
      });
    } catch (emailError) {
      logError('testimonial:email', emailError);
    }

    return res.status(200).json({ success: true, message: 'Depoimento enviado! Obrigada 💌' });
  } catch (error) {
    logError('testimonial', error);

    // Validação para verificar se o erro é devido à configuração do Supabase (variáveis de ambiente não configuradas)
    const isConfigError = error instanceof Error && error.message.includes('SUPABASE_URL');
    const message = isConfigError
      ? 'Envio de depoimentos indisponível no momento (banco de dados não configurado). Tente novamente mais tarde.'
      : 'Erro ao enviar depoimento.';

    return res.status(500).json({ success: false, message });
  }
}