// src/hooks/useAdminKey.ts
import { useLocalStorage } from './useLocalStorage';

// Hook para gerenciar a chave de administrador usando localStorage.
export function useAdminKey() {
  const [adminKey, setAdminKey] = useLocalStorage<string | null>('portfolio:adminKey', null);

  const login = (promptText: string) => {
    const key = window.prompt(promptText);
    if (key && key.trim()) {
      setAdminKey(key.trim());
    }
  };

  const logout = () => setAdminKey(null);

  return { adminKey, isAdmin: Boolean(adminKey), login, logout };
}