// src/hooks/useLanguage.tsx  
import React, { createContext, useContext } from 'react';
import type { Language } from '../types/language';
import { translations } from '../utils/translations';
import type { Translations } from '../utils/translations';
import { translateContent } from '../utils/contentTranslations';
import { useLocalStorage } from './useLocalStorage';

// Contexto para gerenciar o idioma da aplicação.
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  // Textos fixos da interface no idioma atual. 
  t: Translations;
  // Traduz textos que vêm do banco (projetos, comunidades, etc.).
  tc: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// Provedor de contexto que encapsula a aplicação e fornece o idioma atual, função para alterar o idioma, textos fixos traduzidos e função para traduzir conteúdos dinâmicos.
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language>('portfolio:language', 'pt');

  const tc = (text: string) => translateContent(text, language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language], tc }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage deve ser usado dentro de um LanguageProvider');
  return context;
};
