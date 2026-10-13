// src/components/shared/Input.tsx

import React from 'react';

// Props do Input: todas as props de um <input> normal, mais os estados visuais abaixo. */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Marca o campo como inválido (borda vermelha e aria-invalid). */
  hasError?: boolean;
  // Mostra o campo em carregamento (animação) e o deixa somente leitura. */
  isLoading?: boolean;
}

// Campo de texto no estilo Windows XP. O estado disabled é estilizado pelo CSS;
// hasError e isLoading adicionam as classes xp-input--error e xp-input--loading.
const Input: React.FC<InputProps> = ({ hasError = false, isLoading = false, className = '', readOnly, ...rest }) => {
  const stateClasses = `${hasError ? 'xp-input--error' : ''} ${isLoading ? 'xp-input--loading' : ''}`;

  return (
    <input
      className={`xp-input ${stateClasses} ${className}`}
      aria-invalid={hasError || undefined}
      aria-busy={isLoading || undefined}
      readOnly={isLoading || readOnly}
      {...rest}
    />
  );
};

export default Input;