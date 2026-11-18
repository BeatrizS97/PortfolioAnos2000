// src/services/friendsService.ts
import { api } from './api';
import type { Friend } from '../types/friend';
import type { ApiResponse } from '../types/apiResponse';

/**
 * Busca os amigos (colaboradores dos projetos) em GET /api/friends.
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de amigos. Se a API falhar, o erro sobe (o React Query decide se tenta de novo).
 */
export async function fetchFriends(signal?: AbortSignal): Promise<Friend[]> {
  const response = await api.get<ApiResponse<Friend[]>>('/friends', signal);
  return response.data;
}
