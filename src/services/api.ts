// src/services/api.ts
/* Cliente HTTP fino para as Vercel Serverless Functions em /api.
   Em desenvolvimento local, o Vite faz proxy de /api -> http://localhost:3001
   (ver vite.config.ts). Se as rotas não estiverem disponíveis, o erro (ApiError ou
   NetworkError) sobe até quem chamou: o React Query decide se tenta de novo e as telas
   mostram a lista vazia ou uma mensagem de erro, então a UI nunca quebra em dev. 
*/

// Tempo máximo de espera por uma resposta (o mesmo do maxDuration das funções, no vercel.json).
// Passou disso, a requisição é cancelada e vira NetworkError, para quem chamou decidir o que fazer.
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Erro devolvido pelo servidor: a requisição chegou e a resposta veio com status de erro (4xx/5xx).
 * `message` traz o texto enviado pela API (quando houver) e `status` o código HTTP.
 */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

/** Erro de autenticação/permissão (HTTP 401 ou 403), por exemplo uma x-admin-key errada. */
export class AuthError extends ApiError {
  constructor(message: string, status: number) {
    super(message, status);
    this.name = 'AuthError';
  }
}

/** Erro de validação (HTTP 400 ou 422): o servidor recusou os dados enviados. */
export class ValidationError extends ApiError {
  constructor(message: string, status: number) {
    super(message, status);
    this.name = 'ValidationError';
  }
}

/**
 * Falha de comunicação: sem internet, servidor fora do ar ou resposta que não é JSON (ex.: página HTML de erro 502).
 * De propósito NÃO estende ApiError: quem trata `instanceof ApiError` continua mostrando o texto traduzido padrão nesses casos.
 */
export class NetworkError extends Error {
  constructor(message = 'Não foi possível se comunicar com o servidor.') {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Indica se o erro veio de uma requisição cancelada com AbortController.
 * Quem recebe esse erro normalmente deve ignorá-lo (o componente já saiu da tela).
 */
export function isAbortError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && (error as { name?: unknown }).name === 'AbortError';
}

// Confere se a resposta declara que o corpo é JSON (uma página de erro em HTML não é).
function isJsonResponse(response: Response): boolean {
  return (response.headers.get('content-type') ?? '').toLowerCase().includes('application/json');
}

// Escolhe a classe de erro certa de acordo com o status HTTP.
function createHttpError(message: string, status: number): ApiError {
  if (status === 401 || status === 403) return new AuthError(message, status);
  if (status === 400 || status === 422) return new ValidationError(message, status);
  return new ApiError(message, status);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // Só conta como "cancelada de propósito" quando foi quem chamou que cancelou. O estouro de tempo vira NetworkError.
  const cancelledByCaller = () => init?.signal?.aborted === true;
  // O que acontecer primeiro (cancelamento de quem chamou ou limite de tempo) cancela o fetch.
  const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const signal = init?.signal ? AbortSignal.any([init.signal, timeoutSignal]) : timeoutSignal;

  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...init,
      signal,
      // Sempre envia JSON, mesmo que o body seja vazio (GET/DELETE). As rotas de API
      // tratam isso bem, e evita que o browser envie "Content-Type: text/plain"
      // por engano, quebrando a rota (ver api/testimonial.ts etc.).
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    });
  } catch (error) {
    // Requisição cancelada de propósito (AbortController): repassa o erro original para quem cancelou.
    if (isAbortError(error) && cancelledByCaller()) throw error;
    // Sem internet, servidor fora do ar, tempo esgotado, etc.
    throw new NetworkError();
  }

  if (!response.ok) {
    // Tenta extrair uma mensagem de erro do corpo da resposta JSON, se houver.
    let message = response.statusText || `Erro ${response.status}`;
    // Só lê como JSON se o servidor avisou que é JSON (um erro 502 costuma vir em HTML).
    if (isJsonResponse(response)) {
      try {
        const body = await response.clone().json();
        if (typeof body?.message === 'string' && body.message.trim()) {
          message = body.message;
        } else if (typeof body?.error === 'string' && body.error.trim()) {
          message = body.error;
        }
      } catch {
        // Resposta sem corpo JSON válido — mantém a mensagem genérica acima.
      }
    }
    throw createHttpError(message, response.status);
  }

  // Antes de interpretar como JSON, confirma o Content-Type: uma página HTML (ex.: o index.html do rewrite) não pode quebrar o app.
  if (!isJsonResponse(response)) {
    throw new NetworkError('O servidor respondeu em um formato inesperado (não é JSON).');
  }

  try {
    return (await response.json()) as T;
  } catch (error) {
    if (isAbortError(error) && cancelledByCaller()) throw error;
    throw new NetworkError('O servidor respondeu com um JSON inválido.');
  }
}

// Exporta funções para fazer requisições GET, POST e DELETE para as rotas de API.
// O parâmetro opcional "signal" (de um AbortController) permite cancelar a requisição, por exemplo ao desmontar o componente.
export const api = {
  /** GET em /api{path}. Devolve o JSON já tipado como T. */
  get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { method: 'GET', signal }), 
  /** POST em /api{path} com `body` serializado em JSON. */
  post: <T>(path: string, body: unknown, signal?: AbortSignal) => 
    request<T>(path, { method: 'POST', body: JSON.stringify(body), signal }), 
  /** DELETE em /api{path}. A chave de administrador vai SOMENTE no header x-admin-key (nunca na URL). */
  delete: <T>(path: string, adminKey: string, signal?: AbortSignal) => 
    request<T>(path, { method: 'DELETE', headers: { 'x-admin-key': adminKey }, signal }), 
};