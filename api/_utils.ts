// api/_utils.ts
import { z } from 'zod';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from './_supabase.js';

// Schema usado por testimonial.ts.
// Os limites máximos evitam que alguém envie textos gigantes (que iriam para o banco e para o e-mail).
export const messageSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome (mínimo 2 caracteres).').max(100, 'Nome muito longo (máximo 100 caracteres).'),
  email: z.string().trim().email('Informe um e-mail válido.').max(254, 'E-mail muito longo.'),
  message: z
    .string()
    .trim()
    .min(10, 'A mensagem precisa ter pelo menos 10 caracteres.')
    .max(2000, 'A mensagem é muito longa (máximo 2000 caracteres).'),
});

// Converte os erros do Zod num formato simples: uma mensagem para exibir e a lista de erros por campo.
export function formatValidationErrors(error: z.ZodError) {
  const errors = error.issues.map((issue) => ({
    field: String(issue.path[0] ?? ''),
    message: issue.message,
  }));
  return { message: errors.map((e) => e.message).join(' '), errors };
}

// Sanitização básica contra XSS: remove <script>, qualquer tag HTML, "javascript:" e atributos on*= (ex.: onclick=).
// Se o valor não for texto, devolve string vazia (a validação do Zod acusa o erro depois).
// Só são removidas tags de verdade (que começam com letra, "/" ou "!"), então emoticons como "<3" e ">.<" não apagam o texto ao redor.
export function sanitizeText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<\/?[a-z!][^>]*>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/\bon\w+\s*=/gi, '')
    .trim();
}

// Escapa caracteres especiais para inserir texto com segurança dentro do HTML do e-mail.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Rate limit simples em memória: no máximo 5 requisições por IP a cada 10 minutos, por rota.
// Observação: em serverless a memória não é compartilhada entre instâncias, então é uma proteção "melhor esforço".
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

// Descobre o IP do visitante (a Vercel envia o IP original no header x-forwarded-for).
export function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return raw?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
}

// Retorna true quando a requisição foi BLOQUEADA (a resposta 429 já é enviada aqui dentro).
export function applyRateLimit(
  req: VercelRequest,
  res: VercelResponse,
  route: string,
  maxRequests = RATE_LIMIT_MAX_REQUESTS
): boolean {
  const now = Date.now();
  const key = `${route}:${getClientIp(req)}`;

  // Limpeza simples para o Map não crescer indefinidamente.
  if (requestCounts.size > 1000) {
    for (const [storedKey, entry] of requestCounts) {
      if (entry.resetAt <= now) requestCounts.delete(storedKey);
    }
  }

  const current = requestCounts.get(key);
  if (!current || current.resetAt <= now) {
    requestCounts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    res.setHeader('X-RateLimit-Limit', String(maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(maxRequests - 1));
    return false;
  }

  current.count += 1;
  res.setHeader('X-RateLimit-Limit', String(maxRequests));
  res.setHeader('X-RateLimit-Remaining', String(Math.max(0, maxRequests - current.count)));

  if (current.count > maxRequests) {
    res.setHeader('Retry-After', String(Math.ceil((current.resetAt - now) / 1000)));
    res.status(429).json({
      success: false,
      message: 'Muitas tentativas em pouco tempo. Tente novamente em alguns minutos.',
    });
    return true;
  }
  return false;
}

// Paginação padrão das rotas GET (mesmo padrão do scraps.ts: page, limit, from, to).
// O limit padrão é alto (50) para que o front, que não envia parâmetros, continue recebendo a lista completa.
const DEFAULT_PAGE_LIMIT = 50;
const MAX_PAGE_LIMIT = 100;

// Cada rota pode informar o seu limit padrão (usado quando o front não envia "limit"); o máximo vale para todas.
export function getPagination(req: VercelRequest, defaultLimit = DEFAULT_PAGE_LIMIT) {
  const page = Math.max(1, Math.floor(Number(req.query.page)) || 1);
  const limit = Math.min(MAX_PAGE_LIMIT, Math.max(1, Math.floor(Number(req.query.limit)) || defaultLimit));
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { page, limit, from, to };
}

// Log de erro estruturado (JSON), fácil de filtrar nos logs da Vercel. Não registra dados pessoais do usuário.
export function logError(context: string, error: unknown, extra: Record<string, unknown> = {}): void {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : String(error);

  console.error(
    JSON.stringify({
      level: 'error',
      context,
      message,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      ...extra,
    })
  );
}

// Cache público de 5 minutos (navegador e CDN da Vercel), usado nas rotas GET que devolvem dados que quase não mudam.
export const PUBLIC_CACHE_CONTROL = 'public, max-age=300, s-maxage=300';

// Opções de sendPaginatedList: de qual tabela ler e como nomear a rota nos logs e nas mensagens de erro.
interface PaginatedListOptions {
  table: string;
  // Colunas devolvidas ao front (texto no formato do select do Supabase).
  fields: string;
  // Coluna usada para ordenar e se a ordem é crescente.
  orderBy: string;
  ascending: boolean;
  // Nome usado no log de erro (ex.: 'friends' ou 'academic:education').
  logContext: string;
  // Nome usado na mensagem "Failed to fetch ..." devolvida ao front.
  errorLabel: string;
}

// Lista paginada padrão das rotas GET (friends, communities, academic): lê a tabela, aplica ordem e paginação,
// manda o cache de 5 minutos e devolve { success, data, hasMore, total }. Quem chama já confere o método HTTP.
export async function sendPaginatedList(req: VercelRequest, res: VercelResponse, options: PaginatedListOptions) {
  try {
    const { limit, from, to } = getPagination(req);
    const supabase = getSupabaseClient();
    const { data, error, count } = await supabase
      .from(options.table)
      .select(options.fields, { count: 'exact' })
      .order(options.orderBy, { ascending: options.ascending })
      .range(from, to);

    if (error) throw error;

    const total = count ?? 0;
    res.setHeader('Cache-Control', PUBLIC_CACHE_CONTROL);
    return res.status(200).json({ success: true, data: data ?? [], hasMore: from + limit < total, total });
  } catch (error) {
    logError(options.logContext, error);
    return res.status(500).json({ success: false, error: `Failed to fetch ${options.errorLabel}` });
  }
}
