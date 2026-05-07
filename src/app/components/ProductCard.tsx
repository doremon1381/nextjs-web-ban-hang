import { ShoppingCart, Star } from 'lucide-react';

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
  onAddToCart: () => void;
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
  onAddToCart
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {badge && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-[#F4B942] text-white text-xs rounded-full">
            {badge}
          </div>
        )}
      </div>

      <div className="p-4">
        <h4 className="text-[#1F5E3B] mb-1 line-clamp-1">{name}</h4>
        <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">{description}</p>

        <div className="flex gap-1 mb-3">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#F4B942] text-[#F4B942]" />
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl text-[#DC2626] font-semibold">{formatPrice(price)}</span>
              {oldPrice && (
                <span className="text-sm text-[#6B7280] line-through">{formatPrice(oldPrice)}</span>
              )}
            </div>
            <p className="text-xs text-[#6B7280]">/ {unit}</p>
          </div>
        </div>

        <button
          onClick={onAddToCart}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="text-sm">Thêm vào giỏ</span>
        </button>
      </div>
    </div>
  );
}
