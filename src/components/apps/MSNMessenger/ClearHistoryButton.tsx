// src/components/apps/MSNMessenger/ClearHistoryButton.tsx
import React, { useState } from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import RetroDialog from '../../shared/RetroDialog';

interface ClearHistoryButtonProps {
  // Chamado depois que a pessoa confirma que quer apagar o histórico.
  onClear: () => void;
  // Desabilita o botão (ex.: conversa vazia ou resposta a caminho).
  disabled?: boolean;
}

// Lixeirinha no mesmo tamanho e traço dos outros ícones pequenos da faixa de formatação.
const TrashMiniIcon: React.FC = () => (
  <svg width={13} height={13} viewBox="0 0 20 20" aria-hidden="true">
    <rect x="3" y="4" width="14" height="2.4" rx="0.8" fill="#c9c9c9" stroke="#6f6f6f" strokeWidth="0.9" />
    <rect x="8" y="2" width="4" height="2.2" rx="0.8" fill="#c9c9c9" stroke="#6f6f6f" strokeWidth="0.9" />
    <path d="M4.6 6.4h10.8l-.9 11a1.2 1.2 0 0 1-1.2 1.1H6.7a1.2 1.2 0 0 1-1.2-1.1l-.9-11z" fill="#dcdcdc" stroke="#6f6f6f" strokeWidth="0.9" />
    <path d="M8 8.5v7M12 8.5v7" stroke="#6f6f6f" strokeWidth="0.9" strokeLinecap="round" />
  </svg>
);

// Botão "Limpar conversa" do chat do MSN, na faixa de ícones ao lado do "Chamar a atenção".
// Antes de apagar, abre um modal de confirmação no mesmo estilo da tela de boas-vindas.
const ClearHistoryButton: React.FC<ClearHistoryButtonProps> = ({ onClear, disabled = false }) => {
  const { t } = useLanguage();
  const [confirmOpen, setConfirmOpen] = useState(false);
  // Os botões do modal de confirmação vêm de t.dialog (o título e a pergunta vêm de t.msn).

  const handleConfirm = () => {
    setConfirmOpen(false);
    onClear();
  };

  return (
    <>
      <button
        type="button"
        className="msn-compose-tool msn-compose-tool--active"
        onClick={() => setConfirmOpen(true)}
        disabled={disabled}
        aria-label={t.msn.clearHistory}
        title={t.msn.clearHistory}
      >
        <TrashMiniIcon /> <span className="msn-compose-tool-caret" role="presentation">▾</span>
      </button>

      {confirmOpen && (
        <RetroDialog
          title={t.msn.clearHistory}
          buttonLabel={t.dialog.yes}
          onConfirm={handleConfirm}
          onClose={() => setConfirmOpen(false)}
          cancelLabel={t.dialog.no}
          onCancel={() => setConfirmOpen(false)}
        >
          <p>{t.msn.clearHistoryConfirm}</p>
        </RetroDialog>
      )}
    </>
  );
};

export default ClearHistoryButton;