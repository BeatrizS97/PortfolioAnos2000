// src/services/projectsService.ts
import { api, isAbortError } from './api';
import type { Project, ProjectFilters, ProjectsApiResponse } from '../types/project';
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

// Busca projetos da API, aplicando filtros de categoria e destaque. Se a API falhar, retorna dados mock.
// (Os filtros são aplicados somente pelo backend; o service só transporta os parâmetros. O mock de fallback vem completo, sem filtrar.)
/**
 * Busca os projetos (GET /api/projects). Os filtros de categoria/destaque são enviados à API e aplicados lá.
 * @param filters Opcional: filtros enviados como query string.
 * @param signal Opcional: AbortSignal para cancelar a requisição.
 * @returns Lista de projetos. Se a API falhar, devolve todos os projetos de exemplo.
 */
export async function fetchProjects(filters?: ProjectFilters, signal?: AbortSignal): Promise<Project[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.set('category', filters.category);
  if (filters?.featured !== undefined) params.set('featured', String(filters.featured));

  try {
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get<ProjectsApiResponse>(`/projects${query}`, signal);
    return parseProjects(response.data);
  } catch (error) {
    // Requisição cancelada (componente saiu da tela): não é falha, então não usa mock.
    if (isAbortError(error)) throw error;
    return [];
  }
}