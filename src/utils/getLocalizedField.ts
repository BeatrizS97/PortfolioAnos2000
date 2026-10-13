// src/utils/getLocalizedField.ts
import type { Language } from '../types/language';

// Devolve o campo traduzido de um item vindo do banco (ex.: course_pt / course_en / course_es).
// Se a tradução do idioma atual não existir (ou estiver vazia), cai para o português.
export function getLocalizedField(item: object, fieldBase: string, currentLang: Language): string {
  const record = item as Record<string, unknown>;
  const localized = record[`${fieldBase}_${currentLang}`];
  if (typeof localized === 'string' && localized) return localized;

  const fallback = record[`${fieldBase}_pt`];
  return typeof fallback === 'string' ? fallback : '';
}