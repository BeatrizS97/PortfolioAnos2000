// src/components/windows/Window.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { AppWindow } from '../../types/window';
import WindowHeader from './WindowHeader';
import WindowContent from './WindowContent';
import { clampWindowPosition, saveWindowGeometry } from '../../utils/windowGeometry';
import { DEFAULT_WINDOW_SIZE, TASKBAR_HEIGHT_PX } from '../../utils/constants';

// Elementos que podem receber foco do teclado dentro da janela.
const FOCUSABLE_SELECTOR =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Ícone pequeno à esquerda do título, por tipo de janela (por enquanto só o MSN tem).
const WINDOW_ICONS: Partial<Record<AppWindow['type'], string>> = {
  msn: '/assets/images/msn-icon.png',
};

interface WindowProps {
  win: AppWindow;
  isActive: boolean;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
}

const Window: React.FC<WindowProps> = ({ win, isActive, onClose, onMinimize, onFocus }) => {
  // Janelas que já abrem maximizadas (ex.: Orkut) guardam o tamanho/posição padrão para o botão "restaurar" voltar a eles.
  const restoreSize = DEFAULT_WINDOW_SIZE[win.type];
  const [maximized, setMaximized] = useState(win.maximized);
  const [size] = useState(win.maximized ? restoreSize : { width: win.width, height: win.height }); // O tamanho da janela não muda enquanto ela está aberta (não há redimensionamento manual), então não precisa de setSize.
  const [position, setPosition] = useState(
    win.maximized
      ? clampWindowPosition({ x: 80, y: 60 }, restoreSize.width, restoreSize.height)
      : { x: win.x, y: win.y }
  );
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

  // Quando a janela do navegador diminui, traz a janela de volta para dentro da área visível (o mesmo ajuste feito nos ícones).
  // Só a posição exibida muda; a posição salva em sessionStorage continua a do último arraste. O if evita re-renderizar sem necessidade.
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        const next = clampWindowPosition(prev, size.width, size.height);
        return next.x === prev.x && next.y === prev.y ? prev : next;
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [size.width, size.height]);

  // Função que inicia o arraste da janela, atualizando a posição do ghost conforme o mouse se move.
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    // Janela maximizada não é arrastada (como no Windows XP).
    if (maximized) return;
    dragging.current = true;
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    onFocus(win.id);
    setGhostPosition(position);

    // Converte a posição do mouse na posição da janela, mantendo-a dentro da área visível (viewport menos a barra de tarefas).
    const toClampedPosition = (clientX: number, clientY: number) =>
      clampWindowPosition(
        { x: clientX - dragOffset.current.x, y: clientY - dragOffset.current.y },
        size.width,
        size.height
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
      if (!maximized) {
        saveWindowGeometry(win.type, { ...finalPosition, width: size.width, height: size.height });
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [maximized, position, size.width, size.height, win.id, win.type, onFocus]);

  const handleMinimize = useCallback(() => {
    setMinimizing(true);
    window.setTimeout(() => onMinimize(win.id), 180);
  }, [onMinimize, win.id]);

  // Alterna entre maximizada (ocupa a tela inteira, menos a barra de tarefas) e o tamanho/posição anteriores.
  const handleMaximize = useCallback(() => {
    setMaximized((prev) => !prev);
  }, []);

  if (win.minimized) return null;

  return (
    <>
      <div
        ref={windowRef}
        tabIndex={-1}
        className={`window ${isActive ? 'window--active' : ''} ${ghostPosition ? 'window--ghosting' : ''} ${minimizing ? 'window--minimizing' : ''} ${maximized ? 'window--maximized' : ''}`}
        style={
          maximized
            ? {
                left: 0,
                top: 0,
                width: '100%',
                height: `calc(100% - ${TASKBAR_HEIGHT_PX}px)`,
                zIndex: win.zIndex,
                outline: 'none',
              }
            : {
                left: position.x,
                top: position.y,
                width: size.width,
                height: size.height,
                zIndex: win.zIndex,
                outline: 'none',
              }
        }
        onMouseDown={() => onFocus(win.id)}
      >
        <WindowHeader
          title={win.title}
          iconSrc={WINDOW_ICONS[win.type]}
          onClose={() => onClose(win.id)}
          maximized={maximized}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
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
            width: size.width,
            height: size.height,
            zIndex: win.zIndex + 1000,
          }}
        />
      )}
    </>
  );
};

export default Window;