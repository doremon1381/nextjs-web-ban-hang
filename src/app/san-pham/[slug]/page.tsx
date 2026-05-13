import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getAllProductSlugs, getProducts, CATEGORY_LABELS } from '@/lib/data/products';
import { ProductDetailPage } from '@/components/ProductDetailPage';
import { ProductJsonLd } from '@/components/seo/ProductJsonLd';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

interface Props {
  params: { slug: string };
}

const CATEGORY_HREF: Record<string, string> = {
  fresh: '/san-pham/nhan-tuoi',
  dried: '/san-pham/nhan-say',
  combo: '/san-pham/nhan-tuoi',
};

export async function generateStaticParams() {
  return getAllProductSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const relatedProducts = getProducts({ category: product.category }).filter(
    p => p.id !== product.id
  );

  const breadcrumbs = [
    { name: 'Trang chủ', href: '/' },
    { name: CATEGORY_LABELS[product.category], href: CATEGORY_HREF[product.category] ?? '/san-pham/nhan-tuoi' },
    { name: product.name, href: `/san-pham/${product.slug}` },
  ];

  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ProductDetailPage product={product} relatedProducts={relatedProducts} />
    </>
  );
}
