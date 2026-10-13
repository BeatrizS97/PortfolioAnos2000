// src/services/scrapsService.ts
import { api, isAbortError } from './api';
import type { NewScrapPayload, Scrap, ScrapsApiResponse } from '../types/scrap';
import { scrapSchema } from '../types/scrap';

const MOCK_SCRAPS: Scrap[] = [
  {
    id: '1',
    author_name: 'João Recrutador',
    author_avatar: '/assets/images/icons/user-placeholder.png',
    message: 'Que perfil nostálgico! Adorei os projetos, vou te chamar pro MSN. 😄',
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    author_name: 'Maria Dev',
    author_avatar: '/assets/images/icons/user-placeholder.png',
    message: 'Lembrei dos anos 2000 assim que abri essa página, muito criativo!',
    is_public: true,
    created_at: new Date().toISOString(),
  },
];

// Valida cada recado recebido da API com o scrapSchema (Zod). Recado inválido é ignorado e registrado no console,
// para um único registro com formato errado não derrubar a lista inteira.
function parseScraps(items: unknown[]): Scrap[] {
  return items.flatMap((item) => {
    const result = scrapSchema.safeParse(item);
    if (!result.success) {
      console.warn('Recado com formato inválido ignorado:', result.error.issues);
      return [];
    }
    return [result.data];
  });
}

/**
 * Busca uma página de recados públicos (GET /api/scraps).
 * @param page Número da página (começa em 1).
 * @param limit Quantidade de recados por página.
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Os recados da página, se há mais páginas e o total. Se a API falhar, devolve recados de exemplo (só em dev) ou lista vazia (produção).
 */
// Busca recados da API, com paginação. Se a API falhar, retorna dados mock.
export async function fetchScraps(
  page = 1,
  limit = 10,
  signal?: AbortSignal
): Promise<{ data: Scrap[]; hasMore: boolean; total: number }> {
  try {
    const response = await api.get<ScrapsApiResponse>(`/scraps?limit=${limit}&page=${page}`, signal);
    return { data: parseScraps(response.data), hasMore: response.hasMore, total: response.total };
  } catch (error) {
    // Requisição cancelada (componente saiu da tela): não é falha, então não usa mock.
    if (isAbortError(error)) throw error;
    // Em produção os recados de exemplo seriam recados FALSOS exibidos como se fossem de visitantes reais: devolve lista vazia.
    if (!import.meta.env.DEV) return { data: [], hasMore: false, total: 0 };
    return { data: MOCK_SCRAPS, hasMore: false, total: MOCK_SCRAPS.length };
  }
}

/**
 * Cria um novo recado (POST /api/scraps).
 * @param payload Nome do autor e mensagem.
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns O recado criado. Lança um erro se a API falhar.
 */
// Cria um novo recado na API e retorna o recado criado. Se a API falhar, lança um erro.
export async function postScrap(payload: NewScrapPayload, signal?: AbortSignal): Promise<Scrap> {
  const response = await api.post<{ success: boolean; data: Scrap }>('/scraps', payload, signal);
  return response.data;
}

/**
 * Exclui um recado (DELETE /api/scraps?id=...). Só a administradora consegue.
 * A chave de administrador vai EXCLUSIVAMENTE no header x-admin-key (feito por api.delete) e nunca na URL;
 * na URL vai apenas o id do recado. O backend (api/scraps.ts) valida somente esse header.
 * @param id Id do recado.
 * @param adminKey Chave de administrador.
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 */
// Exclui um recado da API. Se a API falhar, lança um erro.
export async function deleteScrap(id: string, adminKey: string, signal?: AbortSignal): Promise<void> {
  await api.delete<{ success: boolean }>(`/scraps?id=${encodeURIComponent(id)}`, adminKey, signal);
}