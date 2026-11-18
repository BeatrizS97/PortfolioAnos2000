// src/components/shared/CharCounter.tsx

import React from 'react';

interface CharCounterProps {
  // Quantidade de caracteres digitados até agora.
  current: number;
  // Limite máximo do campo (o mesmo valor usado no atributo maxLength).
  max: number;
}

// A partir de 80% do limite a cor muda para amarelo; ao atingir o limite, para vermelho (as cores ficam em global.css).
const WARNING_RATIO = 0.8;

// Contador de caracteres que aparece abaixo de um campo de texto, no formato "digitados / máximo" (ex.: 120 / 500).
const CharCounter: React.FC<CharCounterProps> = ({ current, max }) => {
  const state = current >= max ? 'limit' : current >= max * WARNING_RATIO ? 'warning' : 'ok';

  return (
    <span className={`char-counter char-counter--${state}`}>
      {current} / {max}
    </span>
  );
};

export default CharCounter;
