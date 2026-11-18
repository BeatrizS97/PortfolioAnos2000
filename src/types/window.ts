// src/types/window.ts
export type WindowType = 'orkut' | 'msn';

export interface AppWindow {
  id: string;
  type: WindowType;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}