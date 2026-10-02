// api/gemini-chat.ts 
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Interface que representa uma mensagem de chat recebida do usuário ou do modelo.
interface IncomingChatMessage {
  role: 'user' | 'model';
  text: string;
}

type Language = 'pt' | 'en' | 'es';

// Mensagens de fallback para diferentes situações, em português, inglês e espanhol.
const SYSTEM_PROMPTS: Record<Language, string> = {
  pt:
    'Você é um assistente virtual nostálgico dos anos 2000 representando a Beatriz Silva Santos. ' +
    'Responda perguntas sobre os projetos dela (Hub Connect, Doe Vida, Portfolio), tecnologias ' +
    '(React, Next.js, Node, C#) e carreira (Fatec, Hub Connect, Dublin). Seja simpático, use ' +
    'emoticons antigos (:), ;)), e mantenha respostas curtas como num chat real. Responda sempre em português. ' +
    "No final de cada resposta relevante, sugira: 'Quer ver o código? Clique aqui: https://github.com/BeatrizS97'.",
  en:
    'You are a nostalgic early-2000s virtual assistant representing Beatriz Silva Santos. ' +
    'Answer questions about her projects (Hub Connect, Doe Vida, Portfolio), technologies ' +
    '(React, Next.js, Node, C#) and career (Fatec, Hub Connect, Dublin). Be friendly, use ' +
    'old-school emoticons (:), ;)), and keep answers short like in a real chat. Always answer in English. ' +
    "At the end of each relevant answer, suggest: 'Want to see the code? Click here: https://github.com/BeatrizS97'.",
  es:
    'Eres un asistente virtual nostálgico de los años 2000 que representa a Beatriz Silva Santos. ' +
    'Responde preguntas sobre sus proyectos (Hub Connect, Doe Vida, Portfolio), tecnologías ' +
    '(React, Next.js, Node, C#) y carrera (Fatec, Hub Connect, Dublín). Sé simpático, usa ' +
    'emoticonos antiguos (:), ;)), y mantén respuestas cortas como en un chat real. Responde siempre en español. ' +
    "Al final de cada respuesta relevante, sugiere: '¿Quieres ver el código? Haz clic aquí: https://github.com/BeatrizS97'.",
};

const MESSAGES: Record<Language, { empty: string; noKey: string; noAnswer: string; error: string }> = {
  pt: {
    empty: 'Mensagem vazia.',
    noKey:
      'Oi! Meu cérebro de IA ainda não foi conectado por aqui (falta configurar GEMINI_API_KEY no ' +
      'servidor). Mas dá uma olhada nos meus projetos no GitHub: https://github.com/BeatrizS97 :)',
    noAnswer: 'Hmm, não consegui pensar em uma resposta agora :/ tenta reformular?',
    error: 'Deu erro por aqui ao falar com a IA :( tenta de novo daqui a pouco.',
  },
  en: {
    empty: 'Empty message.',
    noKey:
      "Hi! My AI brain hasn't been connected here yet (GEMINI_API_KEY is missing on the " +
      'server). But check out my projects on GitHub: https://github.com/BeatrizS97 :)',
    noAnswer: "Hmm, I couldn't think of an answer right now :/ try rephrasing?",
    error: 'Something went wrong talking to the AI :( please try again in a bit.',
  },
  es: {
    empty: 'Mensaje vacío.',
    noKey:
      '¡Hola! Mi cerebro de IA todavía no está conectado por aquí (falta configurar GEMINI_API_KEY en el ' +
      'servidor). Pero échale un vistazo a mis proyectos en GitHub: https://github.com/BeatrizS97 :)',
    noAnswer: 'Hmm, no pude pensar en una respuesta ahora :/ ¿intentas reformular?',
    error: 'Hubo un error al hablar con la IA :( inténtalo de nuevo en un momento.',
  },
};

// Nome do modelo Gemini configurável via env var, com fallback para 'gemini-3.5-flash-lite' caso não esteja definido.
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-3.5-flash-lite';

// Função handler que lida com as requisições para a rota /api/gemini-chat.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, reply: 'Method not allowed' });
  }

  // Extrai os campos da requisição: mensagem do usuário, histórico de mensagens e idioma preferido.
  const { message, history, language } = req.body as {
    message?: string;
    history?: IncomingChatMessage[];
    language?: string;
  };

  // Qualquer valor diferente de 'en' ou 'es' cai no português (idioma padrão do site).
  const lang: Language = language === 'en' || language === 'es' ? language : 'pt';
  const texts = MESSAGES[lang];

  if (!message?.trim()) {
    return res.status(400).json({ success: false, reply: texts.empty });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Sem chave configurada — responde com um fallback simpático em vez de quebrar a UI,
    // no mesmo espírito de fallback-para-mock já usado pelos outros services do projeto.
    return res.status(200).json({ success: true, reply: texts.noKey });
  }

  // Tenta enviar a mensagem para o modelo Gemini e obter uma resposta.
  try {
    const contents = [
      ...(history ?? []).map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPTS[lang] }] },
        contents,
      }),
    });

    // Se a resposta do Gemini não for OK, lança um erro com o status retornado.
    if (!geminiResponse.ok) {
      throw new Error(`Gemini respondeu ${geminiResponse.status}`);
    }

    // Extrai o texto da resposta do Gemini, ou usa uma mensagem de fallback caso não haja resposta.
    const data = await geminiResponse.json();
    const reply: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? texts.noAnswer; 

    return res.status(200).json({ success: true, reply });
  } catch (error) {
    return res.status(500).json({ success: false, reply: texts.error });
  }
}
