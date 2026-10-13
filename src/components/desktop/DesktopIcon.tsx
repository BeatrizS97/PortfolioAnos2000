// src/components/desktop/DesktopIcon.tsx
import React from 'react';
import { DESKTOP_ICON_DRAG_TYPE } from '../../utils/constants';
import { useLanguage } from '../../hooks/useLanguage';

interface DesktopIconProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  selected?: boolean;
  disabled?: boolean;
  // Posição (em px) do ícone na área de trabalho.
  position: { x: number; y: number };
  onSelect: (e: React.MouseEvent) => void;
  onOpen: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ 
  id,
  icon, 
  label, 
  selected = false, 
  disabled = false, 
  position,
  onSelect, 
  onOpen 
}) => {
  const { t } = useLanguage();

  // Ao começar a arrastar, guarda qual ícone é e onde o mouse segurou nele. Quem recebe o "drop" (Desktop) calcula a nova posição.
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData(
      DESKTOP_ICON_DRAG_TYPE,
      JSON.stringify({ id, grabX: e.clientX - rect.left, grabY: e.clientY - rect.top })
    );
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      title={disabled ? t.shell.startMenu.comingSoon : undefined}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: disabled ? 'not-allowed' : undefined,
      }}
    >
      <button
        className={`desktop-icon ${selected ? 'desktop-icon--selected' : ''} ${disabled ? 'desktop-icon--disabled' : ''}`}
        onClick={onSelect}
        onDoubleClick={() => !disabled && onOpen()}
        onTouchEnd={() => !disabled && onOpen()}
        disabled={disabled}
        style={disabled ? { pointerEvents: 'none' } : undefined}
      >
        <span className="desktop-icon-glyph">{icon}</span>
        <span>{label}</span>
      </button>
    </div>
  );
};

export default DesktopIcon;