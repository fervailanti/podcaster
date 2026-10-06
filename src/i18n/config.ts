export const languageOptions = [
  { value: 'es', label: 'ES' },
  { value: 'en', label: 'EN' }
] as const;

export type Locale = (typeof languageOptions)[number]['value'];

export const defaultLanguage: Locale = 'en';

export const LOCALE_COOKIE_NAME = 'podcaster-locale';

export const supportedLanguages = languageOptions.map(({ value }) => value);

export const isLocale = (value: string | undefined): value is Locale =>
  languageOptions.some((option) => option.value === value);
