import { useState } from 'react';
import { Star, Minus, Plus, ShoppingCart, Truck, Shield, ChevronLeft, Check, Package, Leaf } from 'lucide-react';

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  stock: number;
}

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    oldPrice?: number;
    unit: string;
    image: string;
    images?: string[];
    badge?: string;
    rating: number;
    category: string;
    fullDescription?: string;
    origin?: string;
    harvest?: string;
    packaging?: string;
    storage?: string;
    shipping?: string;
    variants?: ProductVariant[];
  };
  relatedProducts: any[];
  onBack: () => void;
  onAddToCart: (product: any, variant?: ProductVariant, quantity?: number) => void;
  onProductClick: (product: any) => void;
}

export function ProductDetailPage({ product, relatedProducts, onBack, onAddToCart, onProductClick }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);

  const productImages = product.images || [product.image];

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentOldPrice = selectedVariant ? selectedVariant.oldPrice : product.oldPrice;
  const currentStock = selectedVariant ? selectedVariant.stock : 100;

  const handleAddToCart = () => {
    onAddToCart(product, selectedVariant || undefined, quantity);
  };

  const incrementQuantity = () => {
    if (quantity < currentStock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const isFreshProduct = product.category.includes('tươi');

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#FAFAFA] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#43A047] hover:text-[#388E3C] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Quay lại trang chủ</span>
          </button>
          <div className="flex items-center gap-2 text-sm text-[#6B7280] mt-2">
            <button onClick={onBack} className="hover:text-[#43A047] transition-colors">Trang chủ</button>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="text-[#1F2937] font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square bg-[#FAFAFA] rounded-3xl overflow-hidden mb-4 group">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.badge && (
                <div className="absolute top-4 left-4 px-4 py-1.5 bg-[#F4B942] text-white text-sm font-medium rounded-full shadow-lg">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-[#43A047] shadow-md scale-105'
                        : 'border-[#E5E7EB] hover:border-[#43A047]/50 hover:scale-105'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div>
            <div className="mb-3">
              <span className="inline-block px-3 py-1 bg-[#DFF5E1] text-[#1F5E3B] text-sm font-medium rounded-full">
                {product.category}
              </span>
            </div>

            <h1 className="text-4xl text-[#1F5E3B] mb-4 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < product.rating ? 'fill-[#F4B942] text-[#F4B942]' : 'text-[#E5E7EB]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-[#6B7280]">({product.rating}.0 đánh giá tuyệt vời)</span>
            </div>

            <p className="text-lg text-[#6B7280] mb-8 leading-relaxed">{product.description}</p>

            {/* Price */}
            <div className="mb-8 p-6 bg-[#F7FFF8] rounded-2xl border border-[#DFF5E1]">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl text-[#DC2626] font-semibold">
                  {currentPrice.toLocaleString('vi-VN')}đ
                </span>
                {currentOldPrice && (
                  <span className="text-xl text-[#6B7280] line-through">
                    {currentOldPrice.toLocaleString('vi-VN')}đ
                  </span>
                )}
                <span className="text-sm text-[#6B7280]">/ {product.unit}</span>
              </div>
              {currentOldPrice && (
                <div className="inline-block px-3 py-1 bg-[#DC2626] text-white text-sm font-medium rounded-full">
                  Tiết kiệm {Math.round(((currentOldPrice - currentPrice) / currentOldPrice) * 100)}%
                </div>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <label className="block text-base text-[#1F5E3B] font-semibold mb-4">
                  Chọn khối lượng:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setQuantity(1);
                      }}
                      className={`px-4 py-4 border-2 rounded-xl text-sm font-medium transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'border-[#43A047] bg-[#DFF5E1] text-[#1F5E3B] shadow-md scale-105'
                          : 'border-[#E5E7EB] text-[#1F2937] hover:border-[#43A047]/50 hover:scale-105'
                      }`}
                    >
                      <div className="font-semibold">{variant.name}</div>
                      <div className="text-xs text-[#6B7280] mt-1">
                        {variant.price.toLocaleString('vi-VN')}đ
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-base text-[#1F5E3B] font-semibold mb-4">
                Số lượng:
              </label>
              <div className="flex items-center gap-6">
                <div className="flex items-center border-2 border-[#E5E7EB] rounded-xl overflow-hidden">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="px-5 py-4 hover:bg-[#F7FFF8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-5 h-5 text-[#1F5E3B]" />
                  </button>
                  <span className="px-8 py-4 text-lg font-semibold text-[#1F5E3B] min-w-[80px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= currentStock}
                    className="px-5 py-4 hover:bg-[#F7FFF8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-5 h-5 text-[#1F5E3B]" />
                  </button>
                </div>
                <span className="text-sm text-[#6B7280]">
                  Còn <span className="font-semibold text-[#43A047]">{currentStock}</span> sản phẩm
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full px-8 py-5 bg-[#43A047] text-white rounded-full text-lg font-semibold hover:bg-[#388E3C] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 mb-6"
            >
              <ShoppingCart className="w-6 h-6" />
              Thêm vào giỏ hàng
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-[#FFF8E7] rounded-xl">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Truck className="w-6 h-6 text-[#43A047]" />
                </div>
                <div>
                  <p className="text-sm text-[#1F5E3B] font-semibold mb-1">Miễn phí vận chuyển</p>
                  <p className="text-xs text-[#6B7280]">Cho đơn từ 499.000đ</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-[#F7FFF8] rounded-xl">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Shield className="w-6 h-6 text-[#43A047]" />
                </div>
                <div>
                  <p className="text-sm text-[#1F5E3B] font-semibold mb-1">Đảm bảo chất lượng</p>
                  <p className="text-xs text-[#6B7280]">Hoàn tiền 100% nếu lỗi</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Sections */}
        <div className="border-t border-[#E5E7EB] pt-12">
          <div className="max-w-5xl mx-auto">
            {/* Origin & Quality */}
            {(product.origin || product.harvest || product.packaging) && (
              <div className="mb-12 p-8 bg-gradient-to-br from-[#DFF5E1] to-[#FFF8E7] rounded-3xl">
                <h2 className="text-2xl text-[#1F5E3B] font-semibold mb-6 flex items-center gap-3">
                  <Leaf className="w-7 h-7 text-[#43A047]" />
                  Nguồn gốc & Chất lượng
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {product.origin && (
                    <div className="bg-white p-5 rounded-2xl shadow-sm">
                      <h3 className="text-sm text-[#1F5E3B] font-semibold mb-2">🌿 Nguồn gốc</h3>
                      <p className="text-sm text-[#6B7280] leading-relaxed">{product.origin}</p>
                    </div>
                  )}
                  {product.harvest && (
                    <div className="bg-white p-5 rounded-2xl shadow-sm">
                      <h3 className="text-sm text-[#1F5E3B] font-semibold mb-2">🌾 Thu hoạch</h3>
                      <p className="text-sm text-[#6B7280] leading-relaxed">{product.harvest}</p>
                    </div>
                  )}
                  {product.packaging && (
                    <div className="bg-white p-5 rounded-2xl shadow-sm">
                      <h3 className="text-sm text-[#1F5E3B] font-semibold mb-2">📦 Đóng gói</h3>
                      <p className="text-sm text-[#6B7280] leading-relaxed">{product.packaging}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Full Description */}
            <div className="mb-12">
              <h2 className="text-2xl text-[#1F5E3B] font-semibold mb-6">Mô tả chi tiết sản phẩm</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-base text-[#6B7280] leading-relaxed mb-6">
                  {product.fullDescription ||
                    `${product.name} là sản phẩm chất lượng cao, được chọn lọc kỹ càng từ những vườn nhãn uy tín tại Hưng Yên và Bắc Giang.
                    Sản phẩm đảm bảo tươi ngon, ngọt thanh tự nhiên, không sử dụng chất bảo quản hay hóa chất độc hại.`
                  }
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-[#43A047] flex-shrink-0 mt-0.5" />
                    <span className="text-base text-[#1F2937]">Thu hoạch trong ngày, đảm bảo độ tươi tối đa</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-[#43A047] flex-shrink-0 mt-0.5" />
                    <span className="text-base text-[#1F2937]">Không chất bảo quản, an toàn cho sức khỏe</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-[#43A047] flex-shrink-0 mt-0.5" />
                    <span className="text-base text-[#1F2937]">Đóng gói cẩn thận, chống dập nát khi vận chuyển</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-[#43A047] flex-shrink-0 mt-0.5" />
                    <span className="text-base text-[#1F2937]">Nguồn gốc rõ ràng từ vườn nhãn uy tín</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Storage Instructions */}
            <div className="mb-12 p-8 bg-[#FFF8E7] rounded-3xl">
              <h2 className="text-2xl text-[#1F5E3B] font-semibold mb-6 flex items-center gap-3">
                <Package className="w-7 h-7 text-[#F4B942]" />
                Hướng dẫn bảo quản
              </h2>
              <div className="space-y-4">
                <p className="text-base text-[#1F2937] leading-relaxed">
                  {product.storage ||
                    (isFreshProduct
                      ? 'Bảo quản nhãn tươi trong ngăn mát tủ lạnh ở nhiệt độ từ 5-10°C. Sử dụng trong vòng 5-7 ngày để đảm bảo độ tươi ngon tối đa. Tránh để nhãn ở nhiệt độ phòng quá lâu.'
                      : 'Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp. Sau khi mở túi, nên cho vào hộp kín và sử dụng trong vòng 2-3 tuần. Có thể bảo quản trong tủ lạnh để giữ độ dẻo.')
                  }
                </p>
                <ul className="space-y-2 ml-6">
                  {isFreshProduct ? (
                    <>
                      <li className="text-base text-[#6B7280] flex items-start gap-2">
                        <span className="text-[#43A047] font-bold">•</span>
                        <span>Không rửa trước khi bảo quản, chỉ rửa khi sử dụng</span>
                      </li>
                      <li className="text-base text-[#6B7280] flex items-start gap-2">
                        <span className="text-[#43A047] font-bold">•</span>
                        <span>Để riêng biệt với thực phẩm có mùi mạnh</span>
                      </li>
                      <li className="text-base text-[#6B7280] flex items-start gap-2">
                        <span className="text-[#43A047] font-bold">•</span>
                        <span>Dùng túi hoặc hộp kín để tránh mất nước</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="text-base text-[#6B7280] flex items-start gap-2">
                        <span className="text-[#43A047] font-bold">•</span>
                        <span>Tránh ẩm mốc và nhiệt độ cao trên 30°C</span>
                      </li>
                      <li className="text-base text-[#6B7280] flex items-start gap-2">
                        <span className="text-[#43A047] font-bold">•</span>
                        <span>Đậy kín túi sau mỗi lần sử dụng</span>
                      </li>
                      <li className="text-base text-[#6B7280] flex items-start gap-2">
                        <span className="text-[#43A047] font-bold">•</span>
                        <span>Bảo quản trong tủ lạnh để nhãn dẻo hơn</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Shipping & Return Policy */}
            <div className="mb-12 p-8 bg-[#F7FFF8] rounded-3xl border border-[#DFF5E1]">
              <h2 className="text-2xl text-[#1F5E3B] font-semibold mb-6">Chính sách giao hàng & đổi trả</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg text-[#1F5E3B] font-semibold mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#43A047]" />
                    Giao hàng toàn quốc
                  </h3>
                  <ul className="space-y-3">
                    <li className="text-base text-[#6B7280] flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#43A047] flex-shrink-0 mt-0.5" />
                      <span>Miễn phí vận chuyển cho đơn hàng từ 499.000đ</span>
                    </li>
                    <li className="text-base text-[#6B7280] flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#43A047] flex-shrink-0 mt-0.5" />
                      <span>Giao hàng nhanh: 1-3 ngày nội thành, 3-7 ngày tỉnh xa</span>
                    </li>
                    <li className="text-base text-[#6B7280] flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#43A047] flex-shrink-0 mt-0.5" />
                      <span>Đóng gói cẩn thận, chống va đập, giữ tươi</span>
                    </li>
                    <li className="text-base text-[#6B7280] flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#43A047] flex-shrink-0 mt-0.5" />
                      <span>Kiểm tra hàng trước khi thanh toán</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg text-[#1F5E3B] font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#43A047]" />
                    Chính sách đổi trả
                  </h3>
                  <ul className="space-y-3">
                    <li className="text-base text-[#6B7280] flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#43A047] flex-shrink-0 mt-0.5" />
                      <span>Đổi trả trong 24h nếu sản phẩm bị lỗi hoặc hư hỏng</span>
                    </li>
                    <li className="text-base text-[#6B7280] flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#43A047] flex-shrink-0 mt-0.5" />
                      <span>Hoàn tiền 100% nếu sản phẩm không đúng mô tả</span>
                    </li>
                    <li className="text-base text-[#6B7280] flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#43A047] flex-shrink-0 mt-0.5" />
                      <span>Hỗ trợ đổi sản phẩm khác cùng giá trị</span>
                    </li>
                    <li className="text-base text-[#6B7280] flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#43A047] flex-shrink-0 mt-0.5" />
                      <span>Liên hệ: 0866.918.366 để được hỗ trợ nhanh</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-[#E5E7EB] pt-12">
            <h2 className="text-2xl text-[#1F5E3B] font-semibold mb-8">Sản phẩm liên quan</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => onProductClick(relatedProduct)}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {relatedProduct.badge && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-[#F4B942] text-white text-xs font-medium rounded-full">
                        {relatedProduct.badge}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg text-[#1F5E3B] font-semibold mb-1 line-clamp-1">{relatedProduct.name}</h3>
                    <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">{relatedProduct.description}</p>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-xl text-[#DC2626] font-semibold">
                        {relatedProduct.price.toLocaleString('vi-VN')}đ
                      </span>
                      <span className="text-xs text-[#6B7280]">/ {relatedProduct.unit}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(relatedProduct);
                      }}
                      className="w-full px-4 py-2.5 bg-[#43A047] text-white rounded-full text-sm font-medium hover:bg-[#388E3C] transition-colors"
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
