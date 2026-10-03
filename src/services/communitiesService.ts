// src/services/communitiesService.ts
import { api } from './api';
import type { Community } from '../types/community';

const MOCK_COMMUNITIES: Community[] = [
  { id: '1', name: 'React.js & Next.js Lovers', members_count: 1518382, category: 'hard_skill' },
  { id: '2', name: 'TypeScript Salvou Meu Código', members_count: 674921, category: 'hard_skill' },
  { id: '3', name: 'C# & .NET Não São Só Café', members_count: 341207, category: 'hard_skill' },
  { id: '4', name: 'Node.js em Aprendizado Contínuo', members_count: 512883, category: 'hard_skill' },
  { id: '5', name: 'Scrum Fundamentals Certified', members_count: 156732, category: 'hard_skill' },
  { id: '6', name: 'Inovação Tecnológica e Inclusão', members_count: 98214, category: 'soft_skill' },
  { id: '7', name: 'Adaptabilidade & Diversidade Cultural', members_count: 2034981, category: 'soft_skill' },
  { id: '8', name: 'Liderei uma Equipe por 3 Anos e Sobrevivi', members_count: 87654, category: 'soft_skill' },
];

export async function fetchCommunities(): Promise<Community[]> {
  try {
    const response = await api.get<{ success: boolean; data: Community[] }>('/communities');
    return response.data.length > 0 ? response.data : MOCK_COMMUNITIES;
  } catch {
    return MOCK_COMMUNITIES;
  }
}