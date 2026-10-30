// src/services/profileService.ts
import { api, isAbortError } from './api';
import type { ProfileData } from '../types/profile';
import type { ApiResponse } from '../types/apiResponse';

const MOCK_PROFILE: ProfileData = {
  id: 'mock',
  full_name: 'Beatriz Silva Santos',
  headline: 'Desenvolvedora Full Stack Jr | React.js | Next.js | TypeScript | Node.js',
  location: 'Itanhaém, São Paulo',
  about_me:
    'Oi! Sou a Beatriz, Dev Full Stack Jr formada pela Fatec Praia Grande (2026). Trabalho com React, Next.js e Node.js. Na Hub Connect Eventos, criei um site do zero e melhorei a compreensão do comportamento do usuário em 20% com SEO e GA4. Já fiz intercâmbio em Dublin (ISI Dublin) e tenho certificação Scrum Fundamentals. Amo criar interfaces acessíveis e performáticas. Vamos conversar?',
  photo_url: '/assets/images/icons/user.png',
};

// Cache simples em memória: evita buscar o perfil de novo (ex.: OrkutProfile e ProfileDetails pedem o mesmo dado).
// Guarda só respostas reais da API (nunca o mock), por 5 minutos.
const CACHE_TTL_MS = 5 * 60 * 1000;
const profileCache = new Map<string, { data: ProfileData; timestamp: number }>();

/**
 * Busca o perfil (GET /api/profile), usando um cache em memória de 5 minutos.
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns O perfil. Se a API falhar ou não tiver perfil, devolve dados de exemplo.
 */
export async function fetchProfile(signal?: AbortSignal): Promise<ProfileData> {
  const cached = profileCache.get('profile');
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const response = await api.get<ApiResponse<ProfileData | null>>('/profile', signal);
    if (!response.data) return MOCK_PROFILE;

    profileCache.set('profile', { data: response.data, timestamp: Date.now() });
    return response.data;
  } catch (error) {
    // Requisição cancelada (componente saiu da tela): não é falha, então não usa mock.
    if (isAbortError(error)) throw error;
    return MOCK_PROFILE;
  }
}