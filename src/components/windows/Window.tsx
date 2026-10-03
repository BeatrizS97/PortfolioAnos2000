// src/components/windows/Window.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { AppWindow } from '../../types/window';
import WindowHeader from './WindowHeader';
import WindowContent from './WindowContent';

interface WindowProps {
  win: AppWindow;
  isActive: boolean;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
}

const Window: React.FC<WindowProps> = ({ win, isActive, onClose, onMinimize, onFocus }) => {
  const [position, setPosition] = useState({ x: win.x, y: win.y });
  const [ghostPosition, setGhostPosition] = useState<{ x: number; y: number } | null>(null);
  const [minimizing, setMinimizing] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);

  // Se a janela for minimizada, o ghost (janela fantasma) desaparece e a animação de minimizar é disparada.
  useEffect(() => {
    if (!win.minimized) {
      setMinimizing(false);
    }
  }, [win.minimized]);

  // Função que inicia o arraste da janela, atualizando a posição do ghost conforme o mouse se move.
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    onFocus(win.id);
    setGhostPosition(position);

    // Função que atualiza a posição do ghost enquanto o mouse se move.
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragging.current) return;
      setGhostPosition({
        x: moveEvent.clientX - dragOffset.current.x,
        y: moveEvent.clientY - dragOffset.current.y,
      });
    };

    // Função que finaliza o arraste da janela, atualizando a posição real da janela e removendo os listeners de mouse.
    const handleMouseUp = (upEvent: MouseEvent) => {
      dragging.current = false;
      const finalPosition = {
        x: upEvent.clientX - dragOffset.current.x,
        y: upEvent.clientY - dragOffset.current.y,
      };
      setPosition(finalPosition);
      setGhostPosition(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [position, win.id, onFocus]);

  const handleMinimize = useCallback(() => {
    setMinimizing(true);
    window.setTimeout(() => onMinimize(win.id), 180);
  }, [onMinimize, win.id]);

  if (win.minimized) return null;

  return (
    <>
      <div
        className={`window ${isActive ? 'window--active' : ''} ${ghostPosition ? 'window--ghosting' : ''} ${minimizing ? 'window--minimizing' : ''}`}
        style={{
          left: position.x,
          top: position.y,
          width: win.width,
          height: win.height,
          zIndex: win.zIndex,
        }}
        onMouseDown={() => onFocus(win.id)}
      >
        <WindowHeader
          title={win.title}
          onClose={() => onClose(win.id)}
          onMinimize={handleMinimize}
          onDragStart={handleDragStart}
        />
        <div className="window-body">
          <WindowContent type={win.type} />
        </div>
      </div>

      {ghostPosition && (
        <div
          className="window-ghost"
          style={{
            left: ghostPosition.x,
            top: ghostPosition.y,
            width: win.width,
            height: win.height,
            zIndex: win.zIndex + 1000,
          }}
        />
      )}
    </>
  );
};

export default Window;