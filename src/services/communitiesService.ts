// src/services/communitiesService.ts
import { api, isAbortError } from './api';
import type { Community } from '../types/community';
import type { ApiResponse } from '../types/apiResponse';

const MOCK_COMMUNITIES: Community[] = [
  { id: '1', name: 'React.js & Next.js Lovers', members_count: 1518382, category: 'hard_skill' },
  { id: '2', name: 'TypeScript Salvou Meu Código', members_count: 674921, category: 'hard_skill' },
  { id: '3', name: 'Node.js em Aprendizado Contínuo', members_count: 512883, category: 'hard_skill' },
  { id: '4', name: 'C# & .NET Não São Só Café', members_count: 341207, category: 'hard_skill' },
  { id: '5', name: 'Scrum Fundamentals Certified', members_count: 156732, category: 'hard_skill' },
  { id: '6', name: 'Metodologias Ágeis: Daily Sem Drama', members_count: 143310, category: 'soft_skill' },
  { id: '7', name: 'Liderei uma Equipe por 3 Anos e Sobrevivi', members_count: 112480, category: 'soft_skill' },
  { id: '8', name: 'Inovação Tecnológica e Inclusão', members_count: 98214, category: 'soft_skill' },
  { id: '9', name: 'Voluntariado: Fazer o Bem Não Dói', members_count: 91337, category: 'soft_skill' },
  { id: '10', name: 'Adaptabilidade & Diversidade Cultural', members_count: 87654, category: 'soft_skill' },
];

/**
 * Busca as comunidades (hard e soft skills) em GET /api/communities.
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de comunidades. Se a API falhar ou vier vazia, devolve dados de exemplo.
 */
export async function fetchCommunities(signal?: AbortSignal): Promise<Community[]> {
  try {
    const response = await api.get<ApiResponse<Community[]>>('/communities', signal);
    return response.data.length > 0 ? response.data : MOCK_COMMUNITIES;
  } catch (error) {
    // Requisição cancelada (componente saiu da tela): não é falha, então não usa mock.
    if (isAbortError(error)) throw error;
    return MOCK_COMMUNITIES;
  }
}