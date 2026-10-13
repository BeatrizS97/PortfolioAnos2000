// src/types/project.ts
import { z } from 'zod';
export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  category: 'frontend' | 'fullstack' | 'ai' | 'mobile' | 'other';
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

/**
 * Schema Zod que espelha a interface Project, usado com .safeParse() em projectsService.
 * O banco devolve null nas colunas vazias; o transform converte null em undefined (ou lista/texto vazio)
 * para o resultado bater com a interface acima.
 */
export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullish().transform((value) => value ?? ''),
  tech_stack: z.array(z.string()).nullish().transform((value) => value ?? []),
  github_url: z.string().nullish().transform((value) => value ?? undefined),
  live_url: z.string().nullish().transform((value) => value ?? undefined),
  image_url: z.string().nullish().transform((value) => value ?? undefined),
  category: z.enum(['frontend', 'fullstack', 'ai', 'mobile', 'other']),
  featured: z.boolean(),
  order_index: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});


export interface ProjectFilters {
  category?: Project['category'];
  featured?: boolean;
}

export interface ProjectsApiResponse {
  success: boolean;
  data: Project[];
  total: number;
}