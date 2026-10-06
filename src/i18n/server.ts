import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import { defaultLanguage, isLocale, type Locale, LOCALE_COOKIE_NAME } from './config';
import en from './translations/en.json';
import es from './translations/es.json';

const translations = { en, es } satisfies Record<Locale, typeof en>;

type MetadataKey = keyof typeof en.metadata;
type MetadataValues = Record<string, string | undefined>;

const interpolate = (template: string, values: MetadataValues) =>
  template.replace(/{{(.*?)}}/g, (placeholder, key: string) => values[key] ?? placeholder);

const resolveMetadataCopy = (
  defaultCopy: string,
  dynamicCopy: string | undefined,
  values: MetadataValues
) => {
  const copy = dynamicCopy ? interpolate(dynamicCopy, values) : defaultCopy;

  return copy.includes('{{') ? interpolate(defaultCopy, values) : copy;
};

export const getLocale = async () => {
  const localeCookie = (await cookies()).get(LOCALE_COOKIE_NAME)?.value;
  return isLocale(localeCookie) ? localeCookie : defaultLanguage;
};

export const getAppMetadata = async (
  key: MetadataKey,
  pathname: string,
  values: MetadataValues = {}
): Promise<Metadata> => {
  const locale = await getLocale();
  const metadata = translations[locale].metadata[key];
  const { appName } = translations[locale];
  const interpolationValues = { appName, ...values };
  const dynamicTitle = 'dynamicTitle' in metadata ? metadata.dynamicTitle : undefined;
  const dynamicDescription =
    'dynamicDescription' in metadata ? metadata.dynamicDescription : undefined;
  const title = resolveMetadataCopy(metadata.title, dynamicTitle, interpolationValues);
  const description = resolveMetadataCopy(
    metadata.description,
    dynamicDescription,
    interpolationValues
  );

  return {
    title,
    description,
    alternates: { canonical: pathname },
    openGraph: { title, description, url: pathname },
    twitter: { title, description }
  };
};
