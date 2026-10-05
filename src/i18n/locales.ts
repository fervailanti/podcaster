export type Locale = 'es' | 'en';

export const isLocale = (value: string | undefined): value is Locale =>
  value === 'es' || value === 'en';
