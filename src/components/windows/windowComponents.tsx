// src/components/windows/windowComponents.tsx
import React, { lazy } from 'react';
import type { WindowType } from '../../types/window';

// Componente de uma janela: comum ou carregado sob demanda (lazy).
type WindowComponent = React.ComponentType | React.LazyExoticComponent<React.ComponentType>;

const OrkutProfile = lazy(() => import('../apps/OrkutProfile/OrkutProfile'));
const MSNChat = lazy(() => import('../apps/MSNMessenger/MSNChat'));

// Mapa de tipo de janela para o componente que ela exibe. Por ser um Record<WindowType, ...>, o TypeScript avisa se um tipo novo ficar sem componente.
export const WINDOW_COMPONENTS: Record<WindowType, WindowComponent> = {
  orkut: OrkutProfile,
  msn: MSNChat,
};