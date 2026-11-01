// src/components/desktop/StartMenu.tsx

import React from 'react';
import type { WindowType } from '../../types/window';
import { useLanguage } from '../../hooks/useLanguage';
import { useResumeDownload } from '../../hooks/useResumeDownload';
import ExternalLink from '../shared/ExternalLink';

interface StartMenuProps {
  onOpen: (type: WindowType) => void;
  onClose: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onOpen, onClose }) => {
  const { t } = useLanguage();
  const menu = t.shell.startMenu;
  // Mesmo download do Orkut: baixa o PDF do idioma escolhido.
  const { resumePath, resumeText, isDownloading, downloadError, downloadResume } = useResumeDownload();

  const handleOpen = (type: WindowType) => {
    onOpen(type);
    onClose();
  };

  return (
    <div className="start-menu-v2" onMouseLeave={onClose}>
      <div className="start-menu-banner">
        <span className="start-menu-avatar" aria-hidden="true">👩‍💻</span>
        <span>Beatriz Silva Santos</span>
      </div>

      <div className="start-menu-body">
        <div className="start-menu-col start-menu-col--left">
          <button className="start-menu-pinned" onClick={() => handleOpen('orkut')}>
            <span className="start-menu-icon" style={{ color: '#E91E8C' }}>◉</span>
            <span>
              <strong>Orkut</strong>
              <small>{menu.orkutSubtitle}</small>
            </span>
          </button>
          <button className="start-menu-pinned" onClick={() => handleOpen('msn')}>
            <span className="start-menu-icon" style={{ color: '#00BCD4' }}>💬</span>
            <span>
              <strong>MSN Messenger</strong>
              <small>{menu.msnSubtitle}</small>
            </span>
          </button>

          <div className="start-menu-divider" />

          <div className="start-menu-recent-label">{menu.recentDocuments}</div>
          <button
            className="start-menu-item"
            onClick={downloadResume}
            aria-label={resumeText.ariaLabel}
            aria-busy={isDownloading}
          >
            📄 {isDownloading ? resumeText.downloading : menu.resumeFile}
          </button>
          {downloadError && (
            <p role="alert" style={{ margin: 0, padding: '2px 14px', fontSize: 10, color: 'crimson' }}>
              {resumeText.error} <ExternalLink href={resumePath}>{resumeText.openLink}</ExternalLink>
            </p>
          )}
        </div>

        <div className="start-menu-col start-menu-col--right">
          <button className="start-menu-item start-menu-item--dark" onClick={() => handleOpen('about')}>
            🖥️ {menu.myComputer}
          </button>
          <button className="start-menu-item start-menu-item--dark" disabled title={menu.comingSoon}>
            🖼️ {menu.myPictures}
          </button>
          <button className="start-menu-item start-menu-item--dark" disabled title={menu.comingSoon}>
            🗑️ {menu.trash}
          </button>
          <button className="start-menu-item start-menu-item--dark" disabled title={menu.comingSoon}>
            ⚙️ {menu.controlPanel}
          </button>
          <button className="start-menu-item start-menu-item--dark" disabled title={menu.comingSoon}>
            ▶️ {menu.run}
          </button>
        </div>
      </div>

      <div className="start-menu-footer">
        <button onClick={onClose}>🔒 {menu.logOff}</button>
        <button onClick={onClose}>⏻ {menu.shutDown}</button>
      </div>
    </div>
  );
};

export default StartMenu;