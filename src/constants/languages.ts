// src/constants/languages.ts
import type { FC } from 'react';
import type { Language } from '../types/language';
import { FlagBR, FlagUS, FlagES } from '../components/desktop/icons';

// Nomes dos idiomas ficam no próprio idioma, como em qualquer seletor de idioma.
// Lista única usada pela Taskbar e pela BootSequence.
export const LANGUAGE_OPTIONS: { code: Language; label: string; Flag: FC }[] = [
  { code: 'pt', label: 'Português', Flag: FlagBR },
  { code: 'en', label: 'English', Flag: FlagUS },
  { code: 'es', label: 'Español', Flag: FlagES },
];