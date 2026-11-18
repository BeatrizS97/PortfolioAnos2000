// src/utils/msnCompose.ts
import type { CSSProperties } from 'react';
import type { Language } from '../types/language';

// Dados da faixa de formatação do chat do MSN (fonte, cor, emoticons, winks e planos de fundo).
// Os textos da interface da faixa ficam em translations.ts (t.msn.compose); aqui ficam só os rótulos de cada emoticon, wink e plano de fundo.

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