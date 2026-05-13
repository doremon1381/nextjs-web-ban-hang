import type { Product } from '@/lib/data/products';

export function ProductJsonLd({ product }: { product: Product }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nhanviet.vn';
  const lowestPrice = product.variants?.length
    ? Math.min(...product.variants.map(v => v.price))
    : product.price;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.[0] ?? product.image,
    url: `${base}/san-pham/${product.slug}`,
    brand: {
      '@type': 'Brand',
      name: 'Nhãn Việt',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'VND',
      price: lowestPrice,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Nhãn Việt',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      bestRating: 5,
      worstRating: 1,
      reviewCount: product.rating * 11,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
