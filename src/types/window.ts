// src/types/window.ts
export type WindowType = 'orkut' | 'msn' | 'about' | 'trash';

export interface AppWindow {
  id: string;
  type: WindowType;
  title: string;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}
