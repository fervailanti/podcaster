import type { Metadata } from 'next';

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://podcaster-top.vercel.app'
);

export const siteMetadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: 'Podcaster',
  title: {
    default: 'Podcaster',
    template: '%s'
  },
  keywords: ['podcasts', 'music podcasts', 'Apple Podcasts', 'music'],
  authors: [{ name: 'Fernando Vailanti' }],
  creator: 'Fernando Vailanti',
  publisher: 'Fernando Vailanti',
  openGraph: {
    siteName: 'Podcaster',
    type: 'website'
  },
  twitter: {
    card: 'summary'
  },
  robots: {
    index: true,
    follow: true
  }
};
