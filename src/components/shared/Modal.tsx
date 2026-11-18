// src/components/shared/Modal.tsx

import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useModalBehavior } from '../../hooks/useModalBehavior';

// Props do componente Modal. 
interface ModalProps {
  // Título exibido no cabeçalho e usado como nome acessível do diálogo. 
  title: string;
  // Chamado ao clicar no "×" ou ao apertar Escape. 
  onClose: () => void;
  // Texto acessível do botão de fechar. Se omitido, usa "Fechar"/"Close"/"Cerrar" conforme o idioma atual. 
  closeLabel?: string;
  // Conteúdo do modal. 
  children: React.ReactNode;
}

/**
 * Janela modal acessível: é renderizada direto no document.body (portal), fecha com Escape,
 * mantém o foco do teclado preso dentro dela e devolve o foco ao elemento anterior ao fechar.
 * (O comportamento de teclado fica no hook useModalBehavior, que o TestimonialForm também usa.)
 */
const Modal: React.FC<ModalProps> = ({ title, onClose, closeLabel, children }) => {
  const { t } = useLanguage();
  const boxRef = useRef<HTMLDivElement>(null);

  useModalBehavior(boxRef, onClose);

  return createPortal(
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-box" ref={boxRef} tabIndex={-1}>
        <div className="modal-header">
          <span>{title}</span>
          <button aria-label={closeLabel ?? t.shell.windowControls.close} onClick={onClose}>×</button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
