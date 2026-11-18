// src/hooks/useInsertAtCursor.ts
import { useCallback } from 'react';
import type { Dispatch, RefObject, SetStateAction } from 'react';

/**
 * Devolve uma função que insere um texto na posição do cursor de um <textarea>, mantendo o foco e deixando o cursor logo depois do texto.
 * É usada pelo chat do MSN (emoticons e presente) e pelo formulário de depoimento (emoji).
 * @param textareaRef Referência do <textarea>.
 * @param setValue Setter do estado que guarda o texto do campo.
 */
export function useInsertAtCursor(
  textareaRef: RefObject<HTMLTextAreaElement>,
  setValue: Dispatch<SetStateAction<string>>
): (text: string) => void {
  return useCallback(
    (text: string) => {
      const el = textareaRef.current;
      // Sem o campo na tela, só acrescenta o texto no fim.
      if (!el) {
        setValue((prev) => prev + text);
        return;
      }

      const { selectionStart, selectionEnd, value } = el;
      setValue(value.slice(0, selectionStart) + text + value.slice(selectionEnd));

      // Calcula a nova posição do cursor após a inserção do texto e mantém o foco no campo.
      const cursor = selectionStart + text.length;
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(cursor, cursor);
      });
    },
    [textareaRef, setValue]
  );
}
