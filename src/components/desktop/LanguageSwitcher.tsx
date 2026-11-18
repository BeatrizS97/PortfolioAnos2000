// src/components/desktop/LanguageSwitcher.tsx
import React from 'react';
import type { FC } from 'react';
import type { Language } from '../../types/language';
import { useLanguage } from '../../hooks/useLanguage';
import { FlagBR, FlagUS, FlagES } from './icons';

// Nomes dos idiomas ficam no próprio idioma, como em qualquer seletor de idioma.
// Lista usada pela Taskbar e pela BootSequence (as duas usam este componente).
const LANGUAGE_OPTIONS: { code: Language; label: string; Flag: FC }[] = [
  { code: 'pt', label: 'Português', Flag: FlagBR },
  { code: 'en', label: 'English', Flag: FlagUS },
  { code: 'es', label: 'Español', Flag: FlagES },
];

interface LanguageSwitcherProps {
  // Classe do container dos botões (ex.: "tray-language" na barra de tarefas).
  containerClass: string;
  // Classe de cada botão (ex.: "tray-language-btn"). O botão do idioma atual também recebe "<buttonClass>--active".
  buttonClass: string;
}

// Seletor de idioma (bandeira + sigla) usado na barra de tarefas e na tela de boot. Só as classes CSS mudam entre os dois.
const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ containerClass, buttonClass }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className={containerClass} role="group" aria-label={t.shell.taskbar.language}>
      {LANGUAGE_OPTIONS.map(({ code, label, Flag }) => (
        <button
          key={code}
          type="button"
          className={`${buttonClass} ${language === code ? `${buttonClass}--active` : ''}`}
          onClick={() => setLanguage(code)}
          title={label}
          aria-label={label}
          aria-pressed={language === code}
        >
          <Flag />
          <span>{code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
