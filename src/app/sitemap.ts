import type { MetadataRoute } from 'next';
import { products } from '@/lib/data/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nhanviet.vn';
  const now = new Date();

  const staticRoutes = [
    { url: base, priority: 1.0 },
    { url: `${base}/san-pham/nhan-tuoi`, priority: 0.8 },
    { url: `${base}/san-pham/nhan-say`, priority: 0.8 },
    { url: `${base}/lien-he`, priority: 0.6 },
  ];

  return [
    ...staticRoutes.map(r => ({ url: r.url, lastModified: now, priority: r.priority })),
    ...products.map(p => ({
      url: `${base}/san-pham/${p.slug}`,
      lastModified: now,
      priority: 0.7,
    })),
  ];
}
