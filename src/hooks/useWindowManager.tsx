// src/hooks/useWindowManager.tsx
import React, { createContext, useCallback, useContext, useState } from 'react';
import type { AppWindow, WindowType } from '../types/window';
import { DEFAULT_WINDOW_SIZE, WINDOW_TITLES, TASKBAR_HEIGHT_PX } from '../utils/constants';

interface WindowContextType {
  windows: AppWindow[];
  openWindow: (type: WindowType) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
}

const WindowContext = createContext<WindowContextType | null>(null);

// Gerencia o estado das janelas abertas, incluindo abertura, fechamento, minimização e foco.
let cascadeOffset = 0;

const MAXIMIZED_BY_DEFAULT: WindowType[] = ['orkut'];

// Retorna a geometria de uma janela maximizada, ocupando toda a área da tela, exceto a altura da barra de tarefas.
function getMaximizedGeometry() {
  return {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight - TASKBAR_HEIGHT_PX,
  };
}

// Provedor de contexto que encapsula a aplicação e fornece o estado das janelas abertas, bem como funções para abrir, fechar, minimizar e focar janelas.
export const WindowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(100);

  const openWindow = useCallback((type: WindowType) => {
    setWindows((prev) => {
      // Se já existe uma janela minimizada deste tipo, apenas restaura em vez de duplicar.
      const existing = prev.find((w) => w.type === type && w.minimized);
      if (existing) {
        return prev.map((w) => (w.id === existing.id ? { ...w, minimized: false } : w));
      }

      const id = `${type}-${Date.now()}`;
      const isMaximized = MAXIMIZED_BY_DEFAULT.includes(type);

      let geometry: { x: number; y: number; width: number; height: number };
      if (isMaximized) {
        geometry = getMaximizedGeometry();
      } else {
        const size = DEFAULT_WINDOW_SIZE[type] ?? { width: 480, height: 360 };
        cascadeOffset = (cascadeOffset + 1) % 6;
        geometry = {
          x: 80 + cascadeOffset * 30,
          y: 60 + cascadeOffset * 30,
          width: size.width,
          height: size.height,
        };
      }

      const newWindow: AppWindow = {
        id,
        type,
        title: WINDOW_TITLES[type] ?? type,
        zIndex: maxZIndex + 1,
        minimized: false,
        maximized: isMaximized,
        ...geometry,
      };
      return [...prev, newWindow];
    });
    setMaxZIndex((prev) => prev + 1);
  }, [maxZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  }, []);

  const focusWindow = useCallback(
    (id: string) => {
      setMaxZIndex((prev) => prev + 1);
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, zIndex: maxZIndex + 1, minimized: false } : w))
      );
    },
    [maxZIndex]
  );

  return (
    <WindowContext.Provider value={{ windows, openWindow, closeWindow, minimizeWindow, focusWindow }}>
      {children}
    </WindowContext.Provider>
  );
};

export const useWindowManager = (): WindowContextType => {
  const context = useContext(WindowContext);
  if (!context) throw new Error('useWindowManager deve ser usado dentro de um WindowProvider');
  return context;
};
