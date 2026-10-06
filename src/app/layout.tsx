import '@/styles/globals.css';

import type { ReactNode } from 'react';

import { QueryProvider } from '@/api/tanstack/QueryProvider';
import { Header } from '@/components';
import { I18nProvider } from '@/i18n/I18nProvider';
import { getLocale } from '@/i18n/server';
import { NavigationProvider } from '@/navigation';

import { siteMetadata } from './site';

export const metadata = siteMetadata;

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body>
        <I18nProvider locale={locale}>
          <QueryProvider>
            <NavigationProvider>
              <Header />
              {children}
            </NavigationProvider>
          </QueryProvider>
        </I18nProvider>
      </body>
    </html>
  );
};

export default RootLayout;
