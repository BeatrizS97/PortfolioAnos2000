// src/components/desktop/StartMenu.tsx

import React from 'react';
import type { WindowType } from '../../types/window';
import { useLanguage } from '../../hooks/useLanguage';

interface StartMenuProps {
  onOpen: (type: WindowType) => void;
  onClose: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onOpen, onClose }) => {
  const { t } = useLanguage();

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
              <small>Meu perfil e projetos</small>
            </span>
          </button>
          <button className="start-menu-pinned" onClick={() => handleOpen('msn')}>
            <span className="start-menu-icon" style={{ color: '#00BCD4' }}>💬</span>
            <span>
              <strong>MSN Messenger</strong>
              <small>Conversar com a IA da Bia</small>
            </span>
          </button>

          <div className="start-menu-divider" />

          <div className="start-menu-recent-label">Documentos recentes</div>
          <button className="start-menu-item" disabled title="Em breve">
            📄 Currículo.pdf
          </button>
        </div>

        <div className="start-menu-col start-menu-col--right">
          <button className="start-menu-item start-menu-item--dark" onClick={() => handleOpen('about')}>
            🖥️ Meu Computador
          </button>
          <button className="start-menu-item start-menu-item--dark" disabled title={t.shell.startMenu.comingSoon}>
            🖼️ Minhas Imagens
          </button>
          <button className="start-menu-item start-menu-item--dark" disabled title={t.shell.startMenu.comingSoon}>
            🗑️ Lixeira
          </button>
          <button className="start-menu-item start-menu-item--dark" disabled title={t.shell.startMenu.comingSoon}>
            ⚙️ Painel de Controle
          </button>
          <button className="start-menu-item start-menu-item--dark" disabled title={t.shell.startMenu.comingSoon}>
            ▶️ Executar...
          </button>
        </div>
      </div>

      <div className="start-menu-footer">
        <button onClick={onClose}>🔒 Log Off</button>
        <button onClick={onClose}>⏻ Desligar</button>
      </div>
    </div>
  );
};

export default StartMenu;