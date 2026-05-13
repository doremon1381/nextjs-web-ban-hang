import Link from 'next/link';
import Image from 'next/image';
import { Leaf, Package, Truck } from 'lucide-react';
import { getProducts } from '@/lib/data/products';
import { ProductCard } from '@/components/ProductCard';

export default function Home() {
  const featuredProducts = getProducts({ featured: true });
  const freshLonganProducts = getProducts({ category: 'fresh' });
  const driedLonganProducts = getProducts({ category: 'dried' });

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#DFF5E1] to-[#FFF8E7] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl text-[#1F5E3B] mb-6">
                Chuyên nhãn lồng tươi & nhãn sấy tự nhiên
              </h1>
              <p className="text-lg text-[#1F2937] mb-8">
                Nhãn lồng ngọt thanh, cùi dày, hạt nhỏ. Nhãn sấy dẻo thơm, không chất bảo quản,
                phù hợp ăn gia đình và làm quà biếu.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <Link
                  href="/san-pham/nhan-tuoi"
                  className="px-8 py-3 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors text-sm font-medium"
                >
                  Mua ngay
                </Link>
                <Link
                  href="#featured-products"
                  className="px-8 py-3 border-2 border-[#43A047] text-[#43A047] rounded-full hover:bg-[#43A047] hover:text-white transition-colors text-sm font-medium"
                >
                  Xem sản phẩm
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-[#1F5E3B]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-[#43A047]" aria-hidden="true" />
                  </div>
                  <span>Thu hoạch trong ngày</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Package className="w-4 h-4 text-[#43A047]" aria-hidden="true" />
                  </div>
                  <span>Đóng gói cẩn thận</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Truck className="w-4 h-4 text-[#43A047]" aria-hidden="true" />
                  </div>
                  <span>Giao hàng toàn quốc</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/products/longan-fresh-1.jpg"
                alt="Nhãn lồng tươi Hưng Yên - Chùm nhãn chín vàng óng, cùi dày, ngọt thanh tự nhiên"
                width={800}
                height={600}
                className="w-full h-auto rounded-3xl shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured-products" className="py-16 bg-[#FAFAFA]" aria-labelledby="featured-heading">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 id="featured-heading" className="text-2xl text-[#1F5E3B] mb-3">Sản phẩm nổi bật</h2>
            <p className="text-base text-[#6B7280]">Những lựa chọn được khách hàng yêu thích nhất</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Fresh Longan Section */}
      <section id="fresh" className="py-16 bg-[#F7FFF8]" aria-labelledby="fresh-heading">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 id="fresh-heading" className="text-2xl text-[#1F5E3B] mb-3">Nhãn lồng tươi từ vườn</h2>
            <p className="text-base text-[#6B7280] mb-6">Thu hoạch trong ngày, đóng gói cẩn thận</p>
            <Link
              href="/san-pham/nhan-tuoi"
              className="inline-block px-6 py-2 border border-[#43A047] text-[#43A047] rounded-full hover:bg-[#43A047] hover:text-white transition-colors text-sm"
            >
              Xem tất cả nhãn tươi
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {freshLonganProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Dried Longan Section */}
      <section id="dried" className="py-16 bg-white" aria-labelledby="dried-heading">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 id="dried-heading" className="text-2xl text-[#1F5E3B] mb-3">Nhãn sấy dẻo thơm</h2>
            <p className="text-base text-[#6B7280] mb-6">Sấy tự nhiên, giữ nguyên vị ngọt thanh</p>
            <Link
              href="/san-pham/nhan-say"
              className="inline-block px-6 py-2 border border-[#43A047] text-[#43A047] rounded-full hover:bg-[#43A047] hover:text-white transition-colors text-sm"
            >
              Xem tất cả nhãn sấy
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {driedLonganProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="py-16 bg-gradient-to-r from-[#FFF8E7] to-[#DFF5E1]" aria-labelledby="promotion-heading">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white rounded-3xl p-8 md:p-12 shadow-lg">
            <div className="flex-1">
              <div className="inline-block px-4 py-1 bg-[#F4B942] text-white rounded-full text-sm mb-4">
                Ưu đãi đặc biệt
              </div>
              <h2 id="promotion-heading" className="text-2xl text-[#1F5E3B] mb-3">Ưu đãi dành cho khách mới</h2>
              <p className="text-lg text-[#1F2937] mb-4">Giảm 10% cho đơn hàng đầu tiên</p>
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#DFF5E1] rounded-lg">
                <span className="text-base text-[#1F5E3B]">Mã:</span>
                <span className="text-base text-[#43A047] font-semibold">NHANVIET10</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/san-pham/nhan-tuoi"
                className="inline-block px-8 py-3 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors text-sm font-medium"
              >
                Mua sắm ngay
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
