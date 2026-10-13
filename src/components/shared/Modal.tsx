// src/components/shared/Modal.tsx

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../hooks/useLanguage';

// Elementos que podem receber foco do teclado.
const FOCUSABLE_SELECTOR =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
 */
const Modal: React.FC<ModalProps> = ({ title, onClose, closeLabel, children }) => {
  const { t } = useLanguage();
  const boxRef = useRef<HTMLDivElement>(null);
  // O onClose fica numa ref para o efeito abaixo rodar só uma vez (mesmo que o pai passe uma função nova a cada render).
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    // Guarda quem tinha o foco para devolvê-lo quando o modal fechar.
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const getFocusable = () => Array.from(box.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    // Foco inicial: primeiro elemento interativo do conteúdo; senão o primeiro da caixa; senão a própria caixa.
    const firstInContent = box.querySelector('.modal-content')?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (firstInContent ?? getFocusable()[0] ?? box).focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;

      // Focus trap: Tab no último volta ao primeiro; Shift+Tab no primeiro vai ao último.
      const focusable = getFocusable();
      if (focusable.length === 0) {
        e.preventDefault();
        box.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!box.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && (active === first || active === box)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, []);

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