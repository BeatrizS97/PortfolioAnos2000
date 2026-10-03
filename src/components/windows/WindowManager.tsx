// src/components/windows/WindowManager.tsx
import React from 'react';
import { useWindowManager } from '../../hooks/useWindowManager';
import Window from './Window';

const WindowManager: React.FC = () => {
  const { windows, closeWindow, minimizeWindow, focusWindow } = useWindowManager();
  // Calcula o zIndex da janela ativa (a que está no topo) para determinar qual janela deve receber foco visual.
  const topZIndex = windows
    .filter((w) => !w.minimized)
    .reduce((max, w) => Math.max(max, w.zIndex), 0);

  return (
    <>
      {windows.map((win) => (
        <Window
          key={win.id}
          win={win}
          isActive={win.zIndex === topZIndex}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onFocus={focusWindow}
        />
      ))}
    </>
  );
};

export default WindowManager;