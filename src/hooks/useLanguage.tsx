// src/hooks/useLanguage.tsx  
import React, { createContext, useContext, useEffect } from 'react';
import type { Language } from '../types/language';
import { isLanguage } from '../types/language';
import { translations } from '../utils/translations';
import type { Translations } from '../utils/translations';
import { useLocalStorage } from './useLocalStorage';

// Contexto para gerenciar o idioma da aplicação.
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  // Textos fixos da interface no idioma atual. 
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// Provedor de contexto que encapsula a aplicação e fornece o idioma atual, função para alterar o idioma e textos fixos traduzidos.
// Os textos que vêm do banco (projetos, comunidades, etc.) são lidos com getLocalizedField, pelas colunas _pt / _en / _es.
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // O valor salvo é validado: se não for estritamente 'pt', 'en' ou 'es' (ex.: editado à mão), volta para 'pt'.
  const [language, setLanguage] = useLocalStorage<Language>('portfolio:language', 'pt', isLanguage);

  // Mantém o título da aba e o atributo lang do <html> no idioma atual (o index.html traz apenas o padrão em português).
  useEffect(() => {
    document.title = translations[language].shell.documentTitle;
    document.documentElement.lang = translations[language].locale;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage deve ser usado dentro de um LanguageProvider');
  return context;
};
