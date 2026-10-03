// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { LanguageProvider } from './hooks/useLanguage';
import './styles/global.css';
import './styles/windows-theme.css';
import './styles/orkut-theme.css';
import './styles/msn-theme.css';

// Cria uma instância do QueryClient para gerenciar o cache e as requisições da biblioteca React Query.
const queryClient = new QueryClient();

// Renderiza o aplicativo React na raiz do documento HTML, envolvendo-o com provedores de contexto para gerenciamento de estado e idioma.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
