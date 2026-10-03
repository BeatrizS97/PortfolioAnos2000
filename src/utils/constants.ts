// src/utils/constants.ts
import type { Language } from '../types/language';

// Constantes usadas em vários lugares do app, como nomes de janelas, tamanhos padrão, caminhos de sons e documentos, etc.
export const WINDOW_TITLES: Record<string, string> = {
  orkut: 'Orkut - Meu Perfil',
  msn: 'MSN Messenger',
  about: 'Meu Computador',
  trash: 'Lixeira',
};

// Tamanhos padrão de janelas, usados ao abrir uma nova janela ou ao restaurar uma janela minimizada/maximizada.
export const DEFAULT_WINDOW_SIZE: Record<string, { width: number; height: number }> = {
  orkut: { width: 720, height: 560 },
  msn: { width: 560, height: 620 },
  about: { width: 480, height: 360 },
  trash: { width: 360, height: 260 },
};

export const MSN_POPUP_DELAY_MS = 3000;

export const TASKBAR_HEIGHT_PX = 42;

export const SCRAPS_PAGE_SIZE = 5;

export const SOUND_PATHS = {
  startup: '/assets/sounds/windows-startup.wav',
  msnNotification: '/assets/sounds/msn-notification.mp3',
  orkutScrap: '/assets/sounds/orkut-scraps.mp3',
};

export const RESUME_PATHS: Record<Language, string> = {
  pt: '/assets/documents/cv-beatriz-silva-santos-pt.pdf',
  en: '/assets/documents/cv-beatriz-silva-santos-en.pdf',
  es: '/assets/documents/cv-beatriz-silva-santos-es.pdf',
}; 
