// src/components/shared/ExternalLink.tsx

import React from 'react';

// Link que abre em nova aba. Centraliza target="_blank" e rel="noreferrer" para não esquecer em nenhum lugar.
const ExternalLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({ children, ...rest }) => {
  return (
    <a target="_blank" rel="noreferrer" {...rest}>
      {children}
    </a>
  );
};

export default ExternalLink;