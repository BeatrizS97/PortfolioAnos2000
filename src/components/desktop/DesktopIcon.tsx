// src/components/desktop/DesktopIcon.tsx
import React from 'react';

interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onOpen: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ 
  icon, 
  label, 
  selected = false, 
  disabled = false, 
  onSelect, 
  onOpen 
}) => {
  return (
    <button
      className={`desktop-icon ${selected ? 'desktop-icon--selected' : ''} ${disabled ? 'desktop-icon--disabled' : ''}`}
      onClick={onSelect}
      onDoubleClick={() => !disabled && onOpen()}
      onTouchEnd={() => !disabled && onOpen()}
      disabled={disabled}
      title={disabled ? 'Indisponível' : undefined}
    >
      <span className="desktop-icon-glyph">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export default DesktopIcon;