// src/components/windows/WindowHeader.tsx
import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

interface WindowHeaderProps {
  title: string;
  onClose: () => void;
  onMinimize: () => void;
  onDragStart: (e: React.MouseEvent) => void;
}

const WindowHeader: React.FC<WindowHeaderProps> = ({ title, onClose, onMinimize, onDragStart }) => {
  const { t } = useLanguage();

  return (
    <div className="window-header" onMouseDown={onDragStart}>
      <span className="window-title">{title}</span>
      <div className="window-controls">
        <button className="win-btn win-btn--minimize" aria-label={t.shell.windowControls.minimize} onClick={onMinimize} />
        <button className="win-btn win-btn--close" aria-label={t.shell.windowControls.close} onClick={onClose} />
      </div>
    </div>
  );
};

export default WindowHeader;