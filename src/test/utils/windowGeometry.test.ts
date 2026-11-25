// src/test/utils/windowGeometry.test.ts
// Matemática de layout: a janela nunca pode ficar fora da área visível (nem debaixo da barra de tarefas).
import { beforeEach, describe, expect, it } from 'vitest';
import { clampWindowPosition } from '../../utils/windowGeometry';
import { TASKBAR_HEIGHT_PX } from '../../utils/constants';

// Tela fictícia de 1000 x 800. A área útil para janelas tem 800 - TASKBAR_HEIGHT_PX de altura.
const VIEWPORT_WIDTH = 1000;
const VIEWPORT_HEIGHT = 800;

function setViewport(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', { value: width, configurable: true, writable: true });
  Object.defineProperty(window, 'innerHeight', { value: height, configurable: true, writable: true });
}

describe('clampWindowPosition', () => {
  const windowWidth = 300;
  const windowHeight = 200;
  const maxX = VIEWPORT_WIDTH - windowWidth;
  const maxY = VIEWPORT_HEIGHT - TASKBAR_HEIGHT_PX - windowHeight;

  beforeEach(() => {
    setViewport(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  });

  it('mantém a posição quando a janela já está toda dentro da tela', () => {
    expect(clampWindowPosition({ x: 100, y: 50 }, windowWidth, windowHeight)).toEqual({ x: 100, y: 50 });
  });

  it('corrige coordenadas negativas para 0 (janela arrastada para fora à esquerda e em cima)', () => {
    expect(clampWindowPosition({ x: -250, y: -40 }, windowWidth, windowHeight)).toEqual({ x: 0, y: 0 });
  });

  it('corrige coordenadas maiores que a tela (janela arrastada para fora à direita e embaixo)', () => {
    expect(clampWindowPosition({ x: 5000, y: 5000 }, windowWidth, windowHeight)).toEqual({ x: maxX, y: maxY });
  });

  it('nunca deixa a janela por cima da barra de tarefas', () => {
    const { y } = clampWindowPosition({ x: 0, y: VIEWPORT_HEIGHT }, windowWidth, windowHeight);
    expect(y + windowHeight).toBeLessThanOrEqual(VIEWPORT_HEIGHT - TASKBAR_HEIGHT_PX);
  });

  it('aceita a posição exatamente no limite (borda direita e inferior)', () => {
    expect(clampWindowPosition({ x: maxX, y: maxY }, windowWidth, windowHeight)).toEqual({ x: maxX, y: maxY });
  });

  it('usa 0 quando a janela é maior que a tela (ex.: maximizada ou navegador muito pequeno)', () => {
    expect(clampWindowPosition({ x: 300, y: 300 }, 2000, 2000)).toEqual({ x: 0, y: 0 });
  });
});