// src/hooks/useCommunities.ts
import { useQuery } from '@tanstack/react-query';
import { fetchCommunities } from '../services/communitiesService';

// Hook para buscar informações sobre comunidades usando React Query.
export function useCommunities() {
  return useQuery({
    queryKey: ['communities'],
    queryFn: ({ signal }) => fetchCommunities(signal),
    staleTime: 5 * 60 * 1000,
  });
}