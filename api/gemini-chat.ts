// api/gemini-chat.ts 
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from './_supabase.js';
import { applyRateLimit, logError } from './_utils.js';

// Interface que representa uma mensagem de chat recebida do usuário ou do modelo.
interface IncomingChatMessage {
  role: 'user' | 'model';
  text: string;
}

// Parte da resposta do Gemini que usamos (o texto pode vir dividido em vários trechos).
interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
}

type Language = 'pt' | 'en' | 'es';

// Links públicos da Beatriz usados nos prompts e nas mensagens de erro, escritos só aqui.
// A mensagem noKey roda antes de qualquer consulta ao banco, então estes links não podem vir de lá.
const GITHUB_PROFILE_URL = 'https://github.com/BeatrizS97';
const LINKEDIN_PROFILE_URL = 'https://www.linkedin.com/in/beatrizsilvasantos-dev';

// Limites de tamanho do que o front pode enviar (evita gastar a cota do Gemini com textos gigantes).
const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_ITEMS = 10;
const MAX_HISTORY_TEXT_LENGTH = 1000;
// Máximo de mensagens à IA por IP a cada 10 minutos (o padrão das outras rotas, 5, seria pouco para um chat).
const GEMINI_RATE_LIMIT_MAX_REQUESTS = 20;

// Mensagens de fallback para diferentes situações, em português, inglês e espanhol.
const SYSTEM_PROMPTS: Record<Language, string> = {
  pt:
    'Você é um assistente virtual nostálgico dos anos 2000 representando a Beatriz Silva Santos. Seu nome é Jarvis. ' +
    'Responda perguntas sobre os projetos dela, tecnologias ' +
    '(React, Next.js, Node, C#) e carreira (Fatec, estágio na Hub Connect Eventos, Dublin). Seja simpático, use ' +
    'emoticons antigos (:), ;)), e mantenha respostas curtas como num chat real. Responda sempre em português. ' +
    'Seja natural na conversa e técnica quando a pergunta pedir (cite as tecnologias reais). ' +
    "Quando falar de um projeto específico, termine com o link direto dele (código e, se existir, versão online), copiado dos FATOS ou da lista de repositórios, " +
    "no formato: 'Quer ver o código? Clique aqui: <link do projeto>'. Se a pergunta não for sobre um projeto específico (e não for sobre vagas ou contato), sugira o perfil: " + GITHUB_PROFILE_URL + ". " +
    "Se perguntarem se ela está aberta a vagas, oportunidades ou como entrar em contato, responda que sim e passe o e-mail e o LinkedIn dela (copiados dos FATOS), em vez de indicar só o GitHub. " +
    "A conversa já começa com uma saudação sua, em que você se apresenta como Jarvis: não se apresente de novo nem repita a saudação, responda direto ao que a pessoa disse ou perguntou. " +
    "Só responda sobre a Beatriz, seus projetos, tecnologias, formação e carreira. " +
    "Se a pergunta for sobre outro assunto, diga com simpatia que só pode falar sobre ela e sugira perguntar sobre os projetos ou a carreira.",
  en:
    'You are a nostalgic early-2000s virtual assistant representing Beatriz Silva Santos. Your name is Jarvis. ' +
    'Answer questions about her projects, technologies ' +
    '(React, Next.js, Node, C#) and career (Fatec, internship at Hub Connect Eventos, Dublin). Be friendly, use ' +
    'old-school emoticons (:), ;)), and keep answers short like in a real chat. Always answer in English. ' +
    'Be natural in conversation and technical when the question asks for it (cite the real technologies). ' +
    "When talking about a specific project, end with its direct link (code and, if it exists, the live version), copied from the FACTS or the repository list, " +
    "in the format: 'Want to see the code? Click here: <project link>'. If the question is not about a specific project (and not about job openings or contact), suggest the profile: " + GITHUB_PROFILE_URL + ". " +
    "If asked whether she is open to job opportunities or how to get in touch, say yes and give her email and LinkedIn (copied from the FACTS) instead of pointing only to GitHub. " +
    "The conversation already starts with a greeting from you introducing yourself as Jarvis: do not introduce yourself again or repeat the greeting, answer directly what the person said or asked. " +
    "Only answer about Beatriz, her projects, technologies, education and career. " +
    "If the question is about anything else, kindly say you can only talk about her and suggest asking about her projects or career.",
  es:
    'Eres un asistente virtual nostálgico de los años 2000 que representa a Beatriz Silva Santos. Su nombre es Jarvis. ' +
    'Responde preguntas sobre sus proyectos, tecnologías ' +
    '(React, Next.js, Node, C#) y carrera (Fatec, pasantía en Hub Connect Eventos, Dublín). Sé simpático, usa ' +
    'emoticonos antiguos (:), ;)), y mantén respuestas cortas como en un chat real. Responde siempre en español. ' +
    'Sé natural en la conversación y técnica cuando la pregunta lo pida (cita las tecnologías reales). ' +
    "Cuando hables de un proyecto específico, termina con su enlace directo (código y, si existe, versión en línea), copiado de los HECHOS o de la lista de repositorios, " +
    "con el formato: '¿Quieres ver el código? Haz clic aquí: <enlace del proyecto>'. Si la pregunta no es sobre un proyecto específico (y no es sobre vacantes o contacto), sugiere el perfil: " + GITHUB_PROFILE_URL + ". " +
    "Si preguntan si ella está abierta a vacantes u oportunidades, o cómo contactarla, responde que sí y da su correo electrónico y su LinkedIn (copiados de los HECHOS), en lugar de indicar solo GitHub. " +
    "La conversación ya empieza con un saludo tuyo en el que te presentas como Jarvis: no te presentes de nuevo ni repitas el saludo, responde directamente a lo que la persona dijo o preguntó. " +
    "Solo responde sobre Beatriz, sus proyectos, tecnologías, formación y carrera. " +
    "Si la pregunta es sobre otro tema, di con simpatía que solo puedes hablar de ella y sugiere preguntar por sus proyectos o su carrera.",
};

// Linhas do banco usadas nos fatos (só as colunas em português; o prompt é montado a partir delas).
interface ProfileRow {
  full_name: string;
  headline_pt: string | null;
  location: string | null;
  about_me_pt: string | null;
  email: string | null;
  linkedin_url: string | null;
  github_url: string | null;
}
interface EducationRow { course_pt: string }
interface LanguageRow { language_pt: string }
interface CertificationRow { title_pt: string }
interface ExperienceRow { title_pt: string; period_pt: string | null; description_pt: string | null }
interface ExchangeRow { description_pt: string }
interface PublicationRow { authors: string; year: number; title_pt: string; venue: string; doi: string }
interface ProjectRow {
  title_pt: string;
  description_pt: string | null;
  tech_stack: string[] | null;
  github_url: string | null;
  live_url: string | null;
}

// Fatos que NÃO estão no banco. Todo o resto (perfil, contato, formação, experiência, intercâmbio, projetos...) vem do Supabase, a mesma fonte do site.
const EXTRA_FACTS = [
  '- Também trabalha com C#/.NET no back-end, com passagem por PHP e SQL.',
  '- Aberta a vagas de Desenvolvedora Front-end ou Full Stack Júnior.',
  '- Este site (portfólio retrô, estilo Windows XP/Orkut/MSN): React 18, Vite, TypeScript, CSS puro, TanStack Query, funções serverless da Vercel e Supabase (PostgreSQL); o chat usa a Gemini API. Código: ' + GITHUB_PROFILE_URL,
  'Se a pergunta não puder ser respondida com estes fatos ou com a lista de repositórios, diga que não sabe e sugira o LinkedIn ou o GitHub.',
];

// Os dados do banco também ficam em cache por 10 minutos (mesmo padrão do GitHub).
const DATABASE_CACHE_TTL_MS = 10 * 60 * 1000;
let databaseCache: { text: string; timestamp: number } | null = null;

// Converte o resultado de uma busca do Supabase numa lista (vazia se não vier nada).
function toRows<T>(result: { data: unknown }): T[] {
  return (result.data ?? []) as T[];
}

// Busca no Supabase os mesmos dados que o site exibe e monta um texto simples para a IA.
// Assim o chat e o site usam a mesma fonte e nunca ficam diferentes.
// Devolve null se o banco falhar: o chat continua funcionando, só com os fatos extras.
async function fetchDatabaseFacts(): Promise<string | null> {
  if (databaseCache && Date.now() - databaseCache.timestamp < DATABASE_CACHE_TTL_MS) {
    return databaseCache.text;
  }

  try {
    const supabase = getSupabaseClient();
    const [profile, education, languages, certifications, experience, exchange, publications, projects] = await Promise.all([
      supabase
        .from('profile')
        .select('full_name, headline_pt, location, about_me_pt, email, linkedin_url, github_url')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabase.from('education').select('course_pt').order('order_index', { ascending: true }),
      supabase.from('languages').select('language_pt').order('order_index', { ascending: true }),
      supabase.from('certifications').select('title_pt').order('order_index', { ascending: true }),
      supabase.from('experience').select('title_pt, period_pt, description_pt').order('order_index', { ascending: true }),
      supabase.from('exchange').select('description_pt').order('order_index', { ascending: true }),
      supabase.from('publications').select('authors, year, title_pt, venue, doi').order('order_index', { ascending: true }),
      supabase.from('projects').select('title_pt, description_pt, tech_stack, github_url, live_url').order('order_index', { ascending: true }),
    ]);

    // Se qualquer busca falhar, descarta tudo (melhor sem dados do banco do que com dados pela metade).
    for (const result of [profile, education, languages, certifications, experience, exchange, publications, projects]) {
      if (result.error) throw result.error;
    }

    const lines: string[] = [];

    const person = profile.data as unknown as ProfileRow | null;
    if (person) {
      lines.push(`- Perfil: ${[person.full_name, person.headline_pt, person.location].filter(Boolean).join(' | ')}`);
      if (person.about_me_pt) lines.push(`- Sobre ela: ${person.about_me_pt}`);

      // E-mail, LinkedIn e GitHub vêm do perfil no banco (a mesma fonte da seção "Contato" do site).
      const contacts = [
        person.email ? `E-mail: ${person.email}` : null,
        person.linkedin_url ? `LinkedIn: ${person.linkedin_url}` : null,
        person.github_url ? `GitHub: ${person.github_url}` : null,
      ].filter(Boolean);
      if (contacts.length > 0) lines.push(`- Contato: ${contacts.join(' | ')}`);
    }

    const educationRows = toRows<EducationRow>(education);
    if (educationRows.length > 0) lines.push(`- Formação: ${educationRows.map((item) => item.course_pt).join('; ')}`);

    const languageRows = toRows<LanguageRow>(languages);
    if (languageRows.length > 0) lines.push(`- Idiomas: ${languageRows.map((item) => item.language_pt).join('; ')}`);

    const certificationRows = toRows<CertificationRow>(certifications);
    if (certificationRows.length > 0) lines.push(`- Certificações: ${certificationRows.map((item) => item.title_pt).join('; ')}`);

    const experienceRows = toRows<ExperienceRow>(experience);
    if (experienceRows.length > 0) {
      const items = experienceRows.map((item) => {
        const period = item.period_pt ? ` (${item.period_pt})` : '';
        const description = item.description_pt ? `: ${item.description_pt}` : '';
        return `${item.title_pt}${period}${description}`;
      });
      lines.push(`- Experiência e voluntariado: ${items.join(' | ')}`);
    }

    const exchangeRows = toRows<ExchangeRow>(exchange);
    if (exchangeRows.length > 0) lines.push(`- Intercâmbio: ${exchangeRows.map((item) => item.description_pt).join(' | ')}`);

    for (const item of toRows<PublicationRow>(publications)) {
      lines.push(`- Publicação: ${item.authors} (${item.year}). ${item.title_pt}. ${item.venue}. DOI: https://doi.org/${item.doi}`);
    }

    const projectRows = toRows<ProjectRow>(projects);
    if (projectRows.length > 0) {
      lines.push('- PROJETOS:');
      for (const item of projectRows) {
        const technologies = item.tech_stack && item.tech_stack.length > 0 ? ` Tecnologias: ${item.tech_stack.join(', ')}.` : '';
        const code = item.github_url ? ` Código: ${item.github_url}` : '';
        const online = item.live_url ? ` Online: ${item.live_url}` : '';
        lines.push(`  * ${item.title_pt}: ${item.description_pt ?? ''}${technologies}${code}${online}`);
      }
    }

    if (lines.length === 0) return null;

    const factsText = lines.join('\n');
    databaseCache = { text: factsText, timestamp: Date.now() };
    return factsText;
  } catch (error) {
    logError('gemini-chat:database', error);
    return null;
  }
}

// Junta os fatos do banco com os fatos extras. Se o banco falhar, só os extras são usados,
// mais uma linha com o LinkedIn e o GitHub (links públicos escritos neste arquivo) para o chat não ficar sem nenhum contato.
// O e-mail só vem do banco.
function buildFacts(databaseFacts: string | null): string {
  const lines = ['FATOS SOBRE A BEATRIZ (fonte de verdade):'];
  if (databaseFacts) {
    lines.push(databaseFacts);
  } else {
    lines.push(`- Contato: LinkedIn: ${LINKEDIN_PROFILE_URL} | GitHub: ${GITHUB_PROFILE_URL}`);
  }
  return [...lines, ...EXTRA_FACTS].join('\n');
}

// Regras para a IA falar de projetos SOMENTE com base nos dados reais do GitHub (evita alucinação).
const GROUNDING_RULES: Record<Language, { withData: string; withoutData: string }> = {
  pt: {
    withData:
      'Para falar dela e dos projetos, use SOMENTE os FATOS e a lista de repositórios do GitHub abaixo. ' +
      'Se algo não estiver neles, diga que não sabe em vez de inventar. Não invente links, tecnologias nem funcionalidades.',
    withoutData:
      'A lista de repositórios do GitHub não está disponível agora. Use SOMENTE os FATOS abaixo; ' +
      'para mais detalhes, indique o perfil ' + GITHUB_PROFILE_URL + '.',
  },
  en: {
    withData:
      'When talking about her and her projects, use ONLY the FACTS and the GitHub repository list below. ' +
      "If something is not in them, say you don't know instead of making it up. Never invent links, technologies or features.",
    withoutData:
      'The GitHub repository list is not available right now. Use ONLY the FACTS below; ' +
      'for more details, point to the profile ' + GITHUB_PROFILE_URL + '.',
  },
  es: {
    withData:
      'Para hablar de ella y de sus proyectos, usa SOLO los HECHOS (FATOS) y la lista de repositorios de GitHub de abajo. ' +
      'Si algo no está en ellos, di que no lo sabes en lugar de inventar. No inventes enlaces, tecnologías ni funcionalidades.',
    withoutData:
      'La lista de repositorios de GitHub no está disponible ahora. Usa SOLO los HECHOS (FATOS) de abajo; ' +
      'para más detalles, indica el perfil ' + GITHUB_PROFILE_URL + '.',
  },
};

const MESSAGES: Record<Language, { empty: string; noKey: string; noAnswer: string; error: string; rateLimit: string }> = {
  pt: {
    empty: 'Mensagem vazia.',
    noKey:
      'Oi! Meu cérebro de IA ainda não foi conectado por aqui (falta configurar GEMINI_API_KEY no ' +
      'servidor). Mas dá uma olhada nos meus projetos no GitHub: ' + GITHUB_PROFILE_URL + ' :)',
    noAnswer: 'Hmm, não consegui pensar em uma resposta agora :/ tenta reformular?',
    error: 'Deu erro por aqui ao falar com a IA :( tenta de novo daqui a pouco.',
    rateLimit: 'Muitas mensagens ao mesmo tempo :( aguarda um instante e tenta de novo.',
  },
  en: {
    empty: 'Empty message.',
    noKey:
      "Hi! My AI brain hasn't been connected here yet (GEMINI_API_KEY is missing on the " +
      'server). But check out my projects on GitHub: ' + GITHUB_PROFILE_URL + ' :)',
    noAnswer: "Hmm, I couldn't think of an answer right now :/ try rephrasing?",
    error: 'Something went wrong talking to the AI :( please try again in a bit.',
    rateLimit: 'Too many messages at once :( wait a moment and try again.',
  },
  es: {
    empty: 'Mensaje vacío.',
    noKey:
      '¡Hola! Mi cerebro de IA todavía no está conectado por aquí (falta configurar GEMINI_API_KEY en el ' +
      'servidor). Pero échale un vistazo a mis proyectos en GitHub: ' + GITHUB_PROFILE_URL + ' :)',
    noAnswer: 'Hmm, no pude pensar en una respuesta ahora :/ ¿intentas reformular?',
    error: 'Hubo un error al hablar con la IA :( inténtalo de nuevo en un momento.',
    rateLimit: 'Demasiados mensajes a la vez :( espera un momento e inténtalo de nuevo.',
  },
};

// Nome do modelo Gemini configurável via env var, com fallback para 'gemini-3.5-flash-lite' caso não esteja definido.
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-3.5-flash-lite';

// Os repositórios cujos READMEs servem de contexto para a IA vêm da tabela projects (coluna github_url), a mesma fonte do site:
// ao cadastrar um projeto novo no banco, o chat passa a conhecê-lo sem mexer neste arquivo.
// Só vale link no formato https://github.com/dono/repositorio (o link do perfil, sem repositório, é ignorado).
const GITHUB_REPO_URL = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/;

interface GithubRepo {
  owner: string;
  name: string;
}

// O contexto fica em cache por 10 minutos (a API do GitHub sem token permite só 60 requisições por hora por IP).
const GITHUB_CACHE_TTL_MS = 10 * 60 * 1000;
// Se o GitHub demorar mais que isso, o chat segue sem o contexto em vez de travar.
const GITHUB_TIMEOUT_MS = 3000;
// Quantos caracteres do README de cada repositório vão para a IA (limita o tamanho do prompt).
const MAX_README_LENGTH = 1500;

// Cache em memória (em serverless, cada instância tem o seu: é uma otimização "melhor esforço").
let githubCache: { context: string; timestamp: number } | null = null;

// Busca o README de um repositório e devolve um trecho curto e limpo (sem imagens, badges e tags HTML).
// Devolve null se falhar ou se o repositório não tiver README: ele só fica sem esse detalhe.
async function fetchReadme(owner: string, repoName: string, headers: Record<string, string>): Promise<string | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/readme`, {
      headers: { ...headers, Accept: 'application/vnd.github.raw+json' },
      signal: AbortSignal.timeout(GITHUB_TIMEOUT_MS),
    });
    if (!response.ok) {
      throw new Error(`GitHub respondeu ${response.status} para ${owner}/${repoName}`);
    }

    const text = await response.text();
    const clean = text
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, MAX_README_LENGTH);
    return clean || null;
  } catch (error) {
    logError('gemini-chat:github', error);
    return null;
  }
}

// Lê no banco os repositórios dos projetos (sem repetir o mesmo repositório, na ordem do site).
async function fetchGithubRepos(): Promise<GithubRepo[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('projects').select('github_url').order('order_index', { ascending: true });
  if (error) throw error;

  const repos: GithubRepo[] = [];
  for (const row of toRows<{ github_url: string | null }>({ data })) {
    const match = row.github_url?.match(GITHUB_REPO_URL);
    if (!match) continue;
    const [, owner, name] = match;
    if (!repos.some((repo) => repo.owner === owner && repo.name === name)) repos.push({ owner, name });
  }
  return repos;
}

// Busca os READMEs dos projetos (repositórios lidos do banco) e monta um texto simples para a IA usar como fonte da verdade.
// Devolve null se nenhum README for lido: o chat continua funcionando, só sem detalhes de projetos.
async function fetchGithubContext(): Promise<string | null> {
  if (githubCache && Date.now() - githubCache.timestamp < GITHUB_CACHE_TTL_MS) {
    return githubCache.context;
  }

  // Lista de repositórios vinda do banco. Se o banco falhar, o chat segue sem os READMEs.
  let repos: GithubRepo[];
  try {
    repos = await fetchGithubRepos();
  } catch (error) {
    logError('gemini-chat:github-repos', error);
    return null;
  }
  if (repos.length === 0) return null;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-retro',
  };
  // Token opcional (sem permissões especiais): só aumenta o limite de requisições.
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  // Os READMEs são buscados ao mesmo tempo (em paralelo), para não somar o tempo de cada um.
  const readmes = await Promise.all(repos.map((repo) => fetchReadme(repo.owner, repo.name, headers)));

  const lines = repos.flatMap((repo, index) => {
    const readme = readmes[index];
    return readme ? [`- ${repo.name} | code: https://github.com/${repo.owner}/${repo.name} | readme: ${readme}`] : [];
  });
  if (lines.length === 0) return null;

  const context = lines.join('\n');
  githubCache = { context, timestamp: Date.now() };
  return context;
}

// Monta o prompt final: personalidade + regra anti-alucinação + fatos (banco + extras) + READMEs dos repositórios (quando disponíveis).
function buildSystemPrompt(lang: Language, githubContext: string | null, facts: string): string {
  const rules = GROUNDING_RULES[lang];
  // Os fatos reais entram sempre; os READMEs do GitHub só quando o GitHub respondeu.
  if (!githubContext) {
    return `${SYSTEM_PROMPTS[lang]} ${rules.withoutData}\n\n${facts}`;
  }
  return `${SYSTEM_PROMPTS[lang]} ${rules.withData}\n\n${facts}\n\nGITHUB REPOSITORIES (README excerpts):\n${githubContext}`;
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

  // Limita quantas mensagens cada IP pode enviar à IA (protege a cota da chave do Gemini).
  // A resposta 429 já é enviada dentro da função, e o front mostra "aguarde um instante" ou usa a base local de respostas.
  if (applyRateLimit(req, res, 'gemini-chat', GEMINI_RATE_LIMIT_MAX_REQUESTS)) return;

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
    // no mesmo espírito das outras telas, que mostram uma mensagem amigável em vez de quebrar.
    // Status 503 (e não 200): assim o front reconhece que a IA está indisponível e usa a base local de respostas.
    return res.status(503).json({ success: false, reply: texts.noKey });
  }

  // Tenta enviar a mensagem para o modelo Gemini e obter uma resposta.
  try {
    const contents = [
      ...sanitizeHistory(history).map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
      { role: 'user', parts: [{ text: userMessage }] },
    ];

    // Busca (ou reaproveita do cache) os READMEs do GitHub e os dados do banco antes de responder.
    const [githubContext, databaseFacts] = await Promise.all([fetchGithubContext(), fetchDatabaseFacts()]);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

    // A chave vai no header (e não na URL), para não aparecer em logs nem em mensagens de erro.
    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: buildSystemPrompt(lang, githubContext, buildFacts(databaseFacts)) }] },
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
    const data = (await geminiResponse.json()) as GeminiResponse;
    // A resposta pode vir em mais de um trecho (parts): junta todos, em vez de usar só o primeiro.
    const parts = data?.candidates?.[0]?.content?.parts ?? [];
    const reply: string = parts.map((part) => part.text ?? '').join('').trim() || texts.noAnswer; 

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