// src/utils/msnHelpers.ts
import type { Language } from '../types/language';
import type { Translations } from './translations';
import { formatDateTime } from './formatDateTime';

// Base de conhecimento com palavras-chave e respostas.
// (Os dados ficam em translations.ts, em t.msn.kb, um conjunto para cada idioma.)
export type KnowledgeBase = Translations['msn']['kb'];

// Texto do indicador de digitação, por idioma.
export const TYPING_TEXT: Record<Language, string> = {
  pt: 'Beatriz está digitando...',
  en: 'Beatriz is typing...',
  es: 'Beatriz está escribiendo...',
};

// Normaliza a pergunta e busca uma resposta na base de conhecimento local.
// Retorna null quando nenhuma palavra-chave é encontrada.
export function findAnswer(question: string, kb: KnowledgeBase): string | null {
  const normalized = question.toLowerCase();
  const match = kb.find((entry) => entry.keywords.some((k) => normalized.includes(k)));
  return match?.answer ?? null;
}

// Formata a data/hora igual ao rodapé clássico do MSN: "dd/mm/aaaa às hh:mm". 
// O texto final vem de t.msn.lastMessage, então muda conforme o idioma.
export function formatLastMessageAt(
  date: Date,
  locale: string,
  buildText: (dateText: string, timeText: string) => string
): string {
  const { dateText, timeText } = formatDateTime(date, locale);
  return buildText(dateText, timeText);
}