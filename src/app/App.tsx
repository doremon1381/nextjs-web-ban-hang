import { useState, useEffect, useRef } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { ShoppingCart, User, Search, Phone, Truck, Leaf, Package, Menu, X } from 'lucide-react';
import { LoginModal } from './components/LoginModal';
import { CartModal } from './components/CartModal';
import { ProductCard } from './components/ProductCard';
import { ProductDetailPage } from './components/ProductDetailPage';
import { ContactPage } from './components/ContactPage';
import { AccountPage } from './components/AccountPage';
import { OrdersPage } from './components/OrdersPage';
import { FloatingContactButtons } from './components/FloatingContactButtons';

interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  variantName: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
}

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const addToCart = (product: any, variant?: any, quantity: number = 1) => {
    const cartItemId = variant ? `${product.id}-${variant.id}` : product.id;
    const productToAdd: CartItem = variant
      ? {
          id: cartItemId,
          productId: product.id,
          variantId: variant.id,
          name: product.name,
          variantName: variant.name,
          price: variant.price,
          quantity,
          image: product.image,
          unit: product.unit
        }
      : {
          id: cartItemId,
          productId: product.id,
          variantId: '',
          name: product.name,
          variantName: '',
          price: product.price,
          quantity,
          image: product.image,
          unit: product.unit
        };

    setCartItems(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + productToAdd.quantity }
            : item
        );
      }
      return [...prev, productToAdd];
    });
    setIsCartOpen(true);
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromProduct = () => {
    setSelectedProduct(null);
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const navigateToPage = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData);
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setShowUserMenu(false);
    navigateToPage('home');
  };

  const handleUpdateUser = (userData: { name: string; email: string; phone: string; address: string }) => {
    setUser({ name: userData.name, email: userData.email });
  };

  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const featuredProducts = [
    {
      id: '1',
      name: 'Nhãn lồng tươi loại 1',
      description: 'Cùi dày, hạt nhỏ, ngọt thanh',
      price: 69000,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=500',
      images: [
        'https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=800',
        'https://images.unsplash.com/photo-1727761800023-7668b28b53dc?w=800',
        'https://images.unsplash.com/photo-1755971103909-c2710ea5aad8?w=800',
        'https://images.unsplash.com/photo-1727761799967-dbb46b23baef?w=800'
      ],
      category: 'Nhãn lồng tươi',
      fullDescription: 'Nhãn lồng tươi loại 1 được thu hoạch từ những vườn nhãn uy tín tại Hưng Yên và Bắc Giang - hai vùng trồng nhãn nổi tiếng nhất Việt Nam. Quả nhãn có cùi dày, hạt nhỏ, vị ngọt thanh tự nhiên không pha tạp chất. Mỗi quả đều được chọn lọc kỹ càng, đảm bảo độ tươi ngon và chất lượng cao nhất.',
      origin: 'Vườn nhãn chuyên canh tại Hưng Yên & Bắc Giang - vùng đất vàng trồng nhãn',
      harvest: 'Thu hoạch vào buổi sáng sớm, đảm bảo độ tươi và ngọt tự nhiên',
      packaging: 'Đóng gói cẩn thận trong thùng carton chống sốc, lót giấy mềm bảo vệ quả',
      badge: 'Bán chạy',
      rating: 5,
      variants: [
        { id: '1kg', name: '1kg', price: 69000, stock: 100 },
        { id: '2kg', name: '2kg', price: 135000, oldPrice: 150000, stock: 80 },
        { id: '5kg', name: '5kg', price: 320000, oldPrice: 350000, stock: 50 }
      ]
    },
    {
      id: '2',
      name: 'Nhãn lồng tươi nguyên chùm',
      description: 'Tươi ngon, phù hợp ăn gia đình',
      price: 135000,
      oldPrice: 150000,
      unit: 'chùm',
      image: 'https://images.unsplash.com/photo-1727761801419-d19129d3253e?w=500',
      images: [
        'https://images.unsplash.com/photo-1727761801419-d19129d3253e?w=800',
        'https://images.unsplash.com/photo-1727761799967-dbb46b23baef?w=800',
        'https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=800'
      ],
      category: 'Nhãn lồng tươi',
      fullDescription: 'Nhãn lồng tươi nguyên chùm được thu hoạch trực tiếp từ vườn và giữ nguyên chùm để đảm bảo độ tươi ngon tối đa. Phù hợp cho gia đình đông người, tổ chức tiệc hoặc sự kiện. Nhãn nguyên chùm tươi lâu hơn, giữ được độ ẩm và vị ngọt tự nhiên.',
      origin: 'Vườn nhãn Hưng Yên, thu hoạch trong ngày giao hàng',
      harvest: 'Cắt chùm cẩn thận, giữ nguyên cuống để nhãn tươi lâu',
      packaging: 'Bọc màng PE bảo vệ, đóng thùng carton có lỗ thoáng khí',
      rating: 5,
      variants: [
        { id: '2kg', name: '2kg (1 chùm)', price: 135000, oldPrice: 150000, stock: 60 },
        { id: '3kg', name: '3kg (1-2 chùm)', price: 198000, stock: 40 },
        { id: '5kg', name: '5kg (2-3 chùm)', price: 320000, oldPrice: 350000, stock: 30 }
      ]
    },
    {
      id: '3',
      name: 'Nhãn sấy dẻo',
      description: 'Dẻo thơm, ngọt tự nhiên',
      price: 125000,
      unit: 'túi',
      image: 'https://images.unsplash.com/photo-1597975371283-5461cdf69d5e?w=500',
      images: [
        'https://images.unsplash.com/photo-1597975371283-5461cdf69d5e?w=800',
        'https://images.unsplash.com/photo-1755971103490-a70bf35f8a4f?w=800',
        'https://images.unsplash.com/photo-1755971103541-402280c3befc?w=800'
      ],
      category: 'Nhãn sấy',
      fullDescription: 'Nhãn sấy dẻo được chế biến từ nhãn tươi loại 1, sấy khô tự nhiên không sử dụng lưu huỳnh hay chất bảo quản độc hại. Sản phẩm giữ nguyên vị ngọt thanh đặc trưng của nhãn tươi, dẻo thơm, không bị khô cứng. Rất phù hợp để làm quà biếu, ăn vặt hàng ngày hoặc pha trà nhãn.',
      origin: 'Chế biến từ nhãn tươi Hưng Yên cao cấp',
      harvest: 'Nhãn được chọn lọc kỹ, chỉ lấy quả chín đều, ngọt thanh',
      packaging: 'Túi zip kín khí, có van 1 chiều giữ độ tươi, ngăn ẩm mốc',
      badge: 'Mới',
      rating: 5,
      variants: [
        { id: '250g', name: '250g', price: 68000, stock: 120 },
        { id: '500g', name: '500g', price: 125000, stock: 100 },
        { id: '1kg', name: '1kg', price: 240000, oldPrice: 270000, stock: 60 }
      ]
    },
    {
      id: '4',
      name: 'Combo nhãn tươi + nhãn sấy',
      description: 'Phù hợp dùng thử hoặc biếu tặng',
      price: 199000,
      oldPrice: 240000,
      unit: 'combo',
      image: 'https://images.unsplash.com/photo-1727761800233-1db40fa3f01f?w=500',
      images: [
        'https://images.unsplash.com/photo-1727761800233-1db40fa3f01f?w=800',
        'https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=800',
        'https://images.unsplash.com/photo-1597975371283-5461cdf69d5e?w=800'
      ],
      category: 'Combo quà biếu',
      fullDescription: 'Combo bao gồm nhãn lồng tươi loại 1 và nhãn sấy dẻo thơm ngon, đóng gói trong hộp quà sang trọng. Phù hợp làm quà biếu cho người thân, đối tác trong các dịp lễ tết, sinh nhật, hay tri ân khách hàng. Sản phẩm được chọn lọc kỹ càng, đảm bảo chất lượng cao nhất.',
      origin: 'Combo sản phẩm cao cấp từ vườn nhãn Hưng Yên',
      harvest: 'Nhãn tươi thu hoạch trong ngày, nhãn sấy từ quả loại 1',
      packaging: 'Hộp quà carton cao cấp, lót giấy mỹ thuật, kèm túi xách sang trọng',
      badge: 'Tiết kiệm 17%',
      rating: 5,
      variants: [
        { id: 'basic', name: 'Combo cơ bản', price: 199000, oldPrice: 240000, stock: 50 },
        { id: 'premium', name: 'Combo cao cấp', price: 399000, oldPrice: 480000, stock: 30 },
        { id: 'deluxe', name: 'Hộp quà sang trọng', price: 599000, oldPrice: 720000, stock: 20 }
      ]
    }
  ];

  const freshLonganProducts = [
    {
      id: '5',
      name: 'Nhãn lồng tươi 1kg',
      description: 'Quả to, ngọt thanh, cùi dày',
      price: 69000,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1727761800023-7668b28b53dc?w=500',
      images: ['https://images.unsplash.com/photo-1727761800023-7668b28b53dc?w=800', 'https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=800'],
      category: 'Nhãn lồng tươi',
      fullDescription: 'Nhãn lồng tươi chọn lọc từ vườn, quả to đồng đều, ngọt thanh tự nhiên. Thích hợp cho gia đình nhỏ hoặc dùng thử.',
      origin: 'Vườn nhãn Hưng Yên',
      harvest: 'Thu hoạch sáng sớm, giao trong ngày',
      packaging: 'Túi nilon thực phẩm, đóng thùng carton',
      rating: 5,
      variants: [{ id: '1kg', name: '1kg', price: 69000, stock: 100 }]
    },
    {
      id: '6',
      name: 'Nhãn lồng tươi 2kg',
      description: 'Túi gia đình tiết kiệm',
      price: 135000,
      unit: 'túi',
      image: 'https://images.unsplash.com/photo-1755971103909-c2710ea5aad8?w=500',
      images: ['https://images.unsplash.com/photo-1755971103909-c2710ea5aad8?w=800'],
      category: 'Nhãn lồng tươi',
      fullDescription: 'Túi nhãn 2kg dành cho gia đình, giá tiết kiệm hơn so với mua lẻ.',
      origin: 'Vườn nhãn Bắc Giang',
      harvest: 'Thu hoạch theo đơn',
      packaging: 'Túi zip lớn, giữ độ tươi',
      rating: 5,
      variants: [{ id: '2kg', name: '2kg', price: 135000, stock: 80 }]
    },
    {
      id: '7',
      name: 'Nhãn nguyên chùm 3kg',
      description: 'Tươi từ vườn, thu hoạch trong ngày',
      price: 198000,
      unit: 'chùm',
      image: 'https://images.unsplash.com/photo-1727761799967-dbb46b23baef?w=500',
      images: ['https://images.unsplash.com/photo-1727761799967-dbb46b23baef?w=800'],
      category: 'Nhãn lồng tươi',
      fullDescription: 'Nhãn nguyên chùm tươi ngon, thu hoạch trong ngày, giữ nguyên cuống.',
      origin: 'Vườn nhãn Hưng Yên',
      harvest: 'Cắt chùm cẩn thận',
      packaging: 'Bọc màng bảo vệ',
      rating: 5,
      variants: [{ id: '3kg', name: '3kg', price: 198000, stock: 60 }]
    },
    {
      id: '8',
      name: 'Hộp nhãn lồng cao cấp',
      description: 'Đóng gói sang trọng, phù hợp biếu tặng',
      price: 350000,
      unit: 'hộp',
      image: 'https://images.unsplash.com/photo-1727761800109-14e6e293680f?w=500',
      images: ['https://images.unsplash.com/photo-1727761800109-14e6e293680f?w=800'],
      category: 'Nhãn lồng tươi',
      fullDescription: 'Hộp quà nhãn cao cấp, đóng gói sang trọng, phù hợp biếu tặng người thân, đối tác.',
      origin: 'Vườn nhãn Hưng Yên loại 1',
      harvest: 'Chọn quả đẹp nhất',
      packaging: 'Hộp carton cao cấp, kèm túi xách',
      badge: 'Quà tặng',
      rating: 5,
      variants: [{ id: 'gift-box', name: 'Hộp quà 2kg', price: 350000, stock: 40 }]
    }
  ];

  const driedLonganProducts = [
    {
      id: '9',
      name: 'Nhãn sấy dẻo 250g',
      description: 'Thơm ngọt tự nhiên, không phẩm màu',
      price: 68000,
      unit: 'túi',
      image: 'https://images.unsplash.com/photo-1597975371283-5461cdf69d5e?w=500',
      images: ['https://images.unsplash.com/photo-1597975371283-5461cdf69d5e?w=800'],
      category: 'Nhãn sấy',
      fullDescription: 'Nhãn sấy dẻo 250g, thơm ngọt tự nhiên, không chất bảo quản. Phù hợp ăn vặt hoặc pha trà.',
      origin: 'Chế biến từ nhãn Hưng Yên',
      harvest: 'Sấy tự nhiên, không lưu huỳnh',
      packaging: 'Túi zip kín khí',
      rating: 5,
      variants: [{ id: '250g', name: '250g', price: 68000, stock: 120 }]
    },
    {
      id: '10',
      name: 'Nhãn sấy dẻo 500g',
      description: 'Dẻo thơm, ngọt thanh, giữ nguyên vị tự nhiên',
      price: 125000,
      unit: 'túi',
      image: 'https://images.unsplash.com/photo-1755971103490-a70bf35f8a4f?w=500',
      images: ['https://images.unsplash.com/photo-1755971103490-a70bf35f8a4f?w=800'],
      category: 'Nhãn sấy',
      fullDescription: 'Nhãn sấy dẻo 500g, dẻo thơm ngọt thanh, giữ nguyên vị tự nhiên của nhãn tươi.',
      origin: 'Chế biến từ nhãn loại 1',
      harvest: 'Sấy chậm, giữ độ dẻo',
      packaging: 'Túi zip có van 1 chiều',
      badge: 'Bán chạy',
      rating: 5,
      variants: [{ id: '500g', name: '500g', price: 125000, stock: 100 }]
    },
    {
      id: '11',
      name: 'Nhãn sấy khô 500g',
      description: 'Sấy khô hoàn toàn, bảo quản lâu',
      price: 135000,
      unit: 'túi',
      image: 'https://images.unsplash.com/photo-1755971103541-402280c3befc?w=500',
      images: ['https://images.unsplash.com/photo-1755971103541-402280c3befc?w=800'],
      category: 'Nhãn sấy',
      fullDescription: 'Nhãn sấy khô hoàn toàn, bảo quản được lâu, tiện lợi mang theo du lịch.',
      origin: 'Nhãn Bắc Giang',
      harvest: 'Sấy khô kỹ',
      packaging: 'Túi zip chống ẩm',
      rating: 5,
      variants: [{ id: '500g', name: '500g', price: 135000, stock: 90 }]
    },
    {
      id: '12',
      name: 'Hộp quà nhãn sấy cao cấp',
      description: 'Hộp gỗ sang trọng, phù hợp tặng đối tác',
      price: 280000,
      unit: 'hộp',
      image: 'https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=500',
      images: ['https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=800'],
      category: 'Nhãn sấy',
      fullDescription: 'Hộp quà nhãn sấy cao cấp với hộp gỗ sang trọng, phù hợp biếu tặng đối tác, khách hàng VIP.',
      origin: 'Nhãn sấy cao cấp nhất',
      harvest: 'Chọn quả đẹp, sấy kỹ',
      packaging: 'Hộp gỗ cao cấp, kèm túi xách',
      badge: 'Cao cấp',
      rating: 5,
      variants: [{ id: 'gift-box', name: 'Hộp quà 500g', price: 280000, stock: 50 }]
    }
  ];

  const allProducts = [...featuredProducts, ...freshLonganProducts, ...driedLonganProducts];

  return (
    <HelmetProvider>
      <Helmet>
        <html lang="vi" />
        <title>Nhãn Việt - Chuyên Nhãn Lồng Tươi & Nhãn Sấy Tự Nhiên | Giao Hàng Toàn Quốc</title>
        <meta name="description" content="Nhãn Việt chuyên cung cấp nhãn lồng tươi Hưng Yên, Bắc Giang - cùi dày, ngọt thanh, hạt nhỏ. Nhãn sấy dẻo tự nhiên, không chất bảo quản. Giao hàng toàn quốc, đảm bảo chất lượng." />
        <meta name="keywords" content="nhãn lồng tươi, nhãn lồng Hưng Yên, nhãn lồng Bắc Giang, nhãn sấy dẻo, nhãn sấy tự nhiên, mua nhãn online, nhãn tươi ngon, nhãn lồng chất lượng" />
        <meta name="author" content="Nhãn Việt" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Nhãn Việt - Chuyên Nhãn Lồng Tươi & Nhãn Sấy Tự Nhiên" />
        <meta property="og:description" content="Nhãn lồng tươi ngọt thanh, cùi dày, hạt nhỏ. Nhãn sấy dẻo thơm, không chất bảo quản. Giao hàng toàn quốc." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=1200" />
        <meta property="og:locale" content="vi_VN" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nhãn Việt - Chuyên Nhãn Lồng Tươi & Nhãn Sấy Tự Nhiên" />
        <meta name="twitter:description" content="Nhãn lồng tươi ngọt thanh, cùi dày, hạt nhỏ. Nhãn sấy dẻo thơm, không chất bảo quản." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=1200" />

        {/* Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Nhãn Việt",
            "description": "Chuyên cung cấp nhãn lồng tươi và nhãn sấy tự nhiên",
            "url": "https://nhanviet.vn",
            "logo": "https://nhanviet.vn/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+84-866-918-366",
              "contactType": "customer service",
              "areaServed": "VN",
              "availableLanguage": "Vietnamese"
            },
            "address": {
              "@type": "PostalAddress",
              "addressRegion": "Hưng Yên / Bắc Giang",
              "addressCountry": "VN"
            }
          })}
        </script>

        {/* Structured Data - Local Business */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Nhãn Việt",
            "image": "https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=1200",
            "priceRange": "$$",
            "telephone": "+84-866-918-366",
            "email": "cskh@nhanviet.vn",
            "address": {
              "@type": "PostalAddress",
              "addressRegion": "Hưng Yên / Bắc Giang",
              "addressCountry": "VN"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Top Bar */}
        <div className="bg-[#43A047] text-white py-2.5" role="banner">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
            <Truck className="w-4 h-4" aria-hidden="true" />
            <p className="text-sm">MIỄN PHÍ GIAO HÀNG CHO ĐƠN TỪ 499.000 VNĐ</p>
          </div>
        </div>

        {/* Header */}
        <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <button onClick={() => navigateToPage('home')} className="flex items-center gap-3 hover:opacity-80 transition-opacity" aria-label="Nhãn Việt - Về trang chủ">
              <div className="w-12 h-12 bg-[#DFF5E1] rounded-full flex items-center justify-center">
                <Leaf className="w-7 h-7 text-[#43A047]" aria-hidden="true" />
              </div>
              <div className="text-left">
                <span className="text-2xl text-[#1F5E3B]">Nhãn Việt</span>
                <p className="text-xs text-[#6B7280]">Tinh hoa nông sản Việt</p>
              </div>
            </button>

            {/* Navigation Menu */}
            <nav className="hidden md:flex flex-1 justify-center" aria-label="Menu chính">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <button
                    onClick={() => navigateToPage('home')}
                    className={`py-2 block transition-colors ${currentPage === 'home' ? 'text-[#43A047] font-medium' : 'text-[#1F2937] hover:text-[#43A047]'}`}
                    aria-current={currentPage === 'home' ? 'page' : undefined}
                  >
                    Trang chủ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { navigateToPage('home'); setTimeout(() => document.getElementById('fresh')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                    className="py-2 block text-[#1F2937] hover:text-[#43A047] transition-colors"
                  >
                    Nhãn tươi
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { navigateToPage('home'); setTimeout(() => document.getElementById('dried')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                    className="py-2 block text-[#1F2937] hover:text-[#43A047] transition-colors"
                  >
                    Nhãn sấy
                  </button>
                </li>
                {/* <li>
                  <button
                    onClick={() => navigateToPage('farm')}
                    className={`py-2 block transition-colors ${currentPage === 'farm' ? 'text-[#43A047] font-medium' : 'text-[#1F2937] hover:text-[#43A047]'}`}
                    aria-current={currentPage === 'farm' ? 'page' : undefined}
                  >
                    Vườn nhãn
                  </button>
                </li> */}
                <li>
                  <button
                    onClick={() => navigateToPage('contact')}
                    className={`py-2 block transition-colors ${currentPage === 'contact' ? 'text-[#43A047] font-medium' : 'text-[#1F2937] hover:text-[#43A047]'}`}
                    aria-current={currentPage === 'contact' ? 'page' : undefined}
                  >
                    Liên hệ
                  </button>
                </li>
              </ul>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#FFF8E7] rounded-full text-sm text-[#1F5E3B]">
                <Phone className="w-4 h-4" />
                <span>0866.918.366</span>
              </button>

              {user ? (
                <div ref={userMenuRef} className="hidden md:block relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-[#1F5E3B] hover:text-[#43A047] transition-colors"
                  >
                    <div className="w-8 h-8 bg-[#DFF5E1] rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-[#43A047]" />
                    </div>
                    <span className="text-sm">{user.name}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl py-2 z-50">
                      <div className="px-4 py-3 border-b border-[#E5E7EB]">
                        <p className="text-sm text-[#1F5E3B] font-medium">{user.name}</p>
                        <p className="text-xs text-[#6B7280]">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          navigateToPage('account');
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-[#1F2937] hover:bg-[#F7FFF8] transition-colors flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        <span>Tài khoản của tôi</span>
                      </button>
                      <button
                        onClick={() => {
                          navigateToPage('orders');
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-[#1F2937] hover:bg-[#F7FFF8] transition-colors flex items-center gap-2"
                      >
                        <Package className="w-4 h-4" />
                        <span>Đơn hàng của tôi</span>
                      </button>
                      <div className="border-t border-[#E5E7EB] mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2.5 text-left text-sm text-[#DC2626] hover:bg-[#FFF0F0] transition-colors"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="hidden md:flex items-center gap-2 text-[#1F5E3B] hover:text-[#43A047] transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm">Đăng nhập</span>
                </button>
              )}

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 text-[#1F5E3B] hover:text-[#43A047] transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden md:inline text-sm">Giỏ hàng</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 left-1.5 w-3.75 h-3.75 bg-[#43A047] text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-[#1F5E3B]"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full pl-11 pr-4 py-2.5 border border-[#E5E7EB] rounded-full"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      {currentPage === 'home' && (
        <main>
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
                <button className="px-8 py-3 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors text-sm font-medium">
                  Mua ngay
                </button>
                <button className="px-8 py-3 border-2 border-[#43A047] text-[#43A047] rounded-full hover:bg-[#43A047] hover:text-white transition-colors text-sm font-medium">
                  Xem sản phẩm
                </button>
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
              <img
                src="https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=800"
                alt="Nhãn lồng tươi Hưng Yên - Chùm nhãn chín vàng óng, cùi dày, ngọt thanh tự nhiên"
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-[#FAFAFA]" aria-labelledby="featured-products">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 id="featured-products" className="text-2xl text-[#1F5E3B] mb-3">Sản phẩm nổi bật</h2>
            <p className="text-base text-[#6B7280]">Những lựa chọn được khách hàng yêu thích nhất</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={() => {
                  const defaultVariant = product.variants && product.variants.length === 1 ? product.variants[0] : null;
                  addToCart(product, defaultVariant);
                }}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Fresh Longan Section */}
      <section id="fresh" className="py-16 bg-[#F7FFF8]" aria-labelledby="fresh-longan">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 id="fresh-longan" className="text-2xl text-[#1F5E3B] mb-6">Nhãn lồng tươi từ vườn</h2>
            <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeTab === 'all'
                    ? 'bg-[#43A047] text-white'
                    : 'bg-white text-[#1F2937] hover:bg-[#DFF5E1]'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setActiveTab('kg')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeTab === 'kg'
                    ? 'bg-[#43A047] text-white'
                    : 'bg-white text-[#1F2937] hover:bg-[#DFF5E1]'
                }`}
              >
                Theo kg
              </button>
              <button
                onClick={() => setActiveTab('bunch')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeTab === 'bunch'
                    ? 'bg-[#43A047] text-white'
                    : 'bg-white text-[#1F2937] hover:bg-[#DFF5E1]'
                }`}
              >
                Nguyên chùm
              </button>
              <button
                onClick={() => setActiveTab('gift')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeTab === 'gift'
                    ? 'bg-[#43A047] text-white'
                    : 'bg-white text-[#1F2937] hover:bg-[#DFF5E1]'
                }`}
              >
                Hộp quà
              </button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {freshLonganProducts.map(product => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={() => {
                  const defaultVariant = product.variants && product.variants.length === 1 ? product.variants[0] : null;
                  addToCart(product, defaultVariant);
                }}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Dried Longan Section */}
      <section id="dried" className="py-16 bg-white" aria-labelledby="dried-longan">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 id="dried-longan" className="text-2xl text-[#1F5E3B] mb-3">Nhãn sấy dẻo thơm</h2>
            <p className="text-base text-[#6B7280] mb-8">Sấy tự nhiên, giữ nguyên vị ngọt thanh</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {driedLonganProducts.map(product => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={() => {
                  const defaultVariant = product.variants && product.variants.length === 1 ? product.variants[0] : null;
                  addToCart(product, defaultVariant);
                }}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="py-16 bg-gradient-to-r from-[#FFF8E7] to-[#DFF5E1]" aria-labelledby="promotion">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white rounded-3xl p-8 md:p-12 shadow-lg">
            <div className="flex-1">
              <div className="inline-block px-4 py-1 bg-[#F4B942] text-white rounded-full text-sm mb-4">
                Ưu đãi đặc biệt
              </div>
              <h2 id="promotion" className="text-2xl text-[#1F5E3B] mb-3">Ưu đãi dành cho khách mới</h2>
              <p className="text-lg text-[#1F2937] mb-4">Giảm 10% cho đơn hàng đầu tiên</p>
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#DFF5E1] rounded-lg">
                <span className="text-base text-[#1F5E3B]">Mã:</span>
                <span className="text-base text-[#43A047] font-semibold">NHANVIET10</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <button className="px-8 py-3 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors text-sm font-medium">
                Mua sắm ngay
              </button>
            </div>
          </div>
        </div>
      </section>
        </main>
      )}

      {currentPage === 'product-detail' && selectedProduct && (
        <ProductDetailPage
          product={selectedProduct}
          relatedProducts={allProducts.filter(p => p.id !== selectedProduct.id && p.category === selectedProduct.category)}
          onBack={handleBackFromProduct}
          onAddToCart={addToCart}
          onProductClick={handleProductClick}
        />
      )}

      {currentPage === 'contact' && (
        <main>
          <ContactPage />
        </main>
      )}

      {currentPage === 'account' && user && (
        <main>
          <AccountPage user={user} onUpdateUser={handleUpdateUser} />
        </main>
      )}

      {currentPage === 'orders' && user && (
        <main>
          <OrdersPage />
        </main>
      )}

      {/* Footer */}
      <footer className="bg-[#F7FFF8] border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#43A047] rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <span className="text-lg text-[#1F5E3B]">Nhãn Việt</span>
              </div>
              <p className="text-sm text-[#6B7280]">
                Chuyên cung cấp nhãn lồng tươi và nhãn sấy tự nhiên,
                chọn lọc từ những vườn nhãn chất lượng.
              </p>
            </div>
            <nav aria-label="Về chúng tôi">
              <h2 className="text-base text-[#1F5E3B] mb-4 font-medium">Về chúng tôi</h2>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                {/* <li><button onClick={() => navigateToPage('farm')} className="hover:text-[#43A047] transition-colors">Câu chuyện thương hiệu</button></li>
                <li><button onClick={() => navigateToPage('farm')} className="hover:text-[#43A047] transition-colors">Vườn nhãn</button></li> */}
                <li><button onClick={() => navigateToPage('contact')} className="hover:text-[#43A047] transition-colors">Liên hệ</button></li>
              </ul>
            </nav>
            <nav aria-label="Chính sách">
              <h2 className="text-base text-[#1F5E3B] mb-4 font-medium">Chính sách</h2>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li><a href="#" className="hover:text-[#43A047] transition-colors">Chính sách giao hàng</a></li>
                <li><a href="#" className="hover:text-[#43A047] transition-colors">Chính sách đổi trả</a></li>
                <li><a href="#" className="hover:text-[#43A047] transition-colors">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-[#43A047] transition-colors">Hướng dẫn mua hàng</a></li>
              </ul>
            </nav>
            <address className="not-italic">
              <h2 className="text-base text-[#1F5E3B] mb-4 font-medium">Liên hệ</h2>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  <a href="tel:+84866918366" className="hover:text-[#43A047] transition-colors">0866.918.366</a>
                </li>
                <li>
                  <a href="mailto:cskh@nhanviet.vn" className="hover:text-[#43A047] transition-colors">Email: cskh@nhanviet.vn</a>
                </li>
                <li>Địa chỉ: Hưng Yên / Bắc Giang, Việt Nam</li>
              </ul>
            </address>
          </div>
          <div className="border-t border-[#E5E7EB] mt-8 pt-8 text-center text-sm text-[#6B7280]">
            <p>© 2026 Nhãn Việt. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} />
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        setItems={setCartItems}
        total={cartTotal}
      />

      {/* Floating Contact Buttons */}
      <FloatingContactButtons />
      </div>
    </HelmetProvider>
  );
}