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
    'Você é um assistente virtual nostálgico dos anos 2000 representando a Beatriz Silva Santos. Seu nome é Jarvis. ' +
    'Responda perguntas sobre os projetos dela, tecnologias ' +
    '(React, Next.js, Node, C#) e carreira (Fatec, estágio na Hub Connect Eventos, Dublin). Seja simpático, use ' +
    'emoticons antigos (:), ;)), e mantenha respostas curtas como num chat real. Responda sempre em português. ' +
    'Seja natural na conversa e técnica quando a pergunta pedir (cite as tecnologias reais). ' +
    "No final de cada resposta relevante, sugira: 'Quer ver o código? Clique aqui: https://github.com/BeatrizS97'.",
  en:
    'You are a nostalgic early-2000s virtual assistant representing Beatriz Silva Santos. Your name is Jarvis. ' +
    'Answer questions about her projects, technologies ' +
    '(React, Next.js, Node, C#) and career (Fatec, internship at Hub Connect Eventos, Dublin). Be friendly, use ' +
    'old-school emoticons (:), ;)), and keep answers short like in a real chat. Always answer in English. ' +
    'Be natural in conversation and technical when the question asks for it (cite the real technologies). ' +
    "At the end of each relevant answer, suggest: 'Want to see the code? Click here: https://github.com/BeatrizS97'.",
  es:
    'Eres un asistente virtual nostálgico de los años 2000 que representa a Beatriz Silva Santos. Su nombre es Jarvis. ' +
    'Responde preguntas sobre sus proyectos, tecnologías ' +
    '(React, Next.js, Node, C#) y carrera (Fatec, pasantía en Hub Connect Eventos, Dublín). Sé simpático, usa ' +
    'emoticonos antiguos (:), ;)), y mantén respuestas cortas como en un chat real. Responde siempre en español. ' +
    'Sé natural en la conversación y técnica cuando la pregunta lo pida (cita las tecnologías reales). ' +
    "Al final de cada respuesta relevante, sugiere: '¿Quieres ver el código? Haz clic aquí: https://github.com/BeatrizS97'.",
};

const PORTFOLIO_FACTS = [
  'FATOS SOBRE A BEATRIZ (fonte de verdade):',
  '- Beatriz Silva Santos, Desenvolvedora Full Stack Jr (React.js, Next.js, TypeScript, Node.js), de Itanhaém, SP. Também trabalha com C#/.NET no back-end, com passagem por PHP e SQL.',
  '- Estágio Full Stack na Hub Connect Eventos (fev/2026 – ago/2026): criou o site institucional do zero, otimizou SEO, GA4/GTM, padronizou componentes reutilizáveis em React/Next.js e melhorou em 20% a compreensão do comportamento do usuário.',
  '- Formação: Análise e Desenvolvimento de Sistemas na Fatec Praia Grande (fev/2023 – jul/2026); Licenciatura em Letras (Português e Inglês) na Universidade Cruzeiro do Sul (2015 – 2018).',
  '- Idiomas: português nativo, inglês B1, espanhol A2.',
  '- Certificações: Scrum Fundamentals Certified (SCRUMstudy, jun/2025); Formação Web Essencial (BIT); Crescendo no Trabalho – JobRise; extensão USP/ESALQ em metodologias ágeis; Trilha de IA com React (Santander Open Academy, em andamento).',
  '- Intercâmbio: um mês em Dublin (ISI Dublin, jul–ago/2025). Voluntariado: vice-presidente da Associação Pedra Que Canta (2022 – dez/2025), liderou uma equipe voluntária por 3 anos.',
  '- Publicação: artigo sobre inovação tecnológica e inclusão escolar (Revista Processando o Saber, FATEC PG, 2025).',
  '- Aberta a vagas de Desenvolvedora Front-end ou Full Stack Júnior. LinkedIn: https://www.linkedin.com/in/beatrizsilvasantos-dev | GitHub: https://github.com/BeatrizS97',
  '- PROJETOS:',
  '  * Doe Vida: SPA mobile-first com React, Vite, Tailwind CSS e OpenStreetMap API; acha hemocentros próximos e calcula a distância. Código: https://github.com/BeatrizS97/Projeto-Doe-Vida',
  '  * Form Generator: app full stack colaborativo (HTML, CSS, JavaScript, PHP, SQL) para criar formulários com lógica condicional. Código: https://github.com/tatcom23/Form-Generator',
  '  * Portfólio Pessoal: HTML5, SCSS3 e JavaScript puro, sem framework. Online: https://beatrizs97.github.io/Portfolio/',
  '  * ATSAdapta: React, Vite, Gemini API, pdfkit e docx; reescreve currículos no método STAR, adapta a vagas e checa compatibilidade ATS. Código: https://github.com/BeatrizS97/ATSAdapta',
  '  * InspireFoto: galeria de paisagens em Vue 3, Vite e SCSS, com favoritos e filtros. Online: https://projeto-inspire-foto.vercel.app/ | Código: https://github.com/BeatrizS97/Projeto-Inspire-Foto',
  '  * Banco de Trocas de Conhecimento: Node.js, Express, Prisma, PostgreSQL e React, com autenticação JWT. Online: https://projeto-banco-troca-de-conhecimento.vercel.app/ | Código: https://github.com/BeatrizS97/Projeto-Banco-Troca-de-Conhecimento',
  '  * Cinema de Terror: HTML, SCSS e JavaScript puro (sem framework), com animações, jumpscare e modal; primeiro projeto com SCSS. Código: https://github.com/BeatrizS97/Cinema',
  '  * Este site (portfólio retrô, estilo Windows XP/Orkut/MSN): React 18, Vite, TypeScript, CSS puro, TanStack Query, funções serverless da Vercel e Supabase (PostgreSQL); o chat usa a Gemini API. Código: https://github.com/BeatrizS97',
  'Se a pergunta não puder ser respondida com estes fatos ou com a lista de repositórios, diga que não sabe e sugira o LinkedIn ou o GitHub.',
].join('\n');

// Regras para a IA falar de projetos SOMENTE com base nos dados reais do GitHub (evita alucinação).
const GROUNDING_RULES: Record<Language, { withData: string; withoutData: string }> = {
  pt: {
    withData:
      'Para falar dela e dos projetos, use SOMENTE os FATOS e a lista de repositórios do GitHub abaixo. ' +
      'Se algo não estiver neles, diga que não sabe em vez de inventar. Não invente links, tecnologias nem funcionalidades.',
    withoutData:
      'A lista de repositórios do GitHub não está disponível agora. Use SOMENTE os FATOS abaixo; ' +
      'para mais detalhes, indique o perfil https://github.com/BeatrizS97.',
  },
  en: {
    withData:
      'When talking about her and her projects, use ONLY the FACTS and the GitHub repository list below. ' +
      "If something is not in them, say you don't know instead of making it up. Never invent links, technologies or features.",
    withoutData:
      'The GitHub repository list is not available right now. Use ONLY the FACTS below; ' +
      'for more details, point to the profile https://github.com/BeatrizS97.',
  },
  es: {
    withData:
      'Para hablar de ella y de sus proyectos, usa SOLO los HECHOS (FATOS) y la lista de repositorios de GitHub de abajo. ' +
      'Si algo no está en ellos, di que no lo sabes en lugar de inventar. No inventes enlaces, tecnologías ni funcionalidades.',
    withoutData:
      'La lista de repositorios de GitHub no está disponible ahora. Usa SOLO los HECHOS (FATOS) de abajo; ' +
      'para más detalles, indica el perfil https://github.com/BeatrizS97.',
  },
};

const MESSAGES: Record<Language, { empty: string; noKey: string; noAnswer: string; error: string; rateLimit: string }> = {
  pt: {
    empty: 'Mensagem vazia.',
    noKey:
      'Oi! Meu cérebro de IA ainda não foi conectado por aqui (falta configurar GEMINI_API_KEY no ' +
      'servidor). Mas dá uma olhada nos meus projetos no GitHub: https://github.com/BeatrizS97 :)',
    noAnswer: 'Hmm, não consegui pensar em uma resposta agora :/ tenta reformular?',
    error: 'Deu erro por aqui ao falar com a IA :( tenta de novo daqui a pouco.',
    rateLimit: 'Muitas mensagens ao mesmo tempo :( aguarda um instante e tenta de novo.',
  },
  en: {
    empty: 'Empty message.',
    noKey:
      "Hi! My AI brain hasn't been connected here yet (GEMINI_API_KEY is missing on the " +
      'server). But check out my projects on GitHub: https://github.com/BeatrizS97 :)',
    noAnswer: "Hmm, I couldn't think of an answer right now :/ try rephrasing?",
    error: 'Something went wrong talking to the AI :( please try again in a bit.',
    rateLimit: 'Too many messages at once :( wait a moment and try again.',
  },
  es: {
    empty: 'Mensaje vacío.',
    noKey:
      '¡Hola! Mi cerebro de IA todavía no está conectado por aquí (falta configurar GEMINI_API_KEY en el ' +
      'servidor). Pero échale un vistazo a mis proyectos en GitHub: https://github.com/BeatrizS97 :)',
    noAnswer: 'Hmm, no pude pensar en una respuesta ahora :/ ¿intentas reformular?',
    error: 'Hubo un error al hablar con la IA :( inténtalo de nuevo en un momento.',
    rateLimit: 'Demasiados mensajes a la vez :( espera un momento e inténtalo de nuevo.',
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
  // Os fatos reais entram sempre; a lista de repositórios do GitHub só quando o GitHub respondeu.
  if (!githubContext) {
    return `${SYSTEM_PROMPTS[lang]} ${rules.withoutData}\n\n${PORTFOLIO_FACTS}`;
  }
  return `${SYSTEM_PROMPTS[lang]} ${rules.withData}\n\n${PORTFOLIO_FACTS}\n\nGITHUB REPOSITORIES (${GITHUB_USER}):\n${githubContext}`;
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
    // Status 503 (e não 200): assim o front reconhece que a IA está indisponível e usa a base local de respostas.
    return res.status(503).json({ success: false, reply: texts.noKey });
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
    // Limite de requisições do Gemini: devolve 429 de verdade ao front, que mostra "aguarde um instante".
    if (geminiResponse.status === 429) {
      console.error(
        JSON.stringify({ level: 'error', context: 'gemini-chat:rate-limit', message: 'Gemini respondeu 429', timestamp: new Date().toISOString() })
      );
      return res.status(429).json({ success: false, reply: texts.rateLimit });
    }

    if (!geminiResponse.ok) {
      // Guarda o começo do corpo do erro (ex.: chave inválida, modelo inexistente) para aparecer nos logs da Vercel.
      const errorBody = await geminiResponse.text().catch(() => '');
      throw new Error(`Gemini respondeu ${geminiResponse.status}: ${errorBody.slice(0, 300)}`);
    }

    // Extrai o texto da resposta do Gemini, ou usa uma mensagem de fallback caso não haja resposta.
    const data = await geminiResponse.json();
    const reply: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? texts.noAnswer; 

    return res.status(200).json({ success: true, reply });
  } catch (error) {
    // Antes este erro era engolido em silêncio; agora fica registrado (JSON) nos logs da Vercel, como já é feito no contexto do GitHub.
    console.error(
      JSON.stringify({
        level: 'error',
        context: 'gemini-chat',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      })
    );
    return res.status(500).json({ success: false, reply: texts.error });
  }
}