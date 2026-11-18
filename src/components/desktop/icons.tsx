// src/components/desktop/icons.tsx

import React from 'react';

// Tamanho único (em px) usado para exibir todas as bandeiras.
const FLAG_WIDTH = 16;
const FLAG_HEIGHT = 11;

interface FlagBaseProps {
  viewBoxWidth: number;
  viewBoxHeight: number;
  children: React.ReactNode;
}

// Base comum das bandeiras: mesmo tamanho na tela, mesmo preserveAspectRatio e mesma acessibilidade.
// Cada bandeira informa apenas as dimensões do próprio desenho (viewBox).
const FlagBase: React.FC<FlagBaseProps> = ({ viewBoxWidth, viewBoxHeight, children }) => (
  <svg
    width={FLAG_WIDTH}
    height={FLAG_HEIGHT}
    viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const FlagBR: React.FC = () => (
  <FlagBase viewBoxWidth={20} viewBoxHeight={14}>
    <rect width="20" height="14" fill="#009C3B" />
    <polygon points="10,1.4 18.4,7 10,12.6 1.6,7" fill="#FFDF00" />
    <circle cx="10" cy="7" r="3.4" fill="#002776" />
  </FlagBase>
);

const US_STRIPE_HEIGHT = 10 / 13;
const US_STAR_COLUMNS = [0, 1, 2, 3];
const US_STAR_ROWS = [0, 1, 2];

export const FlagUS: React.FC = () => (
  <FlagBase viewBoxWidth={19} viewBoxHeight={10}>
    <rect width="19" height="10" fill="#FFFFFF" />
    {[0, 2, 4, 6, 8, 10, 12].map((i) => (
      <rect key={i} y={i * US_STRIPE_HEIGHT} width="19" height={US_STRIPE_HEIGHT} fill="#B22234" />
    ))}
    <rect width="7.6" height={7 * US_STRIPE_HEIGHT} fill="#3C3B6E" />
    {US_STAR_ROWS.map((row) =>
      US_STAR_COLUMNS.map((col) => (
        <circle key={`${row}-${col}`} cx={1.1 + col * 1.8} cy={0.9 + row * 1.6} r="0.3" fill="#FFFFFF" />
      ))
    )}
  </FlagBase>
);

export const FlagES: React.FC = () => (
  <FlagBase viewBoxWidth={30} viewBoxHeight={20}>
    <rect width="30" height="20" fill="#C60B1E" />
    <rect y="5" width="30" height="10" fill="#FFC400" />
  </FlagBase>
);