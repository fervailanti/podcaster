'use client';

import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { useState, type ReactNode } from 'react';
import { resources, type Locale } from './resources';

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const [i18n] = useState(() => {
    const instance = createInstance();
    void instance.use(initReactI18next).init({
      resources,
      lng: locale,
      fallbackLng: 'es',
      supportedLngs: ['es', 'en'],
      interpolation: { escapeValue: false },
      initAsync: false,
    });
    return instance;
  });

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
