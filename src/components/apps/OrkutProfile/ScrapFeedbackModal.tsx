// src/components/apps/OrkutProfile/ScrapFeedbackModal.tsx
import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../../hooks/useLanguage';
import { useModalBehavior } from '../../../hooks/useModalBehavior';

interface ScrapFeedbackModalProps {
  // 'success' mostra o ícone verde (✓); 'error' mostra o ícone vermelho (!).
  type: 'success' | 'error';
  // Texto do resultado, já no idioma atual.
  message: string;
  // Chamado ao clicar em "Fechar", no "×" ou ao apertar Escape.
  onClose: () => void;
}

// Modal de resultado do envio de um recado (publicado com sucesso ou erro).
// Usa o mesmo visual do modal "Depoimento enviado" (classes orkut-compose-* do orkut-theme.css).
// O comportamento de teclado (Escape, foco preso e devolução do foco) fica no hook useModalBehavior, o mesmo do TestimonialForm.
const ScrapFeedbackModal: React.FC<ScrapFeedbackModalProps> = ({ type, message, onClose }) => {
  const { t } = useLanguage();
  const boxRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useModalBehavior(boxRef, onClose, closeButtonRef);

  const isError = type === 'error';

  return createPortal(
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={t.scraps.feedbackTitle}>
      <div ref={boxRef} tabIndex={-1} className="orkut-compose-box orkut-compose-box--sent">
        <div className="orkut-compose-header">
          <span className="orkut-compose-title">{t.scraps.feedbackTitle}</span>
          <button type="button" className="orkut-compose-close" onClick={onClose} aria-label={t.shell.windowControls.close}>×</button>
        </div>

        <div className="orkut-compose-body orkut-compose-body--sent">
          <span className={`orkut-sent-icon ${isError ? 'orkut-sent-icon--error' : ''}`} aria-hidden="true">
            {isError ? '!' : '✓'}
          </span>
          <p role={isError ? 'alert' : 'status'}>{message}</p>
        </div>

        <div className="orkut-compose-footer orkut-compose-footer--sent">
          <button type="button" className="orkut-post-btn" ref={closeButtonRef} onClick={onClose}>
            {t.scraps.closeButton}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ScrapFeedbackModal;