// src/hooks/useProjects.ts
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '../services/projectsService';

// Hook para buscar os projetos usando React Query.
// O "signal" do React Query cancela a requisição quando o componente sai da tela.
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: ({ signal }) => fetchProjects(signal),
  });
}
