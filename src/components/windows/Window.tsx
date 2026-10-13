// src/components/windows/Window.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { AppWindow } from '../../types/window';
import WindowHeader from './WindowHeader';
import WindowContent from './WindowContent';
import { clampWindowPosition, saveWindowGeometry } from '../../utils/windowGeometry';

// Elementos que podem receber foco do teclado dentro da janela.
const FOCUSABLE_SELECTOR =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  const windowRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  // Última posição do ghost calculada pelo mouse (ref mutável: atualizar não causa re-render).
  const latestGhost = useRef({ x: 0, y: 0 });
  // Id do requestAnimationFrame pendente (null quando não há nenhum agendado).
  const frameId = useRef<number | null>(null);

  // Se a janela for minimizada, o ghost (janela fantasma) desaparece e a animação de minimizar é disparada.
  useEffect(() => {
    if (!win.minimized) {
      setMinimizing(false);
    }
  }, [win.minimized]);

  // Quando a janela passa a ser a ativa, leva o foco do teclado para o primeiro elemento interativo do conteúdo
  // (ou para a própria janela, se ainda não houver nenhum). Não mexe se o foco já estiver dentro dela.
  useEffect(() => {
    if (!isActive || win.minimized) return;
    const container = windowRef.current;
    if (!container || container.contains(document.activeElement)) return;

    const firstInteractive = container.querySelector('.window-body')?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (firstInteractive ?? container).focus({ preventScroll: true });
  }, [isActive, win.minimized]);

  // Função que inicia o arraste da janela, atualizando a posição do ghost conforme o mouse se move.
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    onFocus(win.id);
    setGhostPosition(position);

    // Converte a posição do mouse na posição da janela, mantendo-a dentro da área visível (viewport menos a barra de tarefas).
    const toClampedPosition = (clientX: number, clientY: number) =>
      clampWindowPosition(
        { x: clientX - dragOffset.current.x, y: clientY - dragOffset.current.y },
        win.width,
        win.height
      );

    // Função que atualiza a posição do ghost enquanto o mouse se move.
    // O mouse só grava na ref; o estado é atualizado no máximo uma vez por frame (evita engasgos em telas de alta taxa de atualização).
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragging.current) return;
      latestGhost.current = toClampedPosition(moveEvent.clientX, moveEvent.clientY);
      if (frameId.current !== null) return;
      frameId.current = window.requestAnimationFrame(() => {
        frameId.current = null;
        setGhostPosition(latestGhost.current);
      });
    };

    // Função que finaliza o arraste da janela, atualizando a posição real da janela e removendo os listeners de mouse.
    const handleMouseUp = (upEvent: MouseEvent) => {
      dragging.current = false;
      if (frameId.current !== null) {
        window.cancelAnimationFrame(frameId.current);
        frameId.current = null;
      }
      const finalPosition = toClampedPosition(upEvent.clientX, upEvent.clientY);
      setPosition(finalPosition);
      setGhostPosition(null);
      // Guarda a posição para reabrir a janela no mesmo lugar (janelas maximizadas não são salvas).
      if (!win.maximized) {
        saveWindowGeometry(win.type, { ...finalPosition, width: win.width, height: win.height });
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [position, win.id, win.type, win.width, win.height, win.maximized, onFocus]);

  const handleMinimize = useCallback(() => {
    setMinimizing(true);
    window.setTimeout(() => onMinimize(win.id), 180);
  }, [onMinimize, win.id]);

  if (win.minimized) return null;

  return (
    <>
      <div
        ref={windowRef}
        tabIndex={-1}
        className={`window ${isActive ? 'window--active' : ''} ${ghostPosition ? 'window--ghosting' : ''} ${minimizing ? 'window--minimizing' : ''}`}
        style={{
          left: position.x,
          top: position.y,
          width: win.width,
          height: win.height,
          zIndex: win.zIndex,
          outline: 'none',
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