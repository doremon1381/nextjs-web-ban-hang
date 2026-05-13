import type { Metadata } from 'next';
import { getProducts } from '@/lib/data/products';
import { ProductCard } from '@/components/ProductCard';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: 'Nhãn Lồng Tươi',
  description: 'Nhãn lồng tươi Hưng Yên, Bắc Giang - cùi dày, ngọt thanh, hạt nhỏ. Thu hoạch trong ngày, giao hàng toàn quốc.',
  openGraph: {
    title: 'Nhãn Lồng Tươi | Nhãn Việt',
    description: 'Nhãn lồng tươi Hưng Yên, Bắc Giang - cùi dày, ngọt thanh, hạt nhỏ. Thu hoạch trong ngày, giao hàng toàn quốc.',
    images: [{ url: '/images/products/longan-fresh-2.jpg', width: 1200, height: 800, alt: 'Nhãn lồng tươi từ vườn' }],
  },
};

export default function NhanTuoiPage() {
  const products = getProducts({ category: 'fresh' });

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Trang chủ', href: '/' },
        { name: 'Nhãn lồng tươi', href: '/san-pham/nhan-tuoi' },
      ]} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-br from-[#DFF5E1] to-[#FFF8E7] py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl text-[#1F5E3B] mb-4">Nhãn lồng tươi từ vườn</h1>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              Thu hoạch trong ngày tại vườn nhãn Hưng Yên và Bắc Giang.
              Đảm bảo tươi ngon, cùi dày, ngọt thanh tự nhiên.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
