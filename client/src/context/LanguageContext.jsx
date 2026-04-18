import React, { createContext, useContext, useState, useCallback } from 'react';
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import hinglish from '../locales/hinglish.json';

const translations = { en, hi, hinglish };

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem('sahayak_lang') || 'en'
  );

  const changeLanguage = useCallback((lang) => {
    setLanguage(lang);
    localStorage.setItem('sahayak_lang', lang);
  }, []);

  // t('nav.login') or t('tracker.title')
  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    // Fallback: try English
    if (value === undefined) {
      value = translations.en;
      for (const k of keys) {
        value = value?.[k];
      }
    }
    return value ?? key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};
