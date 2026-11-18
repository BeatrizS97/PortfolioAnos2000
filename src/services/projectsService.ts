// src/services/projectsService.ts
import { api } from './api';
import type { Project, ProjectsApiResponse } from '../types/project';
import { projectSchema } from '../types/project';

// Valida cada projeto recebido da API com o projectSchema (Zod). Projeto inválido é ignorado e registrado no console,
// para um único registro com formato errado não derrubar a lista inteira.
function parseProjects(items: unknown[]): Project[] {
  return items.flatMap((item) => {
    const result = projectSchema.safeParse(item);
    if (!result.success) {
      console.warn('Projeto com formato inválido ignorado:', result.error.issues);
      return [];
    }
    return [result.data];
  });
}

/**
 * Busca os projetos (GET /api/projects), já ordenados pelo order_index.
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de projetos. Se a API falhar, o erro sobe (o React Query decide se tenta de novo).
 */
export async function fetchProjects(signal?: AbortSignal): Promise<Project[]> {
  const response = await api.get<ProjectsApiResponse>('/projects', signal);
  return parseProjects(response.data);
}
