import type { MetadataRoute } from 'next';

import { siteUrl } from './site';

const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: siteUrl.toString(),
    changeFrequency: 'daily',
    priority: 1
  }
];

export default sitemap;
