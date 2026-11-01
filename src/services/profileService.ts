// src/services/profileService.ts
import { api, isAbortError } from './api';
import type { ProfileData } from '../types/profile';
import type { ApiResponse } from '../types/apiResponse';

// Cache simples em memória: evita buscar o perfil de novo (ex.: OrkutProfile e ProfileDetails pedem o mesmo dado).
// Guarda só respostas reais da API (nunca o mock), por 5 minutos.
const CACHE_TTL_MS = 5 * 60 * 1000;
const profileCache = new Map<string, { data: ProfileData; timestamp: number }>();

/**
 * Busca o perfil (GET /api/profile), usando um cache em memória de 5 minutos.
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns O perfil. Se a API falhar ou não tiver perfil, devolve dados de exemplo.
 */
export async function fetchProfile(signal?: AbortSignal): Promise<ProfileData | null> {
  const cached = profileCache.get('profile');
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const response = await api.get<ApiResponse<ProfileData | null>>('/profile', signal);
    if (!response.data) return null;

    profileCache.set('profile', { data: response.data, timestamp: Date.now() });
    return response.data;
  } catch (error) {
    // Requisição cancelada (componente saiu da tela): não é falha, então não usa mock.
    if (isAbortError(error)) throw error;
    return null;
  }
}