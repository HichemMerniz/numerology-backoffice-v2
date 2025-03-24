import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translationsA } from '../translations';

type Language = 'en' | 'fr';

type TranslationParams = {
  fallback?: string;
  [key: string]: string | number | undefined;
};

type TranslationKey = keyof typeof translationsA.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: TranslationParams) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: TranslationKey, params?: TranslationParams): string => {
    const translation = translationsA[language][key] || translationsA['en'][key] || params?.fallback || key;
    
    if (params) {
      return Object.entries(params).reduce(
        (str, [key, value]) => str.replace(`{${key}}`, String(value)),
        translation
      );
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 