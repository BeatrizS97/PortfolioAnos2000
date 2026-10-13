// api/contact.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendEmail } from './_email';
import {
  messageSchema,
  sanitizeText,
  escapeHtml,
  formatValidationErrors,
  applyRateLimit,
  logError,
} from './_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Limita quantas mensagens cada IP pode enviar (anti-spam). A resposta 429 já é enviada dentro da função.
  if (applyRateLimit(req, res, 'contact')) return;

  // Valida os campos obrigatórios: nome, email e mensagem. Se algum estiver vazio, retorna um erro 400 (Bad Request).
  try {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const result = messageSchema.safeParse({
      name: sanitizeText(body.name),
      email: sanitizeText(body.email),
      message: sanitizeText(body.message),
    });

    if (!result.success) {
      return res.status(400).json({ success: false, ...formatValidationErrors(result.error) });
    }

    const { name, email, message } = result.data;

    // Falta implementar o envio da mensagem de contato com um provedor de e-mail (ex.: Resend, SendGrid) para
    // encaminhar a mensagem. 
    // (Implementado abaixo com o Resend.) O replace evita quebra de linha no assunto do e-mail.
    await sendEmail({
      subject: `Nova mensagem de contato de ${name.replace(/[\r\n]+/g, ' ')}`,
      replyTo: email,
      html: `
        <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: 'Mensagem enviada com sucesso! Em breve você receberá uma resposta.',
    });
  } catch (error) {
    logError('contact', error);
    return res.status(500).json({ success: false, message: 'Erro ao enviar mensagem.' });
  }
}