// src/components/apps/OrkutProfile/LuckyMessage.tsx
import React, { useMemo } from 'react';
import { useLanguage } from '../../../hooks/useLanguage';

// Função que escolhe uma frase "sorte de hoje" com base no dia do mês, como no Orkut original. 
function pickMessage(messages: string[]): string {
  const index = new Date().getDate() % messages.length;
  return messages[index];
}

const LuckyMessage: React.FC = () => {
  const { t } = useLanguage();
  const message = useMemo(() => pickMessage(t.luckyMessage.messages), [t]);
  return (
    <section className="lucky-message">
      <h4>🍀 {t.luckyMessage.title}</h4>
      <p>{message}</p>
    </section>
  );
};

export default LuckyMessage;
