// src/components/windows/WindowContent.tsx
import React, { Suspense } from 'react';
import type { WindowType } from '../../types/window';
import type { Language } from '../../types/language';
import { WINDOW_COMPONENTS } from './windowComponents';
import ErrorBoundary from '../shared/ErrorBoundary';
import { useLanguage } from '../../hooks/useLanguage';

interface WindowContentProps {
  type: WindowType;
}

// Textos da mensagem de erro de uma janela (ex.: o arquivo do app não baixou por falta de conexão), por idioma.
const WINDOW_ERROR_TEXT: Record<Language, { message: string; reload: string }> = {
  pt: { message: 'Não foi possível abrir esta janela. Verifique sua conexão e recarregue a página.', reload: 'Recarregar' },
  en: { message: "Couldn't open this window. Check your connection and reload the page.", reload: 'Reload' },
  es: { message: 'No se pudo abrir esta ventana. Verifica tu conexión y recarga la página.', reload: 'Recargar' },
};

const WindowContent: React.FC<WindowContentProps> = ({ type }) => {
  const Component = WINDOW_COMPONENTS[type];
  const { language, t } = useLanguage();
  const errorText = WINDOW_ERROR_TEXT[language];

  // O boundary fica por janela: se o conteúdo de uma falhar, as outras janelas e a barra de tarefas continuam funcionando.
  return (
    <ErrorBoundary
      fallback={
        <div className="loading-screen" role="alert" style={{ flexDirection: 'column', gap: 12 }}>
          <p>{errorText.message}</p>
          <button type="button" className="xp-button" onClick={() => window.location.reload()}>
            {errorText.reload}
          </button>
        </div>
      }
    >
      <Suspense fallback={<div className="loading-screen">{t.orkut.loading}</div>}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};

export default WindowContent;