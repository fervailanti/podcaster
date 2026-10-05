import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { NavigationProvider } from '@/components/layout/NavigationProvider';
import { I18nProvider } from '@/i18n/I18nProvider';
import { isLocale } from '@/i18n/locales';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Podcaster — Music podcasts',
  description:
    'Discover the most popular music podcasts and listen to episodes.',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const localeCookie = (await cookies()).get('podcaster-locale')?.value;
  const locale = isLocale(localeCookie) ? localeCookie : 'es';

  return (
    <html lang={locale}>
      <body>
        <I18nProvider locale={locale}>
          <NavigationProvider>
            <Header />
            {children}
          </NavigationProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
