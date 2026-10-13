// api/_email.ts
import { Resend } from 'resend';

interface SendEmailParams {
  subject: string;
  html: string;
  replyTo?: string;
}

// Envia um e-mail para a Beatriz usando o Resend.
// Variáveis: RESEND_API_KEY, CONTACT_TO_EMAIL (destino) e CONTACT_FROM_EMAIL (opcional).
export async function sendEmail({ subject, html, replyTo }: SendEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !to) {
    throw new Error('Variáveis RESEND_API_KEY / CONTACT_TO_EMAIL não configuradas.');
  }

  const from = process.env.CONTACT_FROM_EMAIL ?? 'Portfólio <onboarding@resend.dev>';
  const resend = new Resend(apiKey);

  // O Resend não lança exceção: devolve { data, error }. Por isso verificamos o error manualmente.
  const { error } = await resend.emails.send({ from, to, subject, html, replyTo });
  if (error) {
    throw new Error(`Resend: ${error.message}`);
  }
}