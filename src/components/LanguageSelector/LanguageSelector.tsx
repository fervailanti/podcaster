'use client';

import { useTranslation } from 'react-i18next';

import { defaultLanguage, isLocale, languageOptions, LOCALE_COOKIE_NAME } from '@/i18n';

import { Selector } from '../Selector/Selector';

export const LanguageSelector = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (value: string) => {
    if (!isLocale(value)) return;
    void i18n.changeLanguage(value);
    document.cookie = `${LOCALE_COOKIE_NAME}=${value}; Path=/; Max-Age=31536000; SameSite=Lax`;
    document.documentElement.lang = value;
  };

  return (
    <Selector
      label={t('language')}
      value={i18n.resolvedLanguage ?? defaultLanguage}
      options={languageOptions}
      onChange={changeLanguage}
      icon="🌐"
    />
  );
};
