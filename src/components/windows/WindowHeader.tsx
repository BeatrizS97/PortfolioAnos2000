// src/components/windows/WindowHeader.tsx
import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

interface WindowHeaderProps {
  title: string;
  iconSrc?: string;
  maximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onDragStart: (e: React.MouseEvent) => void;
}

const WindowHeader: React.FC<WindowHeaderProps> = ({
  title,
  iconSrc,
  maximized,
  onClose,
  onMinimize,
  onMaximize,
  onDragStart,
}) => {
  const { t } = useLanguage();
  const maximizeLabel = maximized ? t.shell.windowControls.restore : t.shell.windowControls.maximize;

  // Duplo clique na barra de título maximiza/restaura (como no Windows XP), mas não quando o clique foi num dos botões.
  const handleDoubleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    onMaximize();
  };

  return (
    <div className="window-header" onMouseDown={onDragStart} onDoubleClick={handleDoubleClick}>
      <div className="window-title-group">
        {iconSrc && <img src={iconSrc} alt="" width={16} height={16} className="window-title-icon" draggable={false} />}
        <span className="window-title">{title}</span>
      </div>
      <div className="window-controls">
        <button className="win-btn win-btn--minimize" aria-label={t.shell.windowControls.minimize} onClick={onMinimize} />
        <button
          className={`win-btn ${maximized ? 'win-btn--restore' : 'win-btn--maximize'}`}
          aria-label={maximizeLabel}
          title={maximizeLabel}
          onClick={onMaximize}
        />
        <button className="win-btn win-btn--close" aria-label={t.shell.windowControls.close} onClick={onClose} />
      </div>
    </div>
  );
};

export default WindowHeader;