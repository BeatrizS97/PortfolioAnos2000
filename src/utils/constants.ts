// src/utils/constants.ts
import type { Language } from '../types/language';
import type { WindowType } from '../types/window';

// Constantes usadas em vários lugares do app, como nomes de janelas, tamanhos padrão, caminhos de sons e documentos, etc.
// Tamanhos padrão de janelas, usados ao abrir uma nova janela ou ao restaurar uma janela minimizada/maximizada.
// Com Record<WindowType, ...>, o TypeScript acusa erro se um tipo de janela novo ficar sem tamanho.
export const DEFAULT_WINDOW_SIZE: Record<WindowType, { width: number; height: number }> = {
  orkut: { width: 720, height: 560 },
  msn: { width: 680, height: 500 },
};

export const MSN_POPUP_DELAY_MS = 3000;

export const TASKBAR_HEIGHT_PX = 42;

export const SCRAPS_PAGE_SIZE = 5;

// Limites dos campos de texto. São os mesmos validados pela API (api/scraps.ts e api/_utils.ts), para o erro não aparecer só depois de enviar.
export const SCRAP_AUTHOR_NAME_MAX_LENGTH = 80;
export const SCRAP_MESSAGE_MAX_LENGTH = 500;
export const TESTIMONIAL_NAME_MIN_LENGTH = 2;
export const TESTIMONIAL_NAME_MAX_LENGTH = 100;
export const TESTIMONIAL_EMAIL_MAX_LENGTH = 254;
export const TESTIMONIAL_MESSAGE_MIN_LENGTH = 10;
export const TESTIMONIAL_MESSAGE_MAX_LENGTH = 2000;

export const SOUND_PATHS = {
  startup: '/assets/sounds/Windows-XP-Startup.mp3',
  msnNotification: '/assets/sounds/msn-notification.mp3',
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

// Elementos que podem receber foco do teclado (usado pela janela e pelo modal para levar o foco ao primeiro elemento interativo).
export const FOCUSABLE_SELECTOR =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
