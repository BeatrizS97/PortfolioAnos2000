// src/services/profileService.ts
import { api } from './api';
import type { ProfileData } from '../types/profile';
import type { ApiResponse } from '../types/apiResponse';

/**
 * Busca o perfil (GET /api/profile).
 * O cache de 5 minutos fica por conta do React Query (hook useProfile), que OrkutProfile e ProfileDetails compartilham.
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns O perfil, ou null se a API não tiver perfil. Se a API falhar, o erro sobe (o React Query decide se tenta de novo).
 */
export async function fetchProfile(signal?: AbortSignal): Promise<ProfileData | null> {
  const response = await api.get<ApiResponse<ProfileData | null>>('/profile', signal);
  return response.data ?? null;
}
