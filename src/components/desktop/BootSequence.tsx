// src/components/desktop/BootSequence.tsx
import React, { useEffect } from 'react';
import '../../styles/windows-theme.css';
import { useSound } from '../../hooks/useSound';
import { useLanguage } from '../../hooks/useLanguage';
import { SOUND_PATHS } from '../../utils/constants';
import { LANGUAGE_OPTIONS } from '../../constants/languages';

interface BootSequenceProps {
  onFinish: () => void;
}

const BOOT_DURATION_MS = 2600;

const BootSequence: React.FC<BootSequenceProps> = ({ onFinish }) => {
  const { playSound } = useSound();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    // O navegador pode bloquear o som antes da primeira interação do usuário; nesse caso o boot segue sem som.
    try {
      playSound(SOUND_PATHS.startup);
    } catch {
      // Sem som — não é motivo para quebrar o boot.
    }
    const timer = window.setTimeout(onFinish, BOOT_DURATION_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="boot-screen" role="status" aria-label={t.shell.boot.ariaLabel}>
      <div className="boot-language-switcher" role="group" aria-label={t.shell.taskbar.language}>
        {LANGUAGE_OPTIONS.map(({ code, label, Flag }) => (
          <button
            key={code}
            type="button"
            className={`boot-language-btn ${language === code ? 'boot-language-btn--active' : ''}`}
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

      <div className="boot-logo-row">
        <img
          src="/assets/images/icon-windows.png"
          alt=""
          width={400}
          height={400}
          className="boot-logo-icon"
        />
        <div className="boot-logo-text">
          <span className="boot-logo-caption">{t.shell.boot.caption}</span>
          <strong className="boot-logo-main">
            {t.shell.boot.title}<sup className="boot-logo-edition">2000</sup>
          </strong>
        </div>
      </div>

      <div className="boot-progress-track">
        <div className="boot-progress-block boot-progress-block--1" />
        <div className="boot-progress-block boot-progress-block--2" />
        <div className="boot-progress-block boot-progress-block--3" />
      </div>

      <div className="boot-footer">
        <span>Copyright © {new Date().getFullYear()} Beatriz Silva Santos</span>
        <span className="boot-footer-brand">Portfólio</span>
      </div>

      <button className="boot-skip" onClick={onFinish}>
        {t.shell.boot.skip}
      </button>
    </div>
  );
};

export default BootSequence;