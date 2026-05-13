import type { Metadata } from 'next';
import { getProducts } from '@/lib/data/products';
import { ProductCard } from '@/components/ProductCard';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: 'Nhãn Sấy Dẻo',
  description: 'Nhãn sấy dẻo thơm tự nhiên, không chất bảo quản. Phù hợp ăn gia đình và làm quà biếu.',
  openGraph: {
    title: 'Nhãn Sấy Dẻo | Nhãn Việt',
    description: 'Nhãn sấy dẻo thơm tự nhiên, không chất bảo quản. Phù hợp ăn gia đình và làm quà biếu.',
    images: [{ url: '/images/products/longan-dried-1.jpg', width: 1200, height: 800, alt: 'Nhãn sấy dẻo tự nhiên' }],
  },
};

export default function NhanSayPage() {
  const products = getProducts({ category: 'dried' });

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Trang chủ', href: '/' },
        { name: 'Nhãn sấy dẻo', href: '/san-pham/nhan-say' },
      ]} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-br from-[#FFF8E7] to-[#DFF5E1] py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl text-[#1F5E3B] mb-4">Nhãn sấy dẻo thơm</h1>
            <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
              Sấy tự nhiên, giữ nguyên vị ngọt thanh và hương thơm đặc trưng.
              Không chất bảo quản, an toàn cho sức khỏe.
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
