import type { MetadataRoute } from 'next';

import { siteUrl } from './site';

const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: '*', allow: '/' },
  sitemap: new URL('/sitemap.xml', siteUrl).toString()
});

export default robots;
