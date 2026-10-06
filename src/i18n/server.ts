import { cookies } from 'next/headers';

import { defaultLanguage, isLocale, type Locale, LOCALE_COOKIE_NAME } from './config';
import en from './translations/en.json';
import es from './translations/es.json';

const translations = { en, es } satisfies Record<Locale, typeof en>;

type MetadataKey = keyof typeof en.metadata;

const interpolateAppName = (template: string, appName: string) =>
  template.replace('{{appName}}', appName);

export const getLocale = async () => {
  const localeCookie = (await cookies()).get(LOCALE_COOKIE_NAME)?.value;
  return isLocale(localeCookie) ? localeCookie : defaultLanguage;
};

export const getAppMetadata = async (key: MetadataKey) => {
  const locale = await getLocale();
  const metadata = translations[locale].metadata[key];
  const { appName } = translations[locale];

  return {
    title: interpolateAppName(metadata.title, appName),
    description: interpolateAppName(metadata.description, appName)
  };
};
