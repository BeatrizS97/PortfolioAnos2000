// src/hooks/useModalBehavior.ts
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { FOCUSABLE_SELECTOR } from '../utils/constants';

/**
 * Comportamento de teclado de uma janela modal (usado pelo Modal e pelo TestimonialForm): fecha com Escape,
 * mantém o foco do teclado preso dentro da caixa e devolve o foco ao elemento anterior ao fechar.
 * @param boxRef Referência da caixa do modal (o elemento dentro do qual o foco fica preso).
 * @param onClose Chamado ao apertar Escape.
 * @param initialFocusRef Opcional: elemento que recebe o foco ao abrir. Sem ele, o foco vai para o primeiro elemento interativo.
 */
export function useModalBehavior(
  boxRef: RefObject<HTMLElement>,
  onClose: () => void,
  initialFocusRef?: RefObject<HTMLElement>
): void {
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

    // Foco inicial: o elemento pedido; senão o primeiro elemento interativo do conteúdo; senão o primeiro da caixa; senão a própria caixa.
    const firstInContent = box.querySelector('.modal-content')?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (initialFocusRef?.current ?? firstInContent ?? getFocusable()[0] ?? box).focus();

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
    // boxRef e initialFocusRef são refs (a identidade delas não muda): o efeito roda só na abertura e no fechamento do modal.
  }, [boxRef, initialFocusRef]);
}
