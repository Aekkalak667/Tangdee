'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, t } from '@/lib/dictionary';

interface LanguageContextType {
  language: Locale;
  setLanguage: (lang: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Locale>('th');

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Locale;
    if (savedLang && (savedLang === 'th' || savedLang === 'en')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Locale) => {
    setLanguageState(lang);
    localStorage.setItem('lang', lang);
  };

  const translate = (key: string) => t(key, language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
