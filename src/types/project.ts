// src/types/project.ts
import { z } from 'zod';

// Lista única das categorias de projeto. O schema e o tipo Project usam esta constante,
// então, para criar uma categoria nova, basta mudar aqui (e no enum project_category do banco, que fica no SQL).
export const PROJECT_CATEGORIES = ['frontend', 'fullstack', 'ai', 'mobile', 'other'] as const;

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
  category: z.enum(PROJECT_CATEGORIES),
  featured: z.boolean(),
  order_index: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Tipo derivado do schema (antes era uma interface escrita à mão). Os campos github_url, live_url e image_url
// continuam podendo ser undefined, mas agora a chave precisa existir no objeto (os dados de exemplo já trazem as três).
export type Project = z.infer<typeof projectSchema>;


export interface ProjectFilters {
  category?: Project['category'];
  featured?: boolean;
}

export interface ProjectsApiResponse {
  success: boolean;
  data: Project[];
  total: number;
}