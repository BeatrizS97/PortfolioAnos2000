// src/test/testUtils.tsx
// Ajudas compartilhadas pelos testes de tela (Desktop e App).
import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { LanguageProvider } from '../hooks/useLanguage';
import { SoundProvider } from '../hooks/useSound';

// Renderiza um componente com os mesmos provedores do main.tsx (React Query, idioma e som).
// O QueryClient dos testes não tenta de novo ao falhar (retry: false), assim um erro de API aparece na hora em vez de esperar a nova tentativa.
export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <SoundProvider>{ui}</SoundProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

interface FakeRoute {
  status?: number;
  body: unknown;
}

// Respostas padrão: listas vazias. O perfil é a exceção porque a API devolve "data: null" quando não há perfil (e não uma lista).
const DEFAULT_ROUTES: Record<string, FakeRoute> = {
  '/api/profile': { body: { success: true, data: null } },
  '/api/scraps': { body: { success: true, data: [], hasMore: false, total: 0 } },
};
const EMPTY_LIST = { success: true, data: [] };

// Troca o fetch do navegador por um falso (sem backend real, sem msw). A chave de cada rota é o começo da URL, ex.: '/api/scraps'.
// Rotas que não forem informadas respondem com a lista vazia padrão.
export function mockApi(routes: Record<string, FakeRoute> = {}) {
  const allRoutes = { ...DEFAULT_ROUTES, ...routes };

  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    const match = Object.entries(allRoutes).find(([prefix]) => url.startsWith(prefix));
    const route = match?.[1];
    return new Response(JSON.stringify(route?.body ?? EMPTY_LIST), {
      status: route?.status ?? 200,
      headers: { 'Content-Type': 'application/json' },
    });
  });

  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

// Faz TODAS as rotas /api responderem 500, como se o servidor estivesse fora do ar.
export function mockApiServerError() {
  const fetchMock = vi.fn(
    async () =>
      new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}