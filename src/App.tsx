// src/App.tsx
import React, { lazy, Suspense, useEffect, useState } from 'react';
import BootSequence from './components/desktop/BootSequence';
import { useLanguage } from './hooks/useLanguage';
import type { Language } from './types/language';

// O Desktop é carregado sob demanda: a tela de boot aparece sem esperar o código das janelas e apps.
const loadDesktop = () => import('./components/desktop/Desktop');
const Desktop = lazy(loadDesktop);

type AppStatus = 'booting' | 'loading-data' | 'ready' | 'error';

interface AppState {
  status: AppStatus;
}

// Textos da tela de erro ao carregar a área de trabalho, por idioma.
const LOAD_ERROR_TEXT: Record<Language, { message: string; reload: string }> = {
  pt: { message: 'Não foi possível carregar a área de trabalho. Verifique sua conexão.', reload: 'Recarregar' },
  en: { message: "Couldn't load the desktop. Check your connection.", reload: 'Reload' },
  es: { message: 'No se pudo cargar el escritorio. Verifica tu conexión.', reload: 'Recargar' },
};

// Componente principal do aplicativo, que gerencia a sequência de inicialização e exibe a área de trabalho após o boot.
const App: React.FC = () => {
  const [state, setState] = useState<AppState>({ status: 'booting' });
  const { language, t } = useLanguage();

  // Já começa a baixar o Desktop enquanto a animação de boot roda. Se falhar, o erro é tratado ao fim do boot.
  useEffect(() => {
    void loadDesktop().catch(() => undefined);
  }, []);

  // Ao terminar o boot, garante que o Desktop foi carregado antes de mostrá-lo.
  const handleBootFinish = () => {
    setState({ status: 'loading-data' });
    loadDesktop()
      .then(() => setState({ status: 'ready' }))
      .catch(() => setState({ status: 'error' }));
  };

  if (state.status === 'booting') {
    return <BootSequence onFinish={handleBootFinish} />;
  }

  if (state.status === 'error') {
    return (
      <div className="loading-screen" role="alert" style={{ flexDirection: 'column', gap: 12 }}>
        <p>{LOAD_ERROR_TEXT[language].message}</p>
        <button type="button" className="xp-button" onClick={() => window.location.reload()}>
          {LOAD_ERROR_TEXT[language].reload}
        </button>
      </div>
    );
  }

  if (state.status === 'loading-data') {
    return <div className="loading-screen loading-screen--boot">{t.orkut.loading}</div>;
  }

  return (
    <Suspense fallback={<div className="loading-screen loading-screen--boot">{t.orkut.loading}</div>}>
      <Desktop />
    </Suspense>
  );
};

export default App;