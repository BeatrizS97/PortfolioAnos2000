// src/components/windows/windowComponents.tsx
import React, { lazy } from 'react';
import type { WindowType } from '../../types/window';
import { useLanguage } from '../../hooks/useLanguage';
import { formatChatText } from '../../utils/formatChatText';

// Componente de uma janela: comum ou carregado sob demanda (lazy).
type WindowComponent = React.ComponentType | React.LazyExoticComponent<React.ComponentType>;

const OrkutProfile = lazy(() => import('../apps/OrkutProfile/OrkutProfile'));
const MSNChat = lazy(() => import('../apps/MSNMessenger/MSNChat'));

// Os textos de "Sobre mim" e da lixeira ficam em translations.ts (t.shell.about / t.shell.trash), então mudam com o idioma.
const About: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="about-content">
      <h2>{t.shell.about.title}</h2>
      <p>{formatChatText(t.shell.about.paragraph1)}</p>
      <p>{formatChatText(t.shell.about.paragraph2)}</p>
    </div>
  );
};

const Trash: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="trash-content">
      <p>{t.shell.trash.message}</p>
    </div>
  );
};

// Mapa de tipo de janela para o componente que ela exibe. Por ser um Record<WindowType, ...>, o TypeScript avisa se um tipo novo ficar sem componente.
export const WINDOW_COMPONENTS: Record<WindowType, WindowComponent> = {
  orkut: OrkutProfile,
  msn: MSNChat,
  about: About,
  trash: Trash,
};