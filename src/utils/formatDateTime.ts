// src/utils/formatDateTime.ts

// Formata data e hora no idioma da interface usando Intl.DateTimeFormat (o locale vem de t.locale, ex.: 'pt-BR').
// Devolve as duas partes separadas, porque cada idioma monta a frase de um jeito (ver t.msn.lastMessage).
export function formatDateTime(date: Date, locale: string): { dateText: string; timeText: string } {
  const dateText = new Intl.DateTimeFormat(locale).format(date);
  const timeText = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(date);
  return { dateText, timeText };
}