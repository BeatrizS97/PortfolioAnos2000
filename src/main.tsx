// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { LanguageProvider } from './hooks/useLanguage';
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

// Renderiza o aplicativo React na raiz do documento HTML, envolvendo-o com provedores de contexto para gerenciamento de estado e idioma.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);