// src/types/scrap.ts
import { z } from 'zod';

/**
 * Schema Zod que espelha a interface Scrap, usado com .safeParse() em scrapsService.
 * O banco devolve null em author_avatar quando o recado foi criado pelo formulário; o transform converte em undefined.
 */
export const scrapSchema = z.object({
  id: z.string(),
  author_name: z.string(),
  author_avatar: z.string().nullish().transform((value) => value ?? undefined),
  message: z.string(),
  is_public: z.boolean(),
  created_at: z.string(),
});

// Tipo derivado do schema (antes era uma interface escrita à mão). O author_avatar continua podendo ser undefined,
// mas agora a chave precisa existir no objeto (os dados de exemplo já trazem essa chave).
export type Scrap = z.infer<typeof scrapSchema>;

// Resposta da API de scraps, usada para paginação.
export interface ScrapsApiResponse {
  success: boolean;
  data: Scrap[];
  hasMore: boolean;
  total: number;
}

// Payload enviado ao servidor para criar um novo scrap.
export interface NewScrapPayload {
  authorName: string;
  message: string;
}