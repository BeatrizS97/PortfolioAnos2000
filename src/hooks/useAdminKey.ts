// src/hooks/useAdminKey.ts
import { useState } from 'react';

// Hook para gerenciar a chave de administrador usando localStorage.
const STORAGE_KEY = 'portfolio:adminKey';

// Lê a chave salva na aba atual e apaga qualquer cópia antiga que tenha ficado no localStorage.
function readStoredKey(): string | null {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage indisponível — nada a limpar.
  }
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function useAdminKey() {
  const [adminKey, setAdminKey] = useState<string | null>(readStoredKey);
  // Controla se o modal de pedir a chave está aberto.
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Atualiza o estado do React e o sessionStorage ao mesmo tempo.
  const saveKey = (key: string | null) => {
    setAdminKey(key);
    try {
      if (key) {
        window.sessionStorage.setItem(STORAGE_KEY, key);
      } else {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // sessionStorage indisponível (modo privado, etc.) — a chave vale só enquanto o estado existir.
    }
  };

  const openLogin = () => setIsLoginOpen(true);

  const closeLogin = () => setIsLoginOpen(false);

  // Recebe a chave digitada no modal. Devolve false (e mantém o modal aberto) se a chave estiver vazia.
  const submitKey = (key: string): boolean => {
    const trimmed = key.trim();
    if (!trimmed) return false;
    saveKey(trimmed);
    setIsLoginOpen(false);
    return true;
  };

  const logout = () => saveKey(null);

  return { adminKey, isAdmin: Boolean(adminKey), isLoginOpen, openLogin, closeLogin, submitKey, logout };
}