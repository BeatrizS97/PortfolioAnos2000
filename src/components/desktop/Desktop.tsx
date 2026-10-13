// src/components/desktop/Desktop.tsx
import React, { useEffect, useRef, useState } from 'react';
import '../../styles/windows-theme.css';
import '../../styles/msn-theme.css';
import { WindowProvider, useWindowManager } from '../../hooks/useWindowManager';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import WindowManager from '../windows/WindowManager';
import Taskbar from './Taskbar';
import DesktopIcon from './DesktopIcon';
import NotificationPopup from '../apps/MSNMessenger/NotificationPopup';
import {
  MSN_POPUP_DELAY_MS,
  TASKBAR_HEIGHT_PX,
  DESKTOP_ICON_DRAG_TYPE,
  DESKTOP_ICON_WIDTH,
  DESKTOP_ICON_HEIGHT,
  DESKTOP_ICON_MARGIN,
  DESKTOP_ICON_PITCH_Y,
} from '../../utils/constants';
import { useLanguage } from '../../hooks/useLanguage';

const ICON_SIZE = 46;

interface DesktopIconConfig {
  id: string;
  iconSrc: string;
  label: string;
  onOpen: () => void;
  disabled?: boolean;
  imageZoom?: number;
}

interface IconPosition {
  x: number;
  y: number;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

// Confere se o valor salvo no localStorage tem o formato { [idDoIcone]: { x, y } }. Se não tiver, as posições voltam ao padrão.
// Para resetar à mão: apague a chave 'portfolio:iconPositions' do localStorage (DevTools > Application > Local Storage).
function isIconPositions(value: unknown): value is Record<string, IconPosition> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  return Object.values(value).every((position) => {
    if (typeof position !== 'object' || position === null) return false;
    const { x, y } = position as Record<string, unknown>;
    return isFiniteNumber(x) && isFiniteNumber(y);
  });
}

// Posição padrão do ícone (coluna à esquerda), usada até o ícone ser movido.
function getDefaultPosition(index: number): IconPosition {
  return { x: DESKTOP_ICON_MARGIN, y: DESKTOP_ICON_MARGIN + index * DESKTOP_ICON_PITCH_Y };
}

// Mantém o ícone dentro da tela (e acima da barra de tarefas), mesmo se a janela do navegador tiver diminuído.
function clampPosition(position: IconPosition): IconPosition {
  const maxX = Math.max(0, window.innerWidth - DESKTOP_ICON_WIDTH);
  const maxY = Math.max(0, window.innerHeight - TASKBAR_HEIGHT_PX - DESKTOP_ICON_HEIGHT);
  return {
    x: Math.min(Math.max(0, position.x), maxX),
    y: Math.min(Math.max(0, position.y), maxY),
  };
}

const DesktopInner: React.FC = () => {
  const { windows, activeWindowId, openWindow, focusWindow, minimizeWindow, blurWindows } = useWindowManager();
  const { t } = useLanguage();
  const msnTriggered = useRef(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [showMsnNotification, setShowMsnNotification] = useState(false);
  const [iconPositions, setIconPositions] = useLocalStorage<Record<string, IconPosition>>(
    'portfolio:iconPositions',
    {},
    isIconPositions
  );

  // Calculados fora do efeito: ele só roda quando o Orkut ou o MSN abrem/fecham, e não a cada foco ou arraste de janela.
  // (Antes dependia de "windows": qualquer clique dentro do Orkut nos 3 primeiros segundos cancelava o timer e a notificação nunca aparecia.)
  const orkutOpen = windows.some((w) => w.type === 'orkut');
  const msnOpen = windows.some((w) => w.type === 'msn');

  useEffect(() => {
    if (orkutOpen && !msnOpen && !msnTriggered.current) {
      // Só marca como "já disparou" quando o timer realmente dispara; se o efeito for cancelado antes, ele pode armar de novo.
      const timer = window.setTimeout(() => {
        msnTriggered.current = true;
        setShowMsnNotification(true);
      }, MSN_POPUP_DELAY_MS);
      return () => window.clearTimeout(timer);
    }

    if (!orkutOpen) {
      msnTriggered.current = false;
    }
    if (msnOpen) {
      // Se o MSN já está aberto, a notificação não faz mais sentido (nem quando ele for fechado depois).
      msnTriggered.current = true;
      setShowMsnNotification(false);
    }
  }, [orkutOpen, msnOpen]);

  const icons: DesktopIconConfig[] = [
    { id: 'orkut', iconSrc: '/assets/images/orkut-icon.png', label: 'Orkut', onOpen: () => openWindow('orkut'), imageZoom: 1.6 },
    { id: 'msn', iconSrc: '/assets/images/msn-icon.png', label: 'MSN Messenger', onOpen: () => openWindow('msn') },
    { id: 'trash', iconSrc: '/assets/images/icons/trash.png', label: t.shell.desktopIcons.trash, onOpen: () => {}, disabled: true },
  ];

  // Clique no fundo da área de trabalho (não em janela, taskbar ou ícone) tira o foco de todas as janelas.
  // Usa mousedown (e não click) para que arrastar uma janela e soltar no fundo não a desfoque sem querer.
  const handleBackgroundMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target === e.currentTarget || target.classList.contains('desktop-icons')) {
      blurWindows();
    }
  };

  // Permite soltar (drop) apenas quando o que está sendo arrastado é um ícone do desktop.
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.types.includes(DESKTOP_ICON_DRAG_TYPE)) {
      e.preventDefault();
    }
  };

  // Ao soltar o ícone, calcula a nova posição (ponteiro menos o ponto onde o ícone foi "pego") e salva.
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const raw = e.dataTransfer.getData(DESKTOP_ICON_DRAG_TYPE);
    if (!raw) return;
    e.preventDefault();

    try {
      const data = JSON.parse(raw) as { id?: unknown; grabX?: unknown; grabY?: unknown };
      const knownIcon = icons.some((icon) => icon.id === data.id);
      if (!knownIcon || typeof data.id !== 'string' || typeof data.grabX !== 'number' || typeof data.grabY !== 'number') {
        return;
      }

      const iconId = data.id;
      const next = clampPosition({ x: e.clientX - data.grabX, y: e.clientY - data.grabY });
      setIconPositions((prev) => ({ ...prev, [iconId]: next }));
    } catch {
      // Dado de arraste inválido — ignora.
    }
  };

  return (
    <div
      className="desktop-container"
      onClick={() => setSelectedIcon(null)}
      onMouseDown={handleBackgroundMouseDown}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="desktop-icons">
        {icons.map((item, index) => {
          const zoom = item.imageZoom ?? 1;
          const zoomedSize = ICON_SIZE * zoom;
          const position = clampPosition(iconPositions[item.id] ?? getDefaultPosition(index));

          return (
            <DesktopIcon
              key={item.id}
              id={item.id}
              position={position}
              icon={
                zoom === 1 ? (
                  <img src={item.iconSrc} alt={item.label} draggable={false} width={ICON_SIZE} height={ICON_SIZE} />
                ) : (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: ICON_SIZE,
                      height: ICON_SIZE,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={item.iconSrc}
                      alt={item.label}
                      draggable={false}
                      width={zoomedSize}
                      height={zoomedSize}
                      style={{ maxWidth: 'none' }}
                    />
                  </span>
                )
              }
              label={item.label}
              selected={selectedIcon === item.id}
              disabled={item.disabled}
              onSelect={(e) => {
                e.stopPropagation();
                setSelectedIcon(item.id);
              }}
              onOpen={item.disabled ? () => {} : item.onOpen}
            />
          );
        })}
      </div>

      <WindowManager />
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        onFocus={focusWindow}
        onMinimize={minimizeWindow}
        onOpen={openWindow}
      />

      {showMsnNotification && (
        <NotificationPopup
          contactName={t.msn.contactName}
          onOpen={() => {
            setShowMsnNotification(false);
            openWindow('msn');
          }}
          onDismiss={() => setShowMsnNotification(false)}
        />
      )}
    </div>
  );
};

const Desktop: React.FC = () => (
  <WindowProvider>
    <DesktopInner />
  </WindowProvider>
);

export default Desktop;