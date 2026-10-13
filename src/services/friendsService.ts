// src/services/friendsService.ts
import { api, isAbortError } from './api';
import type { Friend } from '../types/friend';

const MOCK_FRIENDS: Friend[] = [
  { id: '1', name: 'Marcela Santiago', avatar_url: '/assets/images/icons/user-placeholder.png', role: 'Banco de Trocas de Conhecimento — Fullstack' },
  { id: '2', name: 'Tatiana Nunes', avatar_url: '/assets/images/icons/user-placeholder.png', role: 'Form Generator — Colaboradora' },
  { id: '3', name: 'Patrick Silva', avatar_url: '/assets/images/icons/user-placeholder.png', role: 'Banco de Trocas de Conhecimento — CRUD Conhecimentos' },
];

/**
 * Busca os amigos (colaboradores dos projetos) em GET /api/friends.
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de amigos. Se a API falhar ou vier vazia, devolve dados de exemplo.
 */
export async function fetchFriends(signal?: AbortSignal): Promise<Friend[]> {
  try {
    const response = await api.get<{ success: boolean; data: Friend[] }>('/friends', signal);
    return response.data.length > 0 ? response.data : MOCK_FRIENDS;
  } catch (error) {
    // Requisição cancelada (componente saiu da tela): não é falha, então não usa mock.
    if (isAbortError(error)) throw error;
    return MOCK_FRIENDS;
  }
}