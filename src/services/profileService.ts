// src/services/profileService.ts
import { api } from './api';
import type { ProfileData } from '../types/profile';

const MOCK_PROFILE: ProfileData = {
  id: 'mock',
  full_name: 'Beatriz Silva Santos',
  headline: 'Desenvolvedora Full Stack Jr | React.js | Next.js | TypeScript | Node.js',
  location: 'Itanhaém, São Paulo',
  about_me:
    'Oi! Sou a Beatriz, Dev Full Stack Jr formada pela Fatec Praia Grande (2026). Trabalho com React, Next.js e Node.js. Na Hub Connect Eventos, criei um site do zero e melhorei a compreensão do comportamento do usuário em 20% com SEO e GA4. Já fiz intercâmbio em Dublin (ISI Dublin) e tenho certificação Scrum Fundamentals. Amo criar interfaces acessíveis e performáticas. Vamos conversar?',
  photo_url: '/assets/images/icons/user.png',
};

export async function fetchProfile(): Promise<ProfileData> {
  try {
    const response = await api.get<{ success: boolean; data: ProfileData | null }>('/profile');
    return response.data ?? MOCK_PROFILE;
  } catch {
    return MOCK_PROFILE;
  }
}