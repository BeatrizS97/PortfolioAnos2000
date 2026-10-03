// src/services/api.ts
/* Cliente HTTP fino para as Vercel Serverless Functions em /api.
   Em desenvolvimento local, o Vite faz proxy de /api -> http://localhost:3001
   (ver vite.config.ts). Se as rotas não estiverem disponíveis, os services
   individuais caem para dados mock, então a UI nunca quebra em dev. 
*/
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    // Sempre envia JSON, mesmo que o body seja vazio (GET/DELETE). As rotas de API
    // tratam isso bem, e evita que o browser envie "Content-Type: text/plain"
    // por engano, quebrando a rota (ver api/testimonial.ts, api/contact.ts etc.).
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });

  if (!response.ok) {
    // Tenta extrair uma mensagem de erro do corpo da resposta JSON, se houver.
    let message = response.statusText || `Erro ${response.status}`;
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
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

// Exporta funções para fazer requisições GET, POST e DELETE para as rotas de API.
export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }), 
  post: <T>(path: string, body: unknown) => 
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }), 
    delete: <T>(path: string, adminKey: string) => 
    request<T>(path, { method: 'DELETE', headers: { 'x-admin-key': adminKey } }), 
};