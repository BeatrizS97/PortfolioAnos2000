// src/components/windows/WindowContent.tsx
import React, { Suspense } from 'react';
import type { WindowType } from '../../types/window';
import { WINDOW_COMPONENTS } from './windowComponents';
import ErrorBoundary from '../shared/ErrorBoundary';
import ReloadError from '../shared/ReloadError';
import { useLanguage } from '../../hooks/useLanguage';

interface WindowContentProps {
  type: WindowType;
}

const WindowContent: React.FC<WindowContentProps> = ({ type }) => {
  const Component = WINDOW_COMPONENTS[type];
  const { t } = useLanguage();

  // O boundary fica por janela: se o conteúdo de uma falhar, as outras janelas e a barra de tarefas continuam funcionando.
  // Mensagem de erro de uma janela (ex.: o arquivo do app não baixou por falta de conexão): t.shell.errors.openWindow.
  return (
    <ErrorBoundary fallback={<ReloadError message={t.shell.errors.openWindow} />}>
      <Suspense fallback={<div className="loading-screen">{t.orkut.loading}</div>}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};

export default WindowContent;
