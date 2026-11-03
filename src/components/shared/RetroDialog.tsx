// src/components/shared/RetroDialog.tsx

import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../hooks/useLanguage';
import '../../styles/retro-dialog.css';

// Props do componente RetroDialog.
interface RetroDialogProps {
  // Texto da barra de título (e nome acessível do diálogo).
  title: string;
  // Texto do botão principal (ex.: "Entendi").
  buttonLabel: string;
  // Chamado quando o usuário clica no botão principal.
  onConfirm: () => void;
  // Chamado quando o usuário clica no "×" da barra de título.
  onClose: () => void;
  // Conteúdo da mensagem.
  children: React.ReactNode;
}

/**
 * Caixa de mensagem no estilo Windows dos anos 2000: fundo cinza, barra de título azul, botão "×" e um botão principal.
 * Fecha clicando no botão ou no "×". Não fecha com Escape nem clicando fora.
 * É renderizada direto no document.body (portal), mantém o foco no botão e devolve o foco ao elemento anterior ao fechar.
 */
const RetroDialog: React.FC<RetroDialogProps> = ({ title, buttonLabel, onConfirm, onClose, children }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const { t } = useLanguage();

  useEffect(() => {
    // Guarda quem tinha o foco para devolvê-lo quando o diálogo fechar.
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    buttonRef.current?.focus();

    return () => {
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, []);

  // Só existem dois elementos focáveis (o "×" e o botão): o Tab alterna entre eles, para o foco não sair do diálogo.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const next = document.activeElement === buttonRef.current ? closeRef.current : buttonRef.current;
      next?.focus();
    }
  };

  return createPortal(
    <div className="modal-overlay" role="alertdialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="retro-dialog" onKeyDown={handleKeyDown}>
        <div className="retro-dialog-titlebar">
          <span id={titleId}>{title}</span>
          <button
            type="button"
            className="win-btn win-btn--close"
            ref={closeRef}
            aria-label={t.shell.windowControls.close}
            onClick={onClose}
          />
        </div>
        <div className="retro-dialog-body">{children}</div>
        <div className="retro-dialog-footer">
          <button type="button" className="retro-dialog-button" ref={buttonRef} onClick={onConfirm}>
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RetroDialog;