import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/api';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/generate', '/api/', '/s/']
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
