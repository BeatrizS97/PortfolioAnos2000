// src/services/scrapsService.ts
import { api } from './api';
import type { NewScrapPayload, Scrap, ScrapsApiResponse } from '../types/scrap';

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

// Busca recados da API, com paginação. Se a API falhar, retorna dados mock.
export async function fetchScraps(
  page = 1,
  limit = 10
): Promise<{ data: Scrap[]; hasMore: boolean; total: number }> {
  try {
    const response = await api.get<ScrapsApiResponse>(`/scraps?limit=${limit}&page=${page}`);
    return { data: response.data, hasMore: response.hasMore, total: response.total };
  } catch {
    return { data: MOCK_SCRAPS, hasMore: false, total: MOCK_SCRAPS.length };
  }
}

// Cria um novo recado na API e retorna o recado criado. Se a API falhar, lança um erro.
export async function postScrap(payload: NewScrapPayload): Promise<Scrap> {
  const response = await api.post<{ success: boolean; data: Scrap }>('/scraps', payload);
  return response.data;
}

// Exclui um recado da API. Se a API falhar, lança um erro.
export async function deleteScrap(id: string, adminKey: string): Promise<void> {
  await api.delete<{ success: boolean }>(`/scraps?id=${encodeURIComponent(id)}`, adminKey);
}