// src/test/App.test.tsx
// Fluxo crítico simplificado (E2E dentro do Vitest): o app inteiro, do boot até a área de trabalho, com a API fora do ar.
import { describe, expect, it } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import App from '../App';
import { mockApiServerError, renderWithProviders } from './testUtils';

describe('App: fluxo de boot com a API fora do ar (HTTP 500)', () => {
  it('mostra a tela de boot e já começa a buscar os dados do Orkut (prefetch)', () => {
    const fetchMock = mockApiServerError();

    renderWithProviders(<App />);

    expect(screen.getByRole('status', { name: 'Carregando ambiente' })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith('/api/projects', expect.anything());
  });

  it('as buscas que falharam não travam nem derrubam o app: ao pular o boot, a área de trabalho abre', async () => {
    mockApiServerError();
    renderWithProviders(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'pular »' }));

    // A mensagem de boas-vindas só existe depois que a área de trabalho carregou (lazy loading do Desktop).
    expect(await screen.findByRole('alertdialog', {}, { timeout: 8000 })).toHaveTextContent('Bem-vindo(a)!');
    expect(screen.getByRole('button', { name: /orkut/i })).toBeInTheDocument();
    // Nenhuma tela de erro apareceu.
    expect(screen.queryByText(/Não foi possível carregar a área de trabalho/)).not.toBeInTheDocument();
  });

  it('o idioma escolhido na tela de boot vale para a área de trabalho (inglês)', async () => {
    mockApiServerError();
    renderWithProviders(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    fireEvent.click(screen.getByRole('button', { name: 'skip »' }));

    expect(await screen.findByRole('alertdialog', {}, { timeout: 8000 })).toHaveTextContent('Welcome!');
  });
});