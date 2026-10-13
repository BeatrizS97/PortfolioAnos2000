// src/components/desktop/Taskbar.tsx
import React, { useState } from 'react';
import type { AppWindow, WindowType } from '../../types/window';
import StartMenu from './StartMenu';
import { useSound } from '../../hooks/useSound';
import { useLanguage } from '../../hooks/useLanguage';
import { LANGUAGE_OPTIONS } from '../../constants/languages';

interface TaskbarProps {
  windows: AppWindow[];
  activeWindowId: string | null;
  onFocus: (id: string) => void;
  onMinimize: (id: string) => void;
  onOpen: (type: WindowType) => void;
}

// Relógio isolado: o estado dele muda a cada 30s e, com isso, só este pedaço re-renderiza (e não a Taskbar inteira).
// O formato da hora segue o idioma atual (t.locale), e ele também re-renderiza quando o idioma muda.
const Clock = React.memo(function Clock() {
  const [clock, setClock] = useState(() => new Date());
  const { t } = useLanguage();

  React.useEffect(() => {
    const interval = window.setInterval(() => setClock(new Date()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <span className="taskbar-clock">
      {clock.toLocaleTimeString(t.locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })}
    </span>
  );
});

const Taskbar: React.FC<TaskbarProps> = ({ windows, activeWindowId, onFocus, onMinimize, onOpen }) => {
  const [startOpen, setStartOpen] = useState(false);
  const { muted, setMuted } = useSound();
  const { language, setLanguage, t } = useLanguage();

  // Função que decide o que fazer quando o usuário clica em um item da Taskbar:
  // - Se a janela estiver minimizada, restaura e foca ela.
  // - Se a janela estiver ativa (no topo), minimiza ela.
  // - Se a janela estiver aberta mas não ativa, apenas foca ela.
  const handleTaskbarItemClick = (win: AppWindow) => {
    if (win.minimized) {
      onFocus(win.id);
      return;
    }
    if (win.id === activeWindowId) {
      onMinimize(win.id);
      return;
    }
    onFocus(win.id);
  };

  return (
    <div className="taskbar">
      <button className="start-button" onClick={() => setStartOpen((prev) => !prev)}>
        <span className="start-button-logo">
          <img src="/assets/images/icon-windows.png" alt="" className="start-button-icon" />
        </span>
        {t.shell.taskbar.start}
      </button>

      {startOpen && <StartMenu onOpen={onOpen} onClose={() => setStartOpen(false)} />}

      <div className="taskbar-divider" />

      <div className="taskbar-windows">
        {windows.map((win) => (
          <button
            key={win.id}
            className={`taskbar-item ${win.id === activeWindowId ? 'taskbar-item--active' : ''}`}
            onClick={() => handleTaskbarItemClick(win)}
          >
            {t.shell.windowTitles[win.type]}
          </button>
        ))}
      </div>

      <div className="taskbar-tray">
        <div className="tray-language" role="group" aria-label={t.shell.taskbar.language}>
          {LANGUAGE_OPTIONS.map(({ code, label, Flag }) => (
            <button
              key={code}
              type="button"
              className={`tray-language-btn ${language === code ? 'tray-language-btn--active' : ''}`}
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
        <button
          className="tray-icon tray-icon--button"
          title={muted ? t.shell.taskbar.unmute : t.shell.taskbar.mute}
          onClick={() => setMuted((prev) => !prev)}
        >
          {muted ? '🔇' : '🔊'}
        </button>
        <span className="tray-icon tray-icon--static" title={t.shell.taskbar.network}>🖧</span>
        <Clock />
      </div>
    </div>
  );
};

export default Taskbar;