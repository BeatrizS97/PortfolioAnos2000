// src/utils/msnHelpers.ts
import type { Translations } from './translations';
import { formatDateTime } from './formatDateTime';

// Base de conhecimento com palavras-chave e respostas.
// (Os dados ficam em translations.ts, em t.msn.kb, um conjunto para cada idioma.)
export type KnowledgeBase = Translations['msn']['kb'];

// Remove acentos e passa para minúsculas, para "inglês" e "ingles" (ou "certificação" e "certificacao") valerem como a mesma palavra.
// Também é usada pelo MSNChat para comparar as letras das teclas de atalho.
export function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Normaliza a pergunta e busca uma resposta na base de conhecimento local.
// Retorna null quando nenhuma palavra-chave é encontrada.
export function findAnswer(question: string, kb: KnowledgeBase): string | null {
  const normalized = normalizeText(question);
  // A primeira entrada que casar vence: no translations.ts as mais específicas (um projeto) vêm antes das genéricas ("projetos").
  const match = kb.find((entry) => entry.keywords.some((k) => normalized.includes(normalizeText(k))));
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