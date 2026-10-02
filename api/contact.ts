// api/contact.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Valida os campos obrigatórios: nome, email e mensagem. Se algum estiver vazio, retorna um erro 400 (Bad Request).
  try {
    const { name, email, message } = req.body as { name?: string; email?: string; message?: string };
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, message: 'Preencha nome, email e mensagem.' });
    }

    // Falta implementar o envio da mensagem de contato com um provedor de e-mail (ex.: Resend, SendGrid) para
    // encaminhar a mensagem. 
    console.log('Nova mensagem de contato recebida:', { name, email });

    return res.status(200).json({
      success: true,
      message: 'Mensagem enviada com sucesso! Em breve você receberá uma resposta.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erro ao enviar mensagem.' });
  }
}
