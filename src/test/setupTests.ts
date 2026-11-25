// src/test/setupTests.ts
// Configuração que roda antes de cada arquivo de teste.
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Sem "globals" ligado no Vitest, o Testing Library não limpa o DOM sozinho entre os testes: fazemos isso aqui.
// Também limpamos o que o app grava no navegador (idioma, posição dos ícones...) e as variáveis globais trocadas por vi.stubGlobal (fetch, location).
afterEach(() => {
  cleanup();
  window.localStorage.clear();
  window.sessionStorage.clear();
  vi.unstubAllGlobals();
});

// O jsdom não implementa estas APIs do navegador, mas o app usa todas elas. Aqui entram versões vazias só para o código não quebrar nos testes.

// shakeScreen (animations.ts) consulta "prefers-reduced-motion" com matchMedia.
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// O chat do MSN rola a conversa até o fim com scrollIntoView.
Element.prototype.scrollIntoView = () => {};

// A tela de boot toca o som de inicialização; o jsdom avisa "not implemented" no console se o play() não for trocado.
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => {};