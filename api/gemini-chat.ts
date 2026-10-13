// api/gemini-chat.ts 
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Interface que representa uma mensagem de chat recebida do usuário ou do modelo.
interface IncomingChatMessage {
  role: 'user' | 'model';
  text: string;
}

type Language = 'pt' | 'en' | 'es';

// Limites de tamanho do que o front pode enviar (evita gastar a cota do Gemini com textos gigantes).
const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_ITEMS = 10;
const MAX_HISTORY_TEXT_LENGTH = 1000;

// Mensagens de fallback para diferentes situações, em português, inglês e espanhol.
const SYSTEM_PROMPTS: Record<Language, string> = {
  pt:
    'Você é um assistente virtual nostálgico dos anos 2000 representando a Beatriz Silva Santos. ' +
    'Responda perguntas sobre os projetos dela, tecnologias ' +
    '(React, Next.js, Node, C#) e carreira (Fatec, estágio na Hub Connect Eventos, Dublin). Seja simpático, use ' +
    'emoticons antigos (:), ;)), e mantenha respostas curtas como num chat real. Responda sempre em português. ' +
    "No final de cada resposta relevante, sugira: 'Quer ver o código? Clique aqui: https://github.com/BeatrizS97'.",
  en:
    'You are a nostalgic early-2000s virtual assistant representing Beatriz Silva Santos. ' +
    'Answer questions about her projects, technologies ' +
    '(React, Next.js, Node, C#) and career (Fatec, internship at Hub Connect Eventos, Dublin). Be friendly, use ' +
    'old-school emoticons (:), ;)), and keep answers short like in a real chat. Always answer in English. ' +
    "At the end of each relevant answer, suggest: 'Want to see the code? Click here: https://github.com/BeatrizS97'.",
  es:
    'Eres un asistente virtual nostálgico de los años 2000 que representa a Beatriz Silva Santos. ' +
    'Responde preguntas sobre sus proyectos, tecnologías ' +
    '(React, Next.js, Node, C#) y carrera (Fatec, pasantía en Hub Connect Eventos, Dublín). Sé simpático, usa ' +
    'emoticonos antiguos (:), ;)), y mantén respuestas cortas como en un chat real. Responde siempre en español. ' +
    "Al final de cada respuesta relevante, sugiere: '¿Quieres ver el código? Haz clic aquí: https://github.com/BeatrizS97'.",
};

// Regras para a IA falar de projetos SOMENTE com base nos dados reais do GitHub (evita alucinação).
const GROUNDING_RULES: Record<Language, { withData: string; withoutData: string }> = {
  pt: {
    withData:
      'Para falar dos projetos dela, use SOMENTE a lista de repositórios do GitHub abaixo. ' +
      'Se algo não estiver na lista, diga que não sabe em vez de inventar. Não invente links, tecnologias nem funcionalidades.',
    withoutData:
      'A lista de repositórios do GitHub não está disponível agora. Não cite detalhes de projetos específicos; ' +
      'apenas indique o perfil https://github.com/BeatrizS97.',
  },
  en: {
    withData:
      'When talking about her projects, use ONLY the GitHub repository list below. ' +
      "If something is not on the list, say you don't know instead of making it up. Never invent links, technologies or features.",
    withoutData:
      'The GitHub repository list is not available right now. Do not mention details of specific projects; ' +
      'just point to the profile https://github.com/BeatrizS97.',
  },
  es: {
    withData:
      'Para hablar de sus proyectos, usa SOLO la lista de repositorios de GitHub de abajo. ' +
      'Si algo no está en la lista, di que no lo sabes en lugar de inventar. No inventes enlaces, tecnologías ni funcionalidades.',
    withoutData:
      'La lista de repositorios de GitHub no está disponible ahora. No cites detalles de proyectos específicos; ' +
      'solo indica el perfil https://github.com/BeatrizS97.',
  },
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

// Usuário do GitHub cujos repositórios servem de contexto para a IA.
const GITHUB_USER = 'BeatrizS97';
// O contexto fica em cache por 10 minutos (a API do GitHub sem token permite só 60 requisições por hora por IP).
const GITHUB_CACHE_TTL_MS = 10 * 60 * 1000;
// Se o GitHub demorar mais que isso, o chat segue sem o contexto em vez de travar.
const GITHUB_TIMEOUT_MS = 3000;
const MAX_REPOS_IN_CONTEXT = 15;

// Campos do repositório que usamos (a API do GitHub devolve muitos outros).
interface GithubRepo {
  name: string;
  description: string | null;
  language: string | null;
  topics?: string[];
  html_url: string;
  homepage: string | null;
  fork: boolean;
  archived: boolean;
}

// Cache em memória (em serverless, cada instância tem o seu: é uma otimização "melhor esforço").
let githubCache: { context: string; timestamp: number } | null = null;

// Busca os repositórios públicos da Beatriz e monta um texto simples para a IA usar como fonte da verdade.
// Devolve null se o GitHub falhar: o chat continua funcionando, só sem detalhes de projetos.
async function fetchGithubContext(): Promise<string | null> {
  if (githubCache && Date.now() - githubCache.timestamp < GITHUB_CACHE_TTL_MS) {
    return githubCache.context;
  }

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'portfolio-retro',
    };
    // Token opcional (sem permissões especiais): só aumenta o limite de requisições.
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=30&sort=pushed`,
      { headers, signal: AbortSignal.timeout(GITHUB_TIMEOUT_MS) }
    );
    if (!response.ok) {
      throw new Error(`GitHub respondeu ${response.status}`);
    }

    const repos = (await response.json()) as GithubRepo[];
    const lines = repos
      .filter((repo) => !repo.fork && !repo.archived)
      .slice(0, MAX_REPOS_IN_CONTEXT)
      .map((repo) => {
        const description = (repo.description ?? 'no description').slice(0, 200);
        const topics = repo.topics && repo.topics.length > 0 ? ` | topics: ${repo.topics.join(', ')}` : '';
        const online = repo.homepage ? ` | online: ${repo.homepage}` : '';
        return `- ${repo.name}: ${description} | language: ${repo.language ?? 'n/a'}${topics} | code: ${repo.html_url}${online}`;
      });

    if (lines.length === 0) return null;

    const context = lines.join('\n');
    githubCache = { context, timestamp: Date.now() };
    return context;
  } catch (error) {
    console.error(
      JSON.stringify({
        level: 'error',
        context: 'gemini-chat:github',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      })
    );
    return null;
  }
}

// Monta o prompt final: personalidade + regra anti-alucinação + lista real de repositórios (quando disponível).
function buildSystemPrompt(lang: Language, githubContext: string | null): string {
  const rules = GROUNDING_RULES[lang];
  if (!githubContext) {
    return `${SYSTEM_PROMPTS[lang]} ${rules.withoutData}`;
  }
  return `${SYSTEM_PROMPTS[lang]} ${rules.withData}\n\nGITHUB REPOSITORIES (${GITHUB_USER}):\n${githubContext}`;
}

// Limpa o histórico recebido: só aceita itens no formato { role, text }, guarda os mais recentes e corta textos longos.
function sanitizeHistory(history: unknown): IncomingChatMessage[] {
  if (!Array.isArray(history)) return [];

  const clean = history
    .filter(
      (item): item is IncomingChatMessage =>
        typeof item === 'object' &&
        item !== null &&
        (item.role === 'user' || item.role === 'model') &&
        typeof item.text === 'string'
    )
    .slice(-MAX_HISTORY_ITEMS)
    .map((item) => ({ role: item.role, text: item.text.slice(0, MAX_HISTORY_TEXT_LENGTH) }));

  // O Gemini espera que o histórico comece com uma mensagem do usuário (o corte acima pode ter deixado uma do modelo na frente).
  while (clean.length > 0 && clean[0].role === 'model') {
    clean.shift();
  }
  return clean;
}

// Função handler que lida com as requisições para a rota /api/gemini-chat.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, reply: 'Method not allowed' });
  }

  // Extrai os campos da requisição: mensagem do usuário, histórico de mensagens e idioma preferido.
  const { message, history, language } = (req.body ?? {}) as {
    message?: string;
    history?: IncomingChatMessage[];
    language?: string;
  };

  // Qualquer valor diferente de 'en' ou 'es' cai no português (idioma padrão do site).
  const lang: Language = language === 'en' || language === 'es' ? language : 'pt';
  const texts = MESSAGES[lang];

  // Só aceita texto (um número ou objeto no lugar da mensagem derrubaria a função).
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ success: false, reply: texts.empty });
  }

  // Mensagens maiores que o limite são cortadas (em vez de recusadas) para o usuário ainda receber uma resposta.
  const userMessage = message.trim().slice(0, MAX_MESSAGE_LENGTH);

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Sem chave configurada — responde com um fallback simpático em vez de quebrar a UI,
    // no mesmo espírito de fallback-para-mock já usado pelos outros services do projeto.
    return res.status(200).json({ success: true, reply: texts.noKey });
  }

  // Tenta enviar a mensagem para o modelo Gemini e obter uma resposta.
  try {
    const contents = [
      ...sanitizeHistory(history).map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
      { role: 'user', parts: [{ text: userMessage }] },
    ];

    // Busca (ou reaproveita do cache) os repositórios reais antes de responder.
    const githubContext = await fetchGithubContext();

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: buildSystemPrompt(lang, githubContext) }] },
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