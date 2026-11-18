// src/components/shared/ReloadError.tsx
import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import RetroDialog from './RetroDialog';

interface ReloadErrorProps {
  // Mensagem de erro (cada tela passa a sua, já no idioma atual).
  message: string;
}

// Erro com botão "Recarregar" (usado quando a área de trabalho ou uma janela não consegue carregar).
// Aparece como um diálogo no estilo RetroDialog. Se for fechado no "×", a mensagem continua visível no lugar dele.
// O título e o texto do botão vêm de t.shell.errors.
const ReloadError: React.FC<ReloadErrorProps> = ({ message }) => {
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return (
      <div className="loading-screen" role="alert">
        <p>{message}</p>
      </div>
    );
  }

  return (
    <RetroDialog
      title={t.shell.errors.title}
      buttonLabel={t.shell.errors.reload}
      onConfirm={() => window.location.reload()}
      onClose={() => setDismissed(true)}
    >
      <p>{message}</p>
    </RetroDialog>
  );
};

export default ReloadError;
