// src/components/desktop/Desktop.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { WindowProvider, useWindowManager } from '../../hooks/useWindowManager';
import WindowManager from '../windows/WindowManager';
import Taskbar from './Taskbar';
import DesktopIcon from './DesktopIcon';
import NotificationPopup from '../apps/MSNMessenger/NotificationPopup';
import { MSN_POPUP_DELAY_MS } from '../../utils/constants';
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

const DesktopInner: React.FC = () => {
  const { windows, openWindow, focusWindow, minimizeWindow } = useWindowManager();
  const { t } = useLanguage();
  const msnTriggered = useRef(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [showMsnNotification, setShowMsnNotification] = useState(false);
  const activeWindowId = useMemo(() => {
    const visible = windows.filter((w) => !w.minimized);
    if (visible.length === 0) return null;
    return visible.reduce((top, w) => (w.zIndex > top.zIndex ? w : top)).id;
  }, [windows]);

  useEffect(() => {
    const orkutOpen = windows.some((w) => w.type === 'orkut');
    const msnOpen = windows.some((w) => w.type === 'msn');

    if (orkutOpen && !msnOpen && !msnTriggered.current) {
      msnTriggered.current = true;
      const timer = window.setTimeout(() => setShowMsnNotification(true), MSN_POPUP_DELAY_MS);
      return () => window.clearTimeout(timer);
    }

    if (!orkutOpen) {
      msnTriggered.current = false;
    }
    if (msnOpen) {
      setShowMsnNotification(false);
    }
  }, [windows, openWindow]);

  const icons: DesktopIconConfig[] = [
    { id: 'orkut', iconSrc: '/assets/images/orkut-icon.png', label: 'Orkut', onOpen: () => openWindow('orkut'), imageZoom: 1.6 },
    { id: 'msn', iconSrc: '/assets/images/msn-icon.png', label: 'MSN Messenger', onOpen: () => openWindow('msn') },
    { id: 'trash', iconSrc: '/assets/images/icons/trash.png', label: 'Lixeira', onOpen: () => {}, disabled: true },
  ];

  return (
    <div className="desktop-container" onClick={() => setSelectedIcon(null)}>
      <div className="desktop-icons">
        {icons.map((item) => {
          const zoom = item.imageZoom ?? 1;
          const zoomedSize = ICON_SIZE * zoom;

          return (
            <DesktopIcon
              key={item.id}
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