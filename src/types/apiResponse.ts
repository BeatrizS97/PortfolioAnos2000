// src/types/apiResponse.ts

// Formato padrão das respostas das rotas /api: { success, data }.
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}