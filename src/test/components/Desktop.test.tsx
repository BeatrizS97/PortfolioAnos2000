// src/test/components/Desktop.test.tsx
// Case de teste: abertura da janela do Orkut (onde ficam os recados/"scrapbook") a partir do ícone da área de trabalho.
import { describe, expect, it } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import Desktop from '../../components/desktop/Desktop';
import { mockApi, mockApiServerError, renderWithProviders } from '../../test/testUtils';

// Um recado como a API /api/scraps devolve.
const SCRAP = {
  id: '1',
  author_name: 'Maria',
  author_avatar: null,
  message: 'Parabéns pelo portfólio!',
  is_public: true,
  created_at: '2026-01-01T00:00:00Z',
};

// Os carregamentos sob demanda (lazy) podem demorar um pouco na primeira vez.
const LOAD_TIMEOUT = { timeout: 8000 };

// Pré-condição comum: Desktop na tela (como depois do boot) e a mensagem de boas-vindas fechada.
function renderDesktopReady() {
  renderWithProviders(<Desktop />);
  fireEvent.click(screen.getByRole('button', { name: 'Entendi' }));
}

// Duplo clique no ícone do Orkut (é assim que o projeto abre os apps: onDoubleClick no DesktopIcon).
function openOrkutByDoubleClick() {
  fireEvent.doubleClick(screen.getByRole('button', { name: /orkut/i }));
}

describe('Desktop: abertura da janela do Orkut (recados)', () => {
  it('abre a janela com foco, título localizado e a lista de recados carregada', async () => {
    mockApi({ '/api/scraps': { body: { success: true, data: [SCRAP], hasMore: false, total: 1 } } });
    renderDesktopReady();

    // Antes do duplo clique não existe nenhuma janela.
    expect(screen.queryByText('Orkut - Meu Perfil')).not.toBeInTheDocument();

    openOrkutByDoubleClick();

    // 1) A janela aparece no DOM, com o título no idioma atual (português).
    const titles = await screen.findAllByText('Orkut - Meu Perfil', {}, LOAD_TIMEOUT);
    const windowElement = titles.map((el) => el.closest('.window')).find((el) => el !== null) as HTMLElement;
    expect(windowElement).toBeInTheDocument();

    // 2) A janela está ativa (foco inicial), e o botão dela na barra de tarefas também.
    expect(windowElement).toHaveClass('window--active');
    expect(document.querySelector('.taskbar-item--active')).toHaveTextContent('Orkut - Meu Perfil');

    // 3) O conteúdo carrega o estado inicial correto: o recado vindo da API aparece e o contador mostra 1.
    expect(await screen.findByText('Parabéns pelo portfólio!', {}, LOAD_TIMEOUT)).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Comentários (1)' })).toBeInTheDocument();

    // 4) Pós-condição: a janela continua aberta e interativa (dá para trocar de aba).
    fireEvent.click(screen.getByRole('button', { name: 'Comunidades' }));
    expect(windowElement).toBeInTheDocument();
    expect(windowElement).toHaveClass('window--active');
  });

  it('mostra o estado vazio quando ainda não há recados', async () => {
    mockApi();
    renderDesktopReady();

    openOrkutByDoubleClick();

    expect(await screen.findByRole('heading', { name: 'Comentários (0)' }, LOAD_TIMEOUT)).toBeInTheDocument();
    expect(screen.queryByText('Parabéns pelo portfólio!')).not.toBeInTheDocument();
  });

  it('usa o título da janela no idioma escolhido (inglês)', async () => {
    window.localStorage.setItem('portfolio:language', JSON.stringify('en'));
    mockApi();
    renderWithProviders(<Desktop />);
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }));

    fireEvent.doubleClick(screen.getByRole('button', { name: /orkut/i }));

    expect((await screen.findAllByText('Orkut - My Profile', {}, LOAD_TIMEOUT)).length).toBeGreaterThan(0);
  });

  it('um clique simples só seleciona o ícone: não abre a janela', () => {
    mockApi();
    renderDesktopReady();

    fireEvent.click(screen.getByRole('button', { name: /orkut/i }));

    expect(screen.queryByText('Orkut - Meu Perfil')).not.toBeInTheDocument();
  });

  it('resiliência: com a API respondendo 500, a janela abre e as listas ficam vazias sem quebrar a interface', async () => {
    mockApiServerError();
    renderDesktopReady();

    openOrkutByDoubleClick();

    expect(await screen.findByRole('heading', { name: 'Comentários (0)' }, LOAD_TIMEOUT)).toBeInTheDocument();
    expect(await screen.findByText('Nenhum projeto encontrado ainda.', {}, LOAD_TIMEOUT)).toBeInTheDocument();
  });
});