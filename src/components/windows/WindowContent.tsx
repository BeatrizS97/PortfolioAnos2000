// src/components/windows/WindowContent.tsx
import React, { lazy, Suspense } from 'react';
import type { WindowType } from '../../types/window';

const OrkutProfile = lazy(() => import('../apps/OrkutProfile/OrkutProfile'));
const MSNChat = lazy(() => import('../apps/MSNMessenger/MSNChat'));

interface WindowContentProps {
  type: WindowType;
}

const About: React.FC = () => (
  <div className="about-content">
    <h2>Sobre mim</h2>
    <p>
      Beatriz Silva Santos — Desenvolvedora Full Stack Júnior, formada em
      Análise e Desenvolvimento de Sistemas (FATEC). Atuo com React.js,
      Next.js, TypeScript no front-end e C#/.NET no back-end, com passagem
      também por PHP e SQL.
    </p>
    <p>
      Abra o Orkut para ver o perfil completo (projetos, skills e depoimentos)
      ou espere o MSN chamar. 😉
    </p>
  </div>
);

const Trash: React.FC = () => (
  <div className="trash-content">
    <p>A lixeira está vazia... ou será que não? 👀</p>
  </div>
);

const WindowContent: React.FC<WindowContentProps> = ({ type }) => {
  return (
    <Suspense fallback={<div className="loading-screen">Carregando...</div>}>
      {type === 'orkut' && <OrkutProfile />}
      {type === 'msn' && <MSNChat />}
      {type === 'about' && <About />}
      {type === 'trash' && <Trash />}
    </Suspense>
  );
};

export default WindowContent;