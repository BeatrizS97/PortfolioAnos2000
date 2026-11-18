// src/utils/formatTestimonialText.tsx
import React from 'react';

// Uma regra de formatação: o padrão que encontra o marcador, se ele exige "borda de palavra" e o elemento que o substitui.
interface MarkerRule {
  pattern: RegExp;
  // Para _itálico_ e __sublinhado__, o marcador não vale dentro de uma palavra (ex.: meu_arquivo_final fica como está).
  needsWordBoundary: boolean;
  wrap: (children: React.ReactNode, key: string) => React.ReactNode;
}

// Um marcador encontrado: onde começa, onde termina e o texto de dentro (sem os marcadores).
interface FoundMarker {
  start: number;
  end: number;
  inner: string;
}

// Letra, número ou "_": se o caractere antes do marcador for um deles, o marcador está dentro de uma palavra.
const WORD_CHARACTER = /[\p{L}\p{N}_]/u;

// As regras seguem a mesma ordem e os mesmos padrões do formatMarkers do api/testimonial.ts (que faz o mesmo no e-mail):
// primeiro **negrito**, depois __sublinhado__ e por último _itálico_. O conteúdo não pode começar nem terminar com espaço.
// O "antes do marcador" é conferido à mão em findMarkers, porque o lookbehind (?<!...) do backend não funciona em Safari mais antigo.
const MARKER_RULES: MarkerRule[] = [
  {
    pattern: /\*\*(\S(?:[^\n]*?\S)??)\*\*/gu,
    needsWordBoundary: false,
    wrap: (children, key) => <strong key={key}>{children}</strong>,
  },
  {
    pattern: /__(\S(?:[^\n]*?\S)??)__(?![\p{L}\p{N}_])/gu,
    needsWordBoundary: true,
    wrap: (children, key) => <u key={key}>{children}</u>,
  },
  {
    pattern: /_([^\s_](?:[^\n_]*?[^\s_])??)_(?![\p{L}\p{N}_])/gu,
    needsWordBoundary: true,
    wrap: (children, key) => <em key={key}>{children}</em>,
  },
];

// Procura todos os marcadores de uma regra dentro do texto, ignorando os que estão no meio de uma palavra.
function findMarkers(text: string, rule: MarkerRule): FoundMarker[] {
  // Cópia nova da regex: o lastIndex de uma regex global fica guardado nela mesma, então não pode ser compartilhado.
  const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
  const found: FoundMarker[] = [];

  let match = regex.exec(text);
  while (match !== null) {
    const previousChar = match.index > 0 ? text[match.index - 1] : '';
    if (rule.needsWordBoundary && WORD_CHARACTER.test(previousChar)) {
      // Marcador no meio de uma palavra: ignora e tenta de novo a partir do próximo caractere.
      regex.lastIndex = match.index + 1;
    } else {
      found.push({ start: match.index, end: match.index + match[0].length, inner: match[1] });
    }
    match = regex.exec(text);
  }
  return found;
}

// Aplica as regras uma de cada vez (como o backend): o texto entre os marcadores e o conteúdo de dentro deles
// passam pelas regras seguintes, então **negrito com _itálico_** funciona.
function applyMarkers(text: string, level: number): React.ReactNode[] {
  if (level >= MARKER_RULES.length) return [text];

  const rule = MARKER_RULES[level];
  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  findMarkers(text, rule).forEach((found) => {
    nodes.push(...applyMarkers(text.slice(cursor, found.start), level + 1));
    nodes.push(rule.wrap(applyMarkers(found.inner, level + 1), `${level}-${found.start}`));
    cursor = found.end;
  });

  nodes.push(...applyMarkers(text.slice(cursor), level + 1));
  return nodes;
}

// Transforma os marcadores em elementos React (<strong>, <u> e <em>). O resto continua texto normal.
// As quebras de linha são mantidas com "\n" (quem exibe usa white-space: pre-wrap).
export function formatTestimonialText(text: string): React.ReactNode {
  return applyMarkers(text, 0);
}
