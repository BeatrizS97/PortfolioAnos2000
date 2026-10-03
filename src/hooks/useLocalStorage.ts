// src/hooks/useLocalStorage.ts
import { useCallback, useState } from 'react';

// Persiste um valor no localStorage, sincronizado com o estado do React. 
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Função para atualizar o valor tanto no estado do React quanto no localStorage.
  const setPersistedValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Armazenamento indisponível (modo privado, quota excedida, etc.) — ignora silenciosamente.
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, setPersistedValue] as const;
}
