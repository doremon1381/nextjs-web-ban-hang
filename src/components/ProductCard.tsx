'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import type { Product } from '@/lib/data/products';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';
  const hasMultipleVariants = product.variants && product.variants.length > 1;
  const minPrice = hasMultipleVariants
    ? Math.min(...product.variants!.map(v => v.price))
    : product.price;

  const handleAddToCart = () => {
    const variant = product.variants?.length === 1 ? product.variants[0] : undefined;
    addItem(product, variant);
  };

  return (
    <article className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group">
      <Link href={`/san-pham/${product.slug}`} className="relative overflow-hidden aspect-square block">
        <Image
          fill
          src={product.image}
          alt={`${product.name} - ${product.description}`}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.badge && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-[#F4B942] text-white text-xs rounded-full z-10" aria-label={`Nhãn: ${product.badge}`}>
            {product.badge}
          </div>
        )}
      </Link>

      <div className="p-4">
        <Link href={`/san-pham/${product.slug}`}>
          <h3 className="text-2xl text-[#1F5E3B] mb-1 line-clamp-1 hover:text-[#43A047] transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">{product.description}</p>

        <div className="flex gap-1 mb-3" role="img" aria-label={`Đánh giá ${product.rating} trên 5 sao`}>
          {[...Array(product.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#F4B942] text-[#F4B942]" aria-hidden="true" />
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-[#DC2626]">
                {hasMultipleVariants ? `Từ ${formatPrice(minPrice)}` : formatPrice(product.price)}
              </span>
              {!hasMultipleVariants && product.oldPrice && (
                <span className="text-sm text-[#6B7280] line-through">{formatPrice(product.oldPrice)}</span>
              )}
            </div>
            <p className="text-xs text-[#6B7280]">/ {product.unit}</p>
          </div>
        </div>

        {hasMultipleVariants ? (
          <Link
            href={`/san-pham/${product.slug}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors text-sm font-medium"
            aria-label={`Xem chi tiết ${product.name}`}
          >
            <ShoppingCart className="w-4 h-4" aria-hidden="true" />
            <span>Xem chi tiết</span>
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors text-sm font-medium"
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
          >
            <ShoppingCart className="w-4 h-4" aria-hidden="true" />
            <span>Thêm vào giỏ</span>
          </button>
        )}
      </div>
    </article>
  );
}
