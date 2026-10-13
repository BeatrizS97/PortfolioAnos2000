// src/hooks/useWindowManager.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import type { AppWindow, WindowType } from '../types/window';
import { DEFAULT_WINDOW_SIZE, WINDOW_TITLES, TASKBAR_HEIGHT_PX } from '../utils/constants';
import { clampWindowPosition, loadWindowGeometry } from '../utils/windowGeometry';

// Contexto de LEITURA: muda quando as janelas mudam.
interface WindowStateContextType {
  windows: AppWindow[];
  // Id da janela ativa (a que está no topo e visível) ou null quando nenhuma está em foco.
  activeWindowId: string | null;
}

// Contexto de AÇÕES: as funções têm identidade estável, então quem usa só isto não re-renderiza quando as janelas mudam.
interface WindowActionsContextType {
  openWindow: (type: WindowType) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  // Tira o foco de todas as janelas (clique no fundo da área de trabalho).
  blurWindows: () => void;
}

// Junção dos dois, para quem precisa de tudo (useWindowManager).
type WindowContextType = WindowStateContextType & WindowActionsContextType;

const WindowStateContext = createContext<WindowStateContextType | null>(null);
const WindowActionsContext = createContext<WindowActionsContextType | null>(null);

// Estado único: lista de janelas, maior zIndex já usado e a janela ativa.
interface WindowState {
  windows: AppWindow[];
  maxZIndex: number;
  activeWindowId: string | null;
}

type WindowAction =
  | { type: 'open'; window: Omit<AppWindow, 'zIndex'> }
  | { type: 'focus'; id: string }
  | { type: 'minimize'; id: string }
  | { type: 'close'; id: string }
  | { type: 'blur' };

const initialState: WindowState = { windows: [], maxZIndex: 100, activeWindowId: null };

// Procura a janela visível com maior zIndex. Só é usada ao fechar/minimizar a janela ativa.
function getTopVisibleWindowId(windows: AppWindow[]): string | null {
  const visible = windows.filter((w) => !w.minimized);
  if (visible.length === 0) return null;
  return visible.reduce((top, w) => (w.zIndex > top.zIndex ? w : top)).id;
}

// Traz a janela para a frente, restaura se estiver minimizada e a marca como ativa.
function bringToFront(state: WindowState, id: string): WindowState {
  if (!state.windows.some((w) => w.id === id)) return state;
  const zIndex = state.maxZIndex + 1;
  return {
    windows: state.windows.map((w) => (w.id === id ? { ...w, zIndex, minimized: false } : w)),
    maxZIndex: zIndex,
    activeWindowId: id,
  };
}

function windowReducer(state: WindowState, action: WindowAction): WindowState {
  switch (action.type) {
    case 'open': {
      // Se já existe uma janela minimizada deste tipo, apenas restaura em vez de duplicar.
      const existing = state.windows.find((w) => w.type === action.window.type && w.minimized);
      if (existing) return bringToFront(state, existing.id);

      const zIndex = state.maxZIndex + 1;
      return {
        windows: [...state.windows, { ...action.window, zIndex }],
        maxZIndex: zIndex,
        activeWindowId: action.window.id,
      };
    }
    case 'focus':
      return bringToFront(state, action.id);
    case 'minimize': {
      const windows = state.windows.map((w) => (w.id === action.id ? { ...w, minimized: true } : w));
      return {
        ...state,
        windows,
        activeWindowId: state.activeWindowId === action.id ? getTopVisibleWindowId(windows) : state.activeWindowId,
      };
    }
    case 'close': {
      const windows = state.windows.filter((w) => w.id !== action.id);
      return {
        ...state,
        windows,
        activeWindowId: state.activeWindowId === action.id ? getTopVisibleWindowId(windows) : state.activeWindowId,
      };
    }
    case 'blur':
      return state.activeWindowId === null ? state : { ...state, activeWindowId: null };
  }
}

// Gerencia o estado das janelas abertas, incluindo abertura, fechamento, minimização e foco.
// (O deslocamento em cascata das janelas novas, antes uma variável global, agora é um useRef dentro do WindowProvider.)

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
  const [state, dispatch] = useReducer(windowReducer, initialState);
  // Contador do deslocamento em cascata (0 a 5) das janelas novas.
  const cascadeOffset = useRef(0);
  // Cópia sempre atualizada da lista de janelas, para o openWindow consultar sem depender do estado.
  const windowsRef = useRef<AppWindow[]>(state.windows);

  useEffect(() => {
    windowsRef.current = state.windows;
  }, [state.windows]);

  const openWindow = useCallback((type: WindowType) => {
    const id = `${type}-${Date.now()}`;
    const isMaximized = MAXIMIZED_BY_DEFAULT.includes(type);

    let geometry: { x: number; y: number; width: number; height: number };
    if (isMaximized) {
      geometry = getMaximizedGeometry();
    } else {
      const size = DEFAULT_WINDOW_SIZE[type] ?? { width: 480, height: 360 };
      // Reabre na última posição salva, mas só se não houver outra janela do mesmo tipo aberta (senão ficariam empilhadas).
      const alreadyOpen = windowsRef.current.some((w) => w.type === type);
      const saved = alreadyOpen ? null : loadWindowGeometry(type);

      if (saved) {
        geometry = {
          ...clampWindowPosition({ x: saved.x, y: saved.y }, saved.width, saved.height),
          width: saved.width,
          height: saved.height,
        };
      } else {
        cascadeOffset.current = (cascadeOffset.current + 1) % 6;
        geometry = {
          x: 80 + cascadeOffset.current * 30,
          y: 60 + cascadeOffset.current * 30,
          width: size.width,
          height: size.height,
        };
      }
    }

    dispatch({
      type: 'open',
      window: {
        id,
        type,
        title: WINDOW_TITLES[type] ?? type,
        minimized: false,
        maximized: isMaximized,
        ...geometry,
      },
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    dispatch({ type: 'close', id });
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    dispatch({ type: 'minimize', id });
  }, []);

  const focusWindow = useCallback((id: string) => {
    dispatch({ type: 'focus', id });
  }, []);

  const blurWindows = useCallback(() => {
    dispatch({ type: 'blur' });
  }, []);

  // Cada contexto tem o próprio valor memorizado: o de ações nunca muda, o de leitura muda só com o estado.
  const stateValue = useMemo(
    () => ({ windows: state.windows, activeWindowId: state.activeWindowId }),
    [state.windows, state.activeWindowId]
  );
  const actionsValue = useMemo(
    () => ({ openWindow, closeWindow, minimizeWindow, focusWindow, blurWindows }),
    [openWindow, closeWindow, minimizeWindow, focusWindow, blurWindows]
  );

  return (
    <WindowActionsContext.Provider value={actionsValue}>
      <WindowStateContext.Provider value={stateValue}>{children}</WindowStateContext.Provider>
    </WindowActionsContext.Provider>
  );
};

// Lê só o estado (lista de janelas e janela ativa).
export const useWindowState = (): WindowStateContextType => {
  const context = useContext(WindowStateContext);
  if (!context) throw new Error('useWindowState deve ser usado dentro de um WindowProvider');
  return context;
};

// Lê só as ações (abrir, fechar, minimizar, focar). Não re-renderiza quando as janelas mudam.
export const useWindowActions = (): WindowActionsContextType => {
  const context = useContext(WindowActionsContext);
  if (!context) throw new Error('useWindowActions deve ser usado dentro de um WindowProvider');
  return context;
};

// Atalho que devolve estado e ações juntos (mantém compatibilidade com o código existente).
export const useWindowManager = (): WindowContextType => {
  const state = useWindowState();
  const actions = useWindowActions();
  return { ...state, ...actions };
};