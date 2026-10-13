// src/types/language.ts
// Idiomas aceitos pelo site. A lista também serve para validar o valor salvo no localStorage.
export const LANGUAGES = ['pt', 'en', 'es'] as const;

export type Language = (typeof LANGUAGES)[number];

// Retorna true apenas para 'pt', 'en' ou 'es' (qualquer outro valor é considerado inválido).
export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value);
}