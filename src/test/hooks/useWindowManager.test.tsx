// src/test/hooks/useWindowManager.test.tsx
// Lógica de estado do gerenciador de janelas (reducer): foco, z-index, minimizar e fechar.
// Só existe uma janela por tipo (orkut e msn), então "A" = Orkut e "B" = MSN.
import React from 'react';
import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { WindowProvider, useWindowManager } from '../../hooks/useWindowManager';

const wrapper = ({ children }: { children: React.ReactNode }) => <WindowProvider>{children}</WindowProvider>;

// Abre as duas janelas (A = orkut, B = msn) e devolve os ids delas.
function openBothWindows() {
  const hook = renderHook(() => useWindowManager(), { wrapper });
  act(() => hook.result.current.openWindow('orkut'));
  act(() => hook.result.current.openWindow('msn'));

  const findWindow = (type: 'orkut' | 'msn') => hook.result.current.windows.find((w) => w.type === type)!;
  return { ...hook, findWindow };
}

describe('useWindowManager', () => {
  it('abrir uma janela a deixa ativa e visível', () => {
    const { result } = renderHook(() => useWindowManager(), { wrapper });

    act(() => result.current.openWindow('orkut'));

    expect(result.current.windows).toHaveLength(1);
    expect(result.current.activeWindowId).toBe(result.current.windows[0].id);
    expect(result.current.windows[0].minimized).toBe(false);
  });

  it('abrir de novo uma janela do mesmo tipo não duplica: só a traz para a frente', () => {
    const { result } = renderHook(() => useWindowManager(), { wrapper });

    act(() => result.current.openWindow('orkut'));
    const zIndexBefore = result.current.windows[0].zIndex;
    act(() => result.current.openWindow('orkut'));

    expect(result.current.windows).toHaveLength(1);
    expect(result.current.windows[0].zIndex).toBeGreaterThan(zIndexBefore);
  });

  it('a última janela aberta fica ativa e na frente (maior z-index)', () => {
    const { findWindow, result } = openBothWindows();

    expect(result.current.activeWindowId).toBe(findWindow('msn').id);
    expect(findWindow('msn').zIndex).toBeGreaterThan(findWindow('orkut').zIndex);
  });

  it('focar uma janela a leva para a frente e a torna ativa', () => {
    const { findWindow, result } = openBothWindows();

    act(() => result.current.focusWindow(findWindow('orkut').id));

    expect(result.current.activeWindowId).toBe(findWindow('orkut').id);
    expect(findWindow('orkut').zIndex).toBeGreaterThan(findWindow('msn').zIndex);
  });

  it('fluxo completo: abrir A -> abrir B -> focar A -> focar B -> minimizar A -> fechar B', () => {
    const { findWindow, result } = openBothWindows();
    const idA = findWindow('orkut').id;
    const idB = findWindow('msn').id;

    act(() => result.current.focusWindow(idA));
    act(() => result.current.focusWindow(idB));
    act(() => result.current.minimizeWindow(idA));

    // Minimizar a janela que NÃO está ativa não tira o foco de quem está ativo.
    expect(findWindow('orkut').minimized).toBe(true);
    expect(result.current.activeWindowId).toBe(idB);

    act(() => result.current.closeWindow(idB));

    // Sobrou só a A, minimizada: nenhuma janela visível, então ninguém fica ativo.
    expect(result.current.windows.map((w) => w.id)).toEqual([idA]);
    expect(result.current.activeWindowId).toBeNull();
  });

  it('minimizar a janela ativa passa o foco para a próxima janela visível', () => {
    const { findWindow, result } = openBothWindows();

    act(() => result.current.minimizeWindow(findWindow('msn').id));

    expect(result.current.activeWindowId).toBe(findWindow('orkut').id);
  });

  it('focar uma janela minimizada a restaura', () => {
    const { findWindow, result } = openBothWindows();
    const idA = findWindow('orkut').id;

    act(() => result.current.minimizeWindow(idA));
    act(() => result.current.focusWindow(idA));

    expect(findWindow('orkut').minimized).toBe(false);
    expect(result.current.activeWindowId).toBe(idA);
  });

  it('ações disparadas juntas (no mesmo ciclo) são todas aplicadas, na ordem, sem perder nenhuma', () => {
    const { findWindow, result } = openBothWindows();
    const idA = findWindow('orkut').id;
    const idB = findWindow('msn').id;

    act(() => {
      result.current.focusWindow(idA);
      result.current.minimizeWindow(idA);
      result.current.focusWindow(idB);
    });

    expect(findWindow('orkut').minimized).toBe(true);
    expect(result.current.activeWindowId).toBe(idB);
  });

  it('os z-index nunca se repetem, mesmo depois de muitas trocas de foco', () => {
    const { findWindow, result } = openBothWindows();
    const idA = findWindow('orkut').id;
    const idB = findWindow('msn').id;

    for (let i = 0; i < 5; i += 1) {
      act(() => result.current.focusWindow(i % 2 === 0 ? idA : idB));
    }

    const zIndexes = result.current.windows.map((w) => w.zIndex);
    expect(new Set(zIndexes).size).toBe(zIndexes.length);
  });

  it('clicar no fundo (blurWindows) tira o foco de todas as janelas sem fechar nenhuma', () => {
    const { result } = openBothWindows();

    act(() => result.current.blurWindows());

    expect(result.current.activeWindowId).toBeNull();
    expect(result.current.windows).toHaveLength(2);
  });
});