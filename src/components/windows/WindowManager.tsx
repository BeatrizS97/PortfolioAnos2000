// src/components/windows/WindowManager.tsx
import React from 'react';
import { useWindowManager } from '../../hooks/useWindowManager';
import { useLanguage } from '../../hooks/useLanguage';
import Window from './Window';

const WindowManager: React.FC = () => {
  const { windows, activeWindowId, closeWindow, minimizeWindow, focusWindow } = useWindowManager();
  const { t } = useLanguage();
  // Calcula o zIndex da janela ativa (a que está no topo) para determinar qual janela deve receber foco visual.
  // (Agora o useWindowManager já entrega o activeWindowId pronto, sem precisar calcular a cada render.)

  return (
    <>
      {windows.map((win) => (
        <Window
          key={win.id}
          win={win}
          // O título da barra da janela vem do idioma atual.
          title={t.shell.windowTitles[win.type]}
          isActive={win.id === activeWindowId}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onFocus={focusWindow}
        />
      ))}
    </>
  );
};

// React.memo: sem props, ele só re-renderiza quando as janelas ou o idioma mudam (e não a cada mudança de estado do Desktop, como selecionar um ícone).
export default React.memo(WindowManager);