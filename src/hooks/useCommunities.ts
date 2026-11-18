// src/hooks/useCommunities.ts
import { useQuery } from '@tanstack/react-query';
import { fetchCommunities } from '../services/communitiesService';

// Hook para buscar as comunidades usando React Query.
// O "signal" do React Query cancela a requisição quando o componente sai da tela.
export function useCommunities() {
  return useQuery({
    queryKey: ['communities'],
    queryFn: ({ signal }) => fetchCommunities(signal),
  });
}
