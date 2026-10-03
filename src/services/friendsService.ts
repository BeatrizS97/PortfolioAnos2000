// src/services/friendsService.ts
import { api } from './api';
import type { Friend } from '../types/friend';

const MOCK_FRIENDS: Friend[] = [
  { id: '1', name: 'Marcela Santiago', avatar_url: '/assets/images/icons/user-placeholder.png', role: 'Banco de Trocas de Conhecimento — Fullstack' },
  { id: '2', name: 'Tatiana Nunes', avatar_url: '/assets/images/icons/user-placeholder.png', role: 'Form Generator — Colaboradora' },
  { id: '3', name: 'Patrick Silva', avatar_url: '/assets/images/icons/user-placeholder.png', role: 'Banco de Trocas de Conhecimento — CRUD Conhecimentos' },
];

export async function fetchFriends(): Promise<Friend[]> {
  try {
    const response = await api.get<{ success: boolean; data: Friend[] }>('/friends');
    return response.data.length > 0 ? response.data : MOCK_FRIENDS;
  } catch {
    return MOCK_FRIENDS;
  }
}