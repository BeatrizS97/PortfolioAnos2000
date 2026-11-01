// src/services/communitiesService.ts
import { api, isAbortError } from './api';
import type { Community } from '../types/community';
import type { ApiResponse } from '../types/apiResponse';

/**
 * Busca as comunidades (hard e soft skills) em GET /api/communities.
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de comunidades. Se a API falhar ou vier vazia, devolve dados de exemplo.
 */
export async function fetchCommunities(signal?: AbortSignal): Promise<Community[]> {
  try {
    const response = await api.get<ApiResponse<Community[]>>('/communities', signal);
    return response.data;
  } catch (error) {
    // Requisição cancelada (componente saiu da tela): não é falha, então não usa mock.
    if (isAbortError(error)) throw error;
    return [];
  }
}