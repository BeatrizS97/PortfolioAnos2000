// src/components/shared/ExternalLink.tsx

import React from 'react';

// Componente para links externos, que abre em nova aba e não passa referrer. O target e rel são fixos, então não podem ser sobrescritos por props externas.
interface ExternalLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel'> {
  href: string;
}

// Target e rel ficam depois do {...rest}, então nada que venha de fora consegue sobrescrevê-los.
const ExternalLink: React.FC<ExternalLinkProps> = ({ children, ...rest }) => {
  return (
    <a {...rest} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
};

export default ExternalLink;