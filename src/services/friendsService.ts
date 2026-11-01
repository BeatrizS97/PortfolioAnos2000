// src/services/friendsService.ts
import { api, isAbortError } from './api';
import type { Friend } from '../types/friend';
import type { ApiResponse } from '../types/apiResponse';

/**
 * Busca os amigos (colaboradores dos projetos) em GET /api/friends.
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de amigos. Se a API falhar ou vier vazia, devolve dados de exemplo.
 */
export async function fetchFriends(signal?: AbortSignal): Promise<Friend[]> {
  try {
    const response = await api.get<ApiResponse<Friend[]>>('/friends', signal);
    return response.data;
  } catch (error) {
    // Requisição cancelada (componente saiu da tela): não é falha, então não usa mock.
    if (isAbortError(error)) throw error;
    return [];
  }
}