// src/hooks/useProjects.ts
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '../services/projectsService';
import type { ProjectFilters } from '../types/project';

export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: ({ signal }) => fetchProjects(filters, signal),
    staleTime: 5 * 60 * 1000,
  });
}