// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import { SoundProvider } from './hooks/useSound';
import './styles/global.css';

// Cria uma instância do QueryClient para gerenciar o cache e as requisições da biblioteca React Query.
// Dados ficam "frescos" por 5 minutos e, se uma busca falhar, tenta mais 1 vez (sem insistir como um sistema real faria).
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

// ErrorBoundary da raiz com a tela azul no idioma atual. Ele fica dentro do LanguageProvider para poder ler as traduções.
const RootErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useLanguage();
  return (
    <ErrorBoundary texts={{ message: t.shell.errors.fatal, restart: t.shell.errors.restart }}>{children}</ErrorBoundary>
  );
};

// Renderiza o aplicativo React na raiz do documento HTML, envolvendo-o com provedores de contexto para gerenciamento de estado, idioma e som (mudo).
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <RootErrorBoundary>
          <SoundProvider>
            <App />
          </SoundProvider>
        </RootErrorBoundary>
      </LanguageProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
