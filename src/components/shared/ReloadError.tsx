// src/components/shared/ReloadError.tsx
import React from 'react';
import type { Language } from '../../types/language';
import { useLanguage } from '../../hooks/useLanguage';

interface ReloadErrorProps {
  // Mensagem de erro (cada tela passa a sua, já no idioma atual).
  message: string;
}

// Texto do botão de recarregar, por idioma.
const RELOAD_TEXT: Record<Language, string> = {
  pt: 'Recarregar',
  en: 'Reload',
  es: 'Recargar',
};

// Tela de erro com botão "Recarregar" (usada quando a área de trabalho ou uma janela não consegue carregar).
const ReloadError: React.FC<ReloadErrorProps> = ({ message }) => {
  const { language } = useLanguage();

  return (
    <div className="loading-screen" role="alert" style={{ flexDirection: 'column', gap: 12 }}>
      <p>{message}</p>
      <button type="button" className="xp-button" onClick={() => window.location.reload()} autoFocus>
        {RELOAD_TEXT[language]}
      </button>
    </div>
  );
};

export default ReloadError;