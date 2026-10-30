// src/utils/msnCompose.ts
import type { CSSProperties } from 'react';
import type { Language } from '../types/language';
import { SOUND_PATHS } from './constants';

// Dados e textos da faixa de formatação do chat do MSN (fonte, cor, emoticons, voice clips, winks e planos de fundo).
// Os textos ficam aqui (e não em translations.ts) no mesmo padrão de TOOLBAR_TEXT do TestimonialForm.

// Atalho para montar um texto nos três idiomas.
const label = (pt: string, en: string, es: string): Record<Language, string> => ({ pt, en, es });

// Formatação do texto 

export interface TextFormat {
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: string;
}

export const DEFAULT_TEXT_FORMAT: TextFormat = {
  fontFamily: 'Tahoma',
  fontSize: 11,
  bold: false,
  italic: false,
  underline: false,
  color: '#000000',
};

export const FONT_FAMILIES = ['Tahoma', 'Verdana', 'Arial', 'Times New Roman', 'Courier New', 'Comic Sans MS'];
export const FONT_SIZES = [10, 11, 12, 14, 16, 18, 20];
export const TEXT_COLORS = [
  '#000000', '#808080', '#800000', '#FF0000', '#FF6600', '#FFCC00', '#008000',
  '#00AA00', '#00CCCC', '#0000FF', '#000080', '#800080', '#FF00FF', '#FF69B4',
];

// Confere se o valor salvo no localStorage é uma formatação válida. Só aceita valores das listas acima,
// então um valor editado à mão nunca chega ao CSS.
export function isTextFormat(value: unknown): value is TextFormat {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.fontFamily === 'string' && FONT_FAMILIES.includes(v.fontFamily) &&
    typeof v.fontSize === 'number' && FONT_SIZES.includes(v.fontSize) &&
    typeof v.bold === 'boolean' &&
    typeof v.italic === 'boolean' &&
    typeof v.underline === 'boolean' &&
    typeof v.color === 'string' && TEXT_COLORS.includes(v.color)
  );
}

// Converte a formatação em estilo inline (usado no campo de digitação e nas mensagens enviadas).
export function formatToStyle(format: TextFormat): CSSProperties {
  return {
    fontFamily: `'${format.fontFamily}', Tahoma, Verdana, sans-serif`,
    fontSize: format.fontSize,
    fontWeight: format.bold ? 'bold' : 'normal',
    fontStyle: format.italic ? 'italic' : 'normal',
    textDecoration: format.underline ? 'underline' : 'none',
    color: format.color,
  };
}

// Textos da interface da faixa 

export const COMPOSE_TEXT: Record<
  Language,
  {
    fontPanel: string; fontFamily: string; fontSize: string; bold: string; italic: string; underline: string;
    textColor: string; reset: string; gift: string; voiceSent: string; winkSent: string;
  }
> = {
  pt: {
    fontPanel: 'Formatar texto', fontFamily: 'Fonte', fontSize: 'Tamanho', bold: 'Negrito', italic: 'Itálico',
    underline: 'Sublinhado', textColor: 'Cor do texto', reset: 'Restaurar padrão', gift: 'Presente',
    voiceSent: 'Você enviou um voice clip:', winkSent: 'Você enviou um wink:',
  },
  en: {
    fontPanel: 'Format text', fontFamily: 'Font', fontSize: 'Size', bold: 'Bold', italic: 'Italic',
    underline: 'Underline', textColor: 'Text color', reset: 'Reset to default', gift: 'Gift',
    voiceSent: 'You sent a voice clip:', winkSent: 'You sent a wink:',
  },
  es: {
    fontPanel: 'Formato del texto', fontFamily: 'Fuente', fontSize: 'Tamaño', bold: 'Negrita', italic: 'Cursiva',
    underline: 'Subrayado', textColor: 'Color del texto', reset: 'Restaurar valores', gift: 'Regalo',
    voiceSent: 'Enviaste un voice clip:', winkSent: 'Enviaste un wink:',
  },
};

// Emoticons (inseridos no texto, na posição do cursor) 

export const EMOTICONS: { emoji: string; label: Record<Language, string> }[] = [
  { emoji: '🙂', label: label('Sorriso', 'Smile', 'Sonrisa') },
  { emoji: '😄', label: label('Feliz', 'Happy', 'Feliz') },
  { emoji: '😉', label: label('Piscadinha', 'Wink', 'Guiño') },
  { emoji: '😛', label: label('Língua de fora', 'Tongue out', 'Lengua afuera') },
  { emoji: '😢', label: label('Triste', 'Sad', 'Triste') },
  { emoji: '😮', label: label('Surpresa', 'Surprised', 'Sorpresa') },
  { emoji: '😎', label: label('Legal', 'Cool', 'Genial') },
  { emoji: '😍', label: label('Apaixonada', 'In love', 'Enamorada') },
  { emoji: '😂', label: label('Gargalhada', 'Laughing', 'Carcajada') },
  { emoji: '😡', label: label('Brava', 'Angry', 'Enojada') },
  { emoji: '👍', label: label('Joinha', 'Thumbs up', 'Pulgar arriba') },
  { emoji: '❤️', label: label('Coração', 'Heart', 'Corazón') },
];

// Voice clips (tocam sons que o site já tem) 

export const VOICE_CLIPS: { id: string; path: string; label: Record<Language, string> }[] = [
  { id: 'notification', path: SOUND_PATHS.msnNotification, label: label('Notificação do MSN', 'MSN notification', 'Notificación de MSN') },
  { id: 'scrap', path: SOUND_PATHS.orkutScrap, label: label('Recado do Orkut', 'Orkut scrap', 'Mensaje de Orkut') },
  { id: 'startup', path: SOUND_PATHS.startup, label: label('Inicialização do Windows', 'Windows startup', 'Inicio de Windows') },
];

// Winks (animações que aparecem no histórico) 

export const WINKS: { id: string; emoji: string; label: Record<Language, string> }[] = [
  { id: 'kiss', emoji: '💋', label: label('Beijo', 'Kiss', 'Beso') },
  { id: 'party', emoji: '🎉', label: label('Festa', 'Party', 'Fiesta') },
  { id: 'heart', emoji: '💖', label: label('Coração', 'Heart', 'Corazón') },
  { id: 'sparkles', emoji: '✨', label: label('Brilho', 'Sparkles', 'Brillo') },
  { id: 'rocket', emoji: '🚀', label: label('Foguete', 'Rocket', 'Cohete') },
];

// Planos de fundo da área de mensagens

export const BACKGROUNDS: { id: string; css: string; label: Record<Language, string> }[] = [
  { id: 'default', css: '#FFFFFF', label: label('Padrão', 'Default', 'Predeterminado') },
  { id: 'sky', css: 'linear-gradient(to bottom, #DCEEFF 0%, #FFFFFF 100%)', label: label('Céu', 'Sky', 'Cielo') },
  { id: 'grass', css: '#EAF7E4', label: label('Grama', 'Grass', 'Césped') },
  { id: 'rose', css: '#FFEAF3', label: label('Rosa', 'Rose', 'Rosa') },
  { id: 'lavender', css: '#F1EAFB', label: label('Lavanda', 'Lavender', 'Lavanda') },
  { id: 'sunset', css: 'linear-gradient(to bottom, #FFF1D6 0%, #FFE0E8 100%)', label: label('Pôr do sol', 'Sunset', 'Atardecer') },
];

export function isBackgroundId(value: unknown): value is string {
  return typeof value === 'string' && BACKGROUNDS.some((background) => background.id === value);
}