'use client';

import { createInstance } from 'i18next';
import { type ReactNode, useState } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import { defaultLanguage, type Locale, supportedLanguages } from './config';
import en from './translations/en.json';
import es from './translations/es.json';

const resources = {
  es: { translation: es },
  en: { translation: en }
} satisfies Record<Locale, { translation: typeof es }>;

export const I18nProvider = ({ locale, children }: { locale: Locale; children: ReactNode }) => {
  const [i18n] = useState(() => {
    const instance = createInstance();
    void instance.use(initReactI18next).init({
      resources,
      lng: locale,
      fallbackLng: defaultLanguage,
      supportedLngs: supportedLanguages,
      interpolation: { escapeValue: false },
      initAsync: false
    });
    return instance;
  });

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
