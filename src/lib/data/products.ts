export type ProductCategory = 'fresh' | 'dried' | 'combo';

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  fresh: 'Nhãn lồng tươi',
  dried: 'Nhãn sấy',
  combo: 'Combo quà biếu',
};

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  unit: string;
  image: string;
  images?: string[];
  category: ProductCategory;
  badge?: string;
  rating: number;
  fullDescription?: string;
  origin?: string;
  harvest?: string;
  packaging?: string;
  storage?: string;
  shipping?: string;
  variants: ProductVariant[];
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'nhan-long-tuoi-loai-1',
    name: 'Nhãn lồng tươi loại 1',
    description: 'Cùi dày, hạt nhỏ, ngọt thanh',
    price: 69000,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=500',
    images: [
      'https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=800',
      'https://images.unsplash.com/photo-1727761800023-7668b28b53dc?w=800',
      'https://images.unsplash.com/photo-1755971103909-c2710ea5aad8?w=800',
      'https://images.unsplash.com/photo-1727761799967-dbb46b23baef?w=800',
    ],
    category: 'fresh',
    fullDescription:
      'Nhãn lồng tươi loại 1 được thu hoạch từ những vườn nhãn uy tín tại Hưng Yên và Bắc Giang - hai vùng trồng nhãn nổi tiếng nhất Việt Nam. Quả nhãn có cùi dày, hạt nhỏ, vị ngọt thanh tự nhiên không pha tạp chất. Mỗi quả đều được chọn lọc kỹ càng, đảm bảo độ tươi ngon và chất lượng cao nhất.',
    origin: 'Vườn nhãn chuyên canh tại Hưng Yên & Bắc Giang - vùng đất vàng trồng nhãn',
    harvest: 'Thu hoạch vào buổi sáng sớm, đảm bảo độ tươi và ngọt tự nhiên',
    packaging: 'Đóng gói cẩn thận trong thùng carton chống sốc, lót giấy mềm bảo vệ quả',
    badge: 'Bán chạy',
    rating: 5,
    featured: true,
    variants: [
      { id: '1kg', name: '1kg', price: 69000, stock: 100 },
      { id: '2kg', name: '2kg', price: 135000, oldPrice: 150000, stock: 80 },
      { id: '5kg', name: '5kg', price: 320000, oldPrice: 350000, stock: 50 },
    ],
  },
  {
    id: '2',
    slug: 'nhan-long-tuoi-nguyen-chum',
    name: 'Nhãn lồng tươi nguyên chùm',
    description: 'Tươi ngon, phù hợp ăn gia đình',
    price: 135000,
    oldPrice: 150000,
    unit: 'chùm',
    image: 'https://images.unsplash.com/photo-1727761801419-d19129d3253e?w=500',
    images: [
      'https://images.unsplash.com/photo-1727761801419-d19129d3253e?w=800',
      'https://images.unsplash.com/photo-1727761799967-dbb46b23baef?w=800',
      'https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=800',
    ],
    category: 'fresh',
    fullDescription:
      'Nhãn lồng tươi nguyên chùm được thu hoạch trực tiếp từ vườn và giữ nguyên chùm để đảm bảo độ tươi ngon tối đa. Phù hợp cho gia đình đông người, tổ chức tiệc hoặc sự kiện. Nhãn nguyên chùm tươi lâu hơn, giữ được độ ẩm và vị ngọt tự nhiên.',
    origin: 'Vườn nhãn Hưng Yên, thu hoạch trong ngày giao hàng',
    harvest: 'Cắt chùm cẩn thận, giữ nguyên cuống để nhãn tươi lâu',
    packaging: 'Bọc màng PE bảo vệ, đóng thùng carton có lỗ thoáng khí',
    rating: 5,
    featured: true,
    variants: [
      { id: '2kg', name: '2kg (1 chùm)', price: 135000, oldPrice: 150000, stock: 60 },
      { id: '3kg', name: '3kg (1-2 chùm)', price: 198000, stock: 40 },
      { id: '5kg', name: '5kg (2-3 chùm)', price: 320000, oldPrice: 350000, stock: 30 },
    ],
  },
  {
    id: '3',
    slug: 'nhan-say-deo',
    name: 'Nhãn sấy dẻo',
    description: 'Dẻo thơm, ngọt tự nhiên',
    price: 125000,
    unit: 'túi',
    image: 'https://images.unsplash.com/photo-1597975371283-5461cdf69d5e?w=500',
    images: [
      'https://images.unsplash.com/photo-1597975371283-5461cdf69d5e?w=800',
      'https://images.unsplash.com/photo-1755971103490-a70bf35f8a4f?w=800',
      'https://images.unsplash.com/photo-1755971103541-402280c3befc?w=800',
    ],
    category: 'dried',
    fullDescription:
      'Nhãn sấy dẻo được chế biến từ nhãn tươi loại 1, sấy khô tự nhiên không sử dụng lưu huỳnh hay chất bảo quản độc hại. Sản phẩm giữ nguyên vị ngọt thanh đặc trưng của nhãn tươi, dẻo thơm, không bị khô cứng. Rất phù hợp để làm quà biếu, ăn vặt hàng ngày hoặc pha trà nhãn.',
    origin: 'Chế biến từ nhãn tươi Hưng Yên cao cấp',
    harvest: 'Nhãn được chọn lọc kỹ, chỉ lấy quả chín đều, ngọt thanh',
    packaging: 'Túi zip kín khí, có van 1 chiều giữ độ tươi, ngăn ẩm mốc',
    badge: 'Mới',
    rating: 5,
    featured: true,
    variants: [
      { id: '250g', name: '250g', price: 68000, stock: 120 },
      { id: '500g', name: '500g', price: 125000, stock: 100 },
      { id: '1kg', name: '1kg', price: 240000, oldPrice: 270000, stock: 60 },
    ],
  },
  {
    id: '4',
    slug: 'combo-nhan-tuoi-nhan-say',
    name: 'Combo nhãn tươi + nhãn sấy',
    description: 'Phù hợp dùng thử hoặc biếu tặng',
    price: 199000,
    oldPrice: 240000,
    unit: 'combo',
    image: 'https://images.unsplash.com/photo-1727761800233-1db40fa3f01f?w=500',
    images: [
      'https://images.unsplash.com/photo-1727761800233-1db40fa3f01f?w=800',
      'https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=800',
      'https://images.unsplash.com/photo-1597975371283-5461cdf69d5e?w=800',
    ],
    category: 'combo',
    fullDescription:
      'Combo bao gồm nhãn lồng tươi loại 1 và nhãn sấy dẻo thơm ngon, đóng gói trong hộp quà sang trọng. Phù hợp làm quà biếu cho người thân, đối tác trong các dịp lễ tết, sinh nhật, hay tri ân khách hàng. Sản phẩm được chọn lọc kỹ càng, đảm bảo chất lượng cao nhất.',
    origin: 'Combo sản phẩm cao cấp từ vườn nhãn Hưng Yên',
    harvest: 'Nhãn tươi thu hoạch trong ngày, nhãn sấy từ quả loại 1',
    packaging: 'Hộp quà carton cao cấp, lót giấy mỹ thuật, kèm túi xách sang trọng',
    badge: 'Tiết kiệm 17%',
    rating: 5,
    featured: true,
    variants: [
      { id: 'basic', name: 'Combo cơ bản', price: 199000, oldPrice: 240000, stock: 50 },
      { id: 'premium', name: 'Combo cao cấp', price: 399000, oldPrice: 480000, stock: 30 },
      { id: 'deluxe', name: 'Hộp quà sang trọng', price: 599000, oldPrice: 720000, stock: 20 },
    ],
  },
  {
    id: '5',
    slug: 'nhan-long-tuoi-1kg',
    name: 'Nhãn lồng tươi 1kg',
    description: 'Quả to, ngọt thanh, cùi dày',
    price: 69000,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1727761800023-7668b28b53dc?w=500',
    images: [
      'https://images.unsplash.com/photo-1727761800023-7668b28b53dc?w=800',
      'https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=800',
    ],
    category: 'fresh',
    fullDescription:
      'Nhãn lồng tươi chọn lọc từ vườn, quả to đồng đều, ngọt thanh tự nhiên. Thích hợp cho gia đình nhỏ hoặc dùng thử.',
    origin: 'Vườn nhãn Hưng Yên',
    harvest: 'Thu hoạch sáng sớm, giao trong ngày',
    packaging: 'Túi nilon thực phẩm, đóng thùng carton',
    rating: 5,
    variants: [{ id: '1kg', name: '1kg', price: 69000, stock: 100 }],
  },
  {
    id: '6',
    slug: 'nhan-long-tuoi-2kg',
    name: 'Nhãn lồng tươi 2kg',
    description: 'Túi gia đình tiết kiệm',
    price: 135000,
    unit: 'túi',
    image: 'https://images.unsplash.com/photo-1755971103909-c2710ea5aad8?w=500',
    images: ['https://images.unsplash.com/photo-1755971103909-c2710ea5aad8?w=800'],
    category: 'fresh',
    fullDescription: 'Túi nhãn 2kg dành cho gia đình, giá tiết kiệm hơn so với mua lẻ.',
    origin: 'Vườn nhãn Bắc Giang',
    harvest: 'Thu hoạch theo đơn',
    packaging: 'Túi zip lớn, giữ độ tươi',
    rating: 5,
    variants: [{ id: '2kg', name: '2kg', price: 135000, stock: 80 }],
  },
  {
    id: '7',
    slug: 'nhan-nguyen-chum-3kg',
    name: 'Nhãn nguyên chùm 3kg',
    description: 'Tươi từ vườn, thu hoạch trong ngày',
    price: 198000,
    unit: 'chùm',
    image: 'https://images.unsplash.com/photo-1727761799967-dbb46b23baef?w=500',
    images: ['https://images.unsplash.com/photo-1727761799967-dbb46b23baef?w=800'],
    category: 'fresh',
    fullDescription: 'Nhãn nguyên chùm tươi ngon, thu hoạch trong ngày, giữ nguyên cuống.',
    origin: 'Vườn nhãn Hưng Yên',
    harvest: 'Cắt chùm cẩn thận',
    packaging: 'Bọc màng bảo vệ',
    rating: 5,
    variants: [{ id: '3kg', name: '3kg', price: 198000, stock: 60 }],
  },
  {
    id: '8',
    slug: 'hop-nhan-long-cao-cap',
    name: 'Hộp nhãn lồng cao cấp',
    description: 'Đóng gói sang trọng, phù hợp biếu tặng',
    price: 350000,
    unit: 'hộp',
    image: 'https://images.unsplash.com/photo-1727761800109-14e6e293680f?w=500',
    images: ['https://images.unsplash.com/photo-1727761800109-14e6e293680f?w=800'],
    category: 'fresh',
    fullDescription:
      'Hộp quà nhãn cao cấp, đóng gói sang trọng, phù hợp biếu tặng người thân, đối tác.',
    origin: 'Vườn nhãn Hưng Yên loại 1',
    harvest: 'Chọn quả đẹp nhất',
    packaging: 'Hộp carton cao cấp, kèm túi xách',
    badge: 'Quà tặng',
    rating: 5,
    variants: [{ id: 'gift-box', name: 'Hộp quà 2kg', price: 350000, stock: 40 }],
  },
  {
    id: '9',
    slug: 'nhan-say-deo-250g',
    name: 'Nhãn sấy dẻo 250g',
    description: 'Thơm ngọt tự nhiên, không phẩm màu',
    price: 68000,
    unit: 'túi',
    image: 'https://images.unsplash.com/photo-1597975371283-5461cdf69d5e?w=500',
    images: ['https://images.unsplash.com/photo-1597975371283-5461cdf69d5e?w=800'],
    category: 'dried',
    fullDescription:
      'Nhãn sấy dẻo 250g, thơm ngọt tự nhiên, không chất bảo quản. Phù hợp ăn vặt hoặc pha trà.',
    origin: 'Chế biến từ nhãn Hưng Yên',
    harvest: 'Sấy tự nhiên, không lưu huỳnh',
    packaging: 'Túi zip kín khí',
    rating: 5,
    variants: [{ id: '250g', name: '250g', price: 68000, stock: 120 }],
  },
  {
    id: '10',
    slug: 'nhan-say-deo-500g',
    name: 'Nhãn sấy dẻo 500g',
    description: 'Dẻo thơm, ngọt thanh, giữ nguyên vị tự nhiên',
    price: 125000,
    unit: 'túi',
    image: 'https://images.unsplash.com/photo-1755971103490-a70bf35f8a4f?w=500',
    images: ['https://images.unsplash.com/photo-1755971103490-a70bf35f8a4f?w=800'],
    category: 'dried',
    fullDescription:
      'Nhãn sấy dẻo 500g, dẻo thơm ngọt thanh, giữ nguyên vị tự nhiên của nhãn tươi.',
    origin: 'Chế biến từ nhãn loại 1',
    harvest: 'Sấy chậm, giữ độ dẻo',
    packaging: 'Túi zip có van 1 chiều',
    badge: 'Bán chạy',
    rating: 5,
    variants: [{ id: '500g', name: '500g', price: 125000, stock: 100 }],
  },
  {
    id: '11',
    slug: 'nhan-say-kho-500g',
    name: 'Nhãn sấy khô 500g',
    description: 'Sấy khô hoàn toàn, bảo quản lâu',
    price: 135000,
    unit: 'túi',
    image: 'https://images.unsplash.com/photo-1755971103541-402280c3befc?w=500',
    images: ['https://images.unsplash.com/photo-1755971103541-402280c3befc?w=800'],
    category: 'dried',
    fullDescription:
      'Nhãn sấy khô hoàn toàn, bảo quản được lâu, tiện lợi mang theo du lịch.',
    origin: 'Nhãn Bắc Giang',
    harvest: 'Sấy khô kỹ',
    packaging: 'Túi zip chống ẩm',
    rating: 5,
    variants: [{ id: '500g', name: '500g', price: 135000, stock: 90 }],
  },
  {
    id: '12',
    slug: 'hop-qua-nhan-say-cao-cap',
    name: 'Hộp quà nhãn sấy cao cấp',
    description: 'Hộp gỗ sang trọng, phù hợp tặng đối tác',
    price: 280000,
    unit: 'hộp',
    image: 'https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=500',
    images: ['https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=800'],
    category: 'dried',
    fullDescription:
      'Hộp quà nhãn sấy cao cấp với hộp gỗ sang trọng, phù hợp biếu tặng đối tác, khách hàng VIP.',
    origin: 'Nhãn sấy cao cấp nhất',
    harvest: 'Chọn quả đẹp, sấy kỹ',
    packaging: 'Hộp gỗ cao cấp, kèm túi xách',
    badge: 'Cao cấp',
    rating: 5,
    variants: [{ id: 'gift-box', name: 'Hộp quà 500g', price: 280000, stock: 50 }],
  },
];

export const getProducts = (filters?: {
  category?: ProductCategory;
  featured?: boolean;
}): Product[] =>
  products.filter(
    p =>
      (!filters?.category || p.category === filters.category) &&
      (filters?.featured === undefined || !!p.featured === filters.featured),
  );

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find(p => p.slug === slug);

export const getAllProductSlugs = (): string[] => products.map(p => p.slug);
