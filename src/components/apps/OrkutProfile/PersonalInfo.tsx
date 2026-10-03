// src/components/apps/OrkutProfile/PersonalInfo.tsx
import React from 'react';

const PERSONAL_INFO: { label: string; value: string }[] = [
  { label: 'Relacionamento', value: 'Comprometida com o código 💻' },
  { label: 'Morando em', value: 'Itanhaém, São Paulo' },
  { label: 'Vindo de', value: 'Praia Grande (Fatec)' },
  { label: 'Ocupação', value: 'Desenvolvedora Front-End / Full Stack Jr' },
  { label: 'Formação', value: 'Análise e Desenvolvimento de Sistemas (Fatec), Letras (Unicsul)' },
];

const PersonalInfo: React.FC = () => (
  <dl className="personal-info">
    {PERSONAL_INFO.map((item) => (
      <div key={item.label} className="personal-info-row">
        <dt>{item.label}</dt>
        <dd>{item.value}</dd>
      </div>
    ))}
  </dl>
);

export default PersonalInfo;
