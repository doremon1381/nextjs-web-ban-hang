import { ShoppingCart, Star } from 'lucide-react';

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  stock: number;
}

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  unit: string;
  image: string;
  badge?: string;
  rating: number;
  variants?: ProductVariant[];
  onAddToCart: () => void;
  onClick?: () => void;
}

export function ProductCard({
  name,
  description,
  price,
  oldPrice,
  unit,
  image,
  badge,
  rating,
  variants,
  onAddToCart,
  onClick
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const hasMultipleVariants = variants && variants.length > 1;
  const minPrice = hasMultipleVariants
    ? Math.min(...variants.map(v => v.price))
    : price;

  return (
    <article className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group">
      <div
        className="relative overflow-hidden aspect-square cursor-pointer"
        onClick={onClick}
      >
        <img
          src={image}
          alt={`${name} - ${description}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {badge && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-[#F4B942] text-white text-xs rounded-full" aria-label={`Nhãn: ${badge}`}>
            {badge}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3
          className="text-2xl text-[#1F5E3B] mb-1 line-clamp-1 cursor-pointer hover:text-[#43A047] transition-colors"
          onClick={onClick}
        >
          {name}
        </h3>
        <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">{description}</p>

        <div className="flex gap-1 mb-3" role="img" aria-label={`Đánh giá ${rating} trên 5 sao`}>
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#F4B942] text-[#F4B942]" aria-hidden="true" />
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-[#DC2626]">
                {hasMultipleVariants ? `Từ ${formatPrice(minPrice)}` : formatPrice(price)}
              </span>
              {!hasMultipleVariants && oldPrice && (
                <span className="text-sm text-[#6B7280] line-through">{formatPrice(oldPrice)}</span>
              )}
            </div>
            <p className="text-xs text-[#6B7280]">/ {unit}</p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (hasMultipleVariants && onClick) {
              onClick();
            } else {
              onAddToCart();
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors text-sm font-medium"
          aria-label={`Thêm ${name} vào giỏ hàng`}
        >
          <ShoppingCart className="w-4 h-4" aria-hidden="true" />
          <span>{hasMultipleVariants ? 'Xem chi tiết' : 'Thêm vào giỏ'}</span>
        </button>
      </div>
    </article>
  );
}
