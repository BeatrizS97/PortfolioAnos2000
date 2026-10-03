// src/types/scrap.ts
export interface Scrap {
  id: string;
  author_name: string;
  author_avatar?: string;
  message: string;
  is_public: boolean;
  created_at: string;
}

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