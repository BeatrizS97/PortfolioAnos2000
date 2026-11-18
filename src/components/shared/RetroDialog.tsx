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
  // Opcional: texto do botão secundário (ex.: "Não"). Sem ele, o diálogo tem só o botão principal.
  cancelLabel?: string;
  // Opcional: chamado quando o usuário clica no botão secundário.
  onCancel?: () => void;
  // Opcional: versão estreita do diálogo (300px, a mesma largura do modal de depoimento enviado). Sem ele, usa a largura padrão.
  compact?: boolean;
  // Conteúdo da mensagem.
  children: React.ReactNode;
}

/**
 * Caixa de mensagem no estilo Windows dos anos 2000: fundo cinza, barra de título azul, botão "×" e um botão principal.
 * Fecha clicando no botão ou no "×". Não fecha com Escape nem clicando fora.
 * É renderizada direto no document.body (portal), mantém o foco no botão e devolve o foco ao elemento anterior ao fechar.
 */
const RetroDialog: React.FC<RetroDialogProps> = ({
  title,
  buttonLabel,
  onConfirm,
  onClose,
  cancelLabel,
  onCancel,
  compact = false,
  children,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
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

  // O Tab circula entre os botões do diálogo (o "×", o principal e, se existir, o secundário), para o foco não sair dele.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const buttons = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('button'));
      const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
      const step = e.shiftKey ? -1 : 1;
      buttons[(current + step + buttons.length) % buttons.length]?.focus();
    }
  };

  return createPortal(
    <div className="modal-overlay" role="alertdialog" aria-modal="true" aria-labelledby={titleId}>
      <div className={`retro-dialog ${compact ? 'retro-dialog--compact' : ''}`} onKeyDown={handleKeyDown}>
        <div className="retro-dialog-titlebar">
          <span id={titleId}>{title}</span>
          <button
            type="button"
            className="win-btn win-btn--close"
            aria-label={t.shell.windowControls.close}
            onClick={onClose}
          />
        </div>
        <div className="retro-dialog-body">{children}</div>
        <div className="retro-dialog-footer">
          <button type="button" className="retro-dialog-button" ref={buttonRef} onClick={onConfirm}>
            {buttonLabel}
          </button>
          {cancelLabel && (
            <button type="button" className="retro-dialog-button" onClick={onCancel}>
              {cancelLabel}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RetroDialog;