// src/utils/formatChatText.tsx
import React from 'react';

// Encontra **negrito** e *itálico* dentro de uma linha de texto.
const INLINE_PATTERN = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g;

// Transforma os marcadores de uma linha em elementos React (<strong> e <em>). O resto continua texto normal.
function formatInline(line: string, lineIndex: number): React.ReactNode[] {
  return line
    .split(INLINE_PATTERN)
    .filter((part) => part !== '')
    .map((part, partIndex) => {
      const key = `${lineIndex}-${partIndex}`;
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={key}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={key}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
}

// Formata a resposta da IA (que vem em Markdown simples) para o chat: negrito, itálico e listas com "- " ou "* ".
// As quebras de linha são mantidas com "\n" (a área de mensagens usa white-space: pre-wrap).
export function formatChatText(text: string): React.ReactNode {
  const lines = text.split('\n');
  return lines.map((line, index) => {
    // Item de lista ("- texto" ou "* texto") vira um marcador "•".
    const withBullet = line.replace(/^\s*[-*]\s+/, '• ');
    return (
      <React.Fragment key={index}>
        {formatInline(withBullet, index)}
        {index < lines.length - 1 ? '\n' : ''}
      </React.Fragment>
    );
  });
}