// src/services/scrapsService.ts
import { api } from './api';
import type { NewScrapPayload, Scrap, ScrapsApiResponse } from '../types/scrap';
import { scrapSchema } from '../types/scrap';
import type { ApiResponse } from '../types/apiResponse';

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
 * @returns Os recados da página, se há mais páginas e o total. Se a API falhar, o erro sobe (o React Query decide se tenta de novo).
 */
// Busca recados da API, com paginação. Se a API falhar, lança um erro (nunca inventa recados de exemplo, que seriam recados FALSOS exibidos como de visitantes reais).
export async function fetchScraps(
  page = 1,
  limit = 10,
  signal?: AbortSignal
): Promise<{ data: Scrap[]; hasMore: boolean; total: number }> {
  const response = await api.get<ScrapsApiResponse>(`/scraps?limit=${limit}&page=${page}`, signal);
  return { data: parseScraps(response.data), hasMore: response.hasMore, total: response.total };
}

/**
 * Cria um novo recado (POST /api/scraps).
 * @param payload Nome do autor e mensagem.
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns O recado criado. Lança um erro se a API falhar.
 */
// Cria um novo recado na API e retorna o recado criado. Se a API falhar, lança um erro.
export async function postScrap(payload: NewScrapPayload, signal?: AbortSignal): Promise<Scrap> {
  const response = await api.post<ApiResponse<Scrap>>('/scraps', payload, signal);
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
