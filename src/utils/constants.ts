// src/utils/constants.ts
import type { Language } from '../types/language';
import type { WindowType } from '../types/window';

// Constantes usadas em vários lugares do app, como nomes de janelas, tamanhos padrão, caminhos de sons e documentos, etc.
// Com Record<WindowType, ...>, o TypeScript acusa erro se um tipo de janela novo ficar sem título ou sem tamanho.
export const WINDOW_TITLES: Record<WindowType, string> = {
  orkut: 'Orkut - Meu Perfil',
  msn: 'MSN Messenger',
  about: 'Meu Computador',
  trash: 'Lixeira',
};

// Tamanhos padrão de janelas, usados ao abrir uma nova janela ou ao restaurar uma janela minimizada/maximizada.
export const DEFAULT_WINDOW_SIZE: Record<WindowType, { width: number; height: number }> = {
  orkut: { width: 720, height: 560 },
  msn: { width: 680, height: 500 },
  about: { width: 480, height: 360 },
  trash: { width: 360, height: 260 },
};

export const MSN_POPUP_DELAY_MS = 3000;

export const TASKBAR_HEIGHT_PX = 42;

export const SCRAPS_PAGE_SIZE = 5;

export const SOUND_PATHS = {
  startup: '/assets/sounds/Windows-XP-Startup.mp3',
  msnNotification: '/assets/sounds/msn-notification.mp3',
  orkutScrap: '/assets/sounds/orkut-scraps.mp3',
};

export const RESUME_PATHS: Record<Language, string> = {
  pt: '/assets/documents/cv-beatriz-silva-santos-pt.pdf',
  en: '/assets/documents/cv-beatriz-silva-santos-en.pdf',
  es: '/assets/documents/cv-beatriz-silva-santos-es.pdf',
}; 

// Ícones do desktop: tipo de dado usado ao arrastar (tipo próprio, para não colar texto em campos de formulário),
// tamanho aproximado de cada ícone e espaçamento da posição padrão.
export const DESKTOP_ICON_DRAG_TYPE = 'application/x-desktop-icon';
export const DESKTOP_ICON_WIDTH = 90;
export const DESKTOP_ICON_HEIGHT = 80;
export const DESKTOP_ICON_MARGIN = 16;
export const DESKTOP_ICON_PITCH_Y = 100;