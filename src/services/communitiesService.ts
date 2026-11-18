// src/services/communitiesService.ts
import { api } from './api';
import type { Community } from '../types/community';
import type { ApiResponse } from '../types/apiResponse';

/**
 * Busca as comunidades (hard e soft skills) em GET /api/communities.
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de comunidades. Se a API falhar, o erro sobe (o React Query decide se tenta de novo).
 */
export async function fetchCommunities(signal?: AbortSignal): Promise<Community[]> {
  const response = await api.get<ApiResponse<Community[]>>('/communities', signal);
  return response.data;
}
