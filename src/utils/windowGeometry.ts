// src/utils/windowGeometry.ts
import type { WindowType } from '../types/window';
import { TASKBAR_HEIGHT_PX } from '../utils/constants';

export interface WindowGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

const STORAGE_PREFIX = 'portfolio:window:';

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

// Mantém a janela inteira dentro da área visível (viewport menos a altura da barra de tarefas).
// Se a janela for maior que a área (ex.: maximizada), a posição fica em 0.
export function clampWindowPosition(position: { x: number; y: number }, width: number, height: number) {
  const maxX = Math.max(0, window.innerWidth - width);
  const maxY = Math.max(0, window.innerHeight - TASKBAR_HEIGHT_PX - height);
  return {
    x: Math.min(Math.max(0, position.x), maxX),
    y: Math.min(Math.max(0, position.y), maxY),
  };
}

// Guarda a última posição/tamanho da janela deste tipo (vale enquanto a aba estiver aberta).
export function saveWindowGeometry(type: WindowType, geometry: WindowGeometry): void {
  try {
    window.sessionStorage.setItem(`${STORAGE_PREFIX}${type}`, JSON.stringify(geometry));
  } catch {
    // sessionStorage indisponível (modo privado, quota excedida) — ignora.
  }
}

// Lê a última geometria salva. Retorna null se não existir ou se o valor estiver corrompido.
export function loadWindowGeometry(type: WindowType): WindowGeometry | null {
  try {
    const raw = window.sessionStorage.getItem(`${STORAGE_PREFIX}${type}`);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;

    const { x, y, width, height } = parsed as Record<string, unknown>;
    if (!isFiniteNumber(x) || !isFiniteNumber(y) || !isFiniteNumber(width) || !isFiniteNumber(height)) return null;
    if (width <= 0 || height <= 0) return null;

    return { x, y, width, height };
  } catch {
    return null;
  }
}