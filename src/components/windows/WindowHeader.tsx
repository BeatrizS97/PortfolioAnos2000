// src/components/windows/WindowHeader.tsx
import React from 'react';

interface WindowHeaderProps {
  title: string;
  onClose: () => void;
  onMinimize: () => void;
  onDragStart: (e: React.MouseEvent) => void;
}

const WindowHeader: React.FC<WindowHeaderProps> = ({ title, onClose, onMinimize, onDragStart }) => {
  return (
    <div className="window-header" onMouseDown={onDragStart}>
      <span className="window-title">{title}</span>
      <div className="window-controls">
        <button className="win-btn win-btn--minimize" aria-label="Minimizar" onClick={onMinimize} />
        <button className="win-btn win-btn--close" aria-label="Fechar" onClick={onClose} />
      </div>
    </div>
  );
};

export default WindowHeader;
