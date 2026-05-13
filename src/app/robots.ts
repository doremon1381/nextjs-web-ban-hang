import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nhanviet.vn';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/tai-khoan/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
