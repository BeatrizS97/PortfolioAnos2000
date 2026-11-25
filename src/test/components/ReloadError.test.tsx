// src/test/components/ReloadError.test.tsx
// Tela de erro mostrada pelo App quando a área de trabalho (ou uma janela) não consegue carregar.
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import ReloadError from '../../components/shared/ReloadError';
import { useLanguage } from '../../hooks/useLanguage';
import { renderWithProviders } from '../../test/testUtils';

// Usa o mesmo texto que o App.tsx passa para o componente (t.shell.errors.loadDesktop), no idioma atual.
const DesktopLoadError: React.FC = () => {
  const { t } = useLanguage();
  return <ReloadError message={t.shell.errors.loadDesktop} />;
};

// O jsdom não recarrega a página de verdade: trocamos o location por uma cópia com reload espiável.
function mockReload() {
  const reload = vi.fn();
  vi.stubGlobal('location', { ...window.location, reload });
  return reload;
}

describe('ReloadError', () => {
  it.each([
    { language: 'pt', title: 'Erro', message: 'Não foi possível carregar a área de trabalho. Verifique sua conexão.', button: 'Recarregar' },
    { language: 'en', title: 'Error', message: "Couldn't load the desktop. Check your connection.", button: 'Reload' },
    { language: 'es', title: 'Error', message: 'No se pudo cargar el escritorio. Verifica tu conexión.', button: 'Recargar' },
  ])('mostra título, mensagem e botão no idioma correto ($language)', ({ language, title, message, button }) => {
    window.localStorage.setItem('portfolio:language', JSON.stringify(language));

    renderWithProviders(<DesktopLoadError />);

    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveTextContent(title);
    expect(dialog).toHaveTextContent(message);
    expect(screen.getByRole('button', { name: button })).toBeInTheDocument();
  });

  it('o botão "Recarregar" recarrega a página (o boot e as buscas recomeçam do zero)', () => {
    const reload = mockReload();
    renderWithProviders(<DesktopLoadError />);

    expect(reload).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Recarregar' }));

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('fechar no "×" tira o diálogo, mas a mensagem de erro continua na tela', () => {
    renderWithProviders(<DesktopLoadError />);

    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar a área de trabalho.');
  });
});