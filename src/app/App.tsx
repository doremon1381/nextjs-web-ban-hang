import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, Search, Phone, Truck, Leaf, Shield, Package, Star, Menu, X, ChevronRight } from 'lucide-react';
import { LoginModal } from './components/LoginModal';
import { CartModal } from './components/CartModal';
import { ProductCard } from './components/ProductCard';
import { CategoryCard } from './components/CategoryCard';
import { FarmPage } from './components/FarmPage';
import { ContactPage } from './components/ContactPage';
import { AccountPage } from './components/AccountPage';
import { OrdersPage } from './components/OrdersPage';
import { FloatingContactButtons } from './components/FloatingContactButtons';

interface CartItem {
  id: string;
  name: string;
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
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const addToCart = (product: any) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
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
      name: 'Nhãn lồng tươi loại 1 - 1kg',
      description: 'Cùi dày, hạt nhỏ, ngọt thanh',
      price: 69000,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=500',
      badge: 'Bán chạy',
      rating: 5
    },
    {
      id: '2',
      name: 'Nhãn lồng tươi nguyên chùm - 2kg',
      description: 'Tươi ngon, phù hợp ăn gia đình',
      price: 135000,
      oldPrice: 150000,
      unit: 'túi',
      image: 'https://images.unsplash.com/photo-1727761801419-d19129d3253e?w=500',
      rating: 5
    },
    {
      id: '3',
      name: 'Nhãn sấy dẻo - 500g',
      description: 'Dẻo thơm, ngọt tự nhiên',
      price: 125000,
      unit: 'túi',
      image: 'https://images.unsplash.com/photo-1597975371283-5461cdf69d5e?w=500',
      badge: 'Mới',
      rating: 5
    },
    {
      id: '4',
      name: 'Combo nhãn tươi + nhãn sấy',
      description: 'Phù hợp dùng thử hoặc biếu tặng',
      price: 199000,
      oldPrice: 240000,
      unit: 'combo',
      image: 'https://images.unsplash.com/photo-1727761800233-1db40fa3f01f?w=500',
      badge: 'Tiết kiệm 17%',
      rating: 5
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
      rating: 5
    },
    {
      id: '6',
      name: 'Nhãn lồng tươi 2kg',
      description: 'Túi gia đình tiết kiệm',
      price: 135000,
      unit: 'túi',
      image: 'https://images.unsplash.com/photo-1755971103909-c2710ea5aad8?w=500',
      rating: 5
    },
    {
      id: '7',
      name: 'Nhãn nguyên chùm 3kg',
      description: 'Tươi từ vườn, thu hoạch trong ngày',
      price: 198000,
      unit: 'chùm',
      image: 'https://images.unsplash.com/photo-1727761799967-dbb46b23baef?w=500',
      rating: 5
    },
    {
      id: '8',
      name: 'Hộp nhãn lồng cao cấp',
      description: 'Đóng gói sang trọng, phù hợp biếu tặng',
      price: 350000,
      unit: 'hộp',
      image: 'https://images.unsplash.com/photo-1727761800109-14e6e293680f?w=500',
      badge: 'Quà tặng',
      rating: 5
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
      rating: 5
    },
    {
      id: '10',
      name: 'Nhãn sấy dẻo 500g',
      description: 'Dẻo thơm, ngọt thanh, giữ nguyên vị tự nhiên',
      price: 125000,
      unit: 'túi',
      image: 'https://images.unsplash.com/photo-1755971103490-a70bf35f8a4f?w=500',
      badge: 'Bán chạy',
      rating: 5
    },
    {
      id: '11',
      name: 'Nhãn sấy khô 500g',
      description: 'Sấy khô hoàn toàn, bảo quản lâu',
      price: 135000,
      unit: 'túi',
      image: 'https://images.unsplash.com/photo-1755971103541-402280c3befc?w=500',
      rating: 5
    },
    {
      id: '12',
      name: 'Hộp quà nhãn sấy cao cấp',
      description: 'Hộp gỗ sang trọng, phù hợp tặng đối tác',
      price: 280000,
      unit: 'hộp',
      image: 'https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=500',
      badge: 'Cao cấp',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-[#43A047] text-white py-2.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
          <Truck className="w-4 h-4" />
          <p className="text-sm">MIỄN PHÍ GIAO HÀNG CHO ĐƠN TỪ 499.000 VNĐ</p>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <button onClick={() => navigateToPage('home')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 bg-[#DFF5E1] rounded-full flex items-center justify-center">
                <Leaf className="w-7 h-7 text-[#43A047]" />
              </div>
              <div className="text-left">
                <h1 className="text-xl text-[#1F5E3B] font-semibold">Nhãn Việt</h1>
                <p className="text-xs text-[#6B7280]">Tinh hoa nông sản Việt</p>
              </div>
            </button>

            {/* Navigation Menu */}
            <nav className="hidden md:flex flex-1 justify-center">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <button
                    onClick={() => navigateToPage('home')}
                    className={`py-2 block transition-colors ${currentPage === 'home' ? 'text-[#43A047] font-medium' : 'text-[#1F2937] hover:text-[#43A047]'}`}
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
                  >
                    Vườn nhãn
                  </button>
                </li> */}
                <li>
                  <button
                    onClick={() => navigateToPage('contact')}
                    className={`py-2 block transition-colors ${currentPage === 'contact' ? 'text-[#43A047] font-medium' : 'text-[#1F2937] hover:text-[#43A047]'}`}
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
        <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#DFF5E1] to-[#FFF8E7] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl text-[#1F5E3B] mb-6">
                Chuyên nhãn lồng tươi & nhãn sấy tự nhiên
              </h2>
              <p className="text-lg text-[#1F2937] mb-8 leading-relaxed">
                Nhãn lồng ngọt thanh, cùi dày, hạt nhỏ. Nhãn sấy dẻo thơm, không chất bảo quản,
                phù hợp ăn gia đình và làm quà biếu.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <button className="px-8 py-3 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors">
                  Mua ngay
                </button>
                <button className="px-8 py-3 border-2 border-[#43A047] text-[#43A047] rounded-full hover:bg-[#43A047] hover:text-white transition-colors">
                  Xem sản phẩm
                </button>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-[#1F5E3B]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-[#43A047]" />
                  </div>
                  <span>Thu hoạch trong ngày</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Package className="w-4 h-4 text-[#43A047]" />
                  </div>
                  <span>Đóng gói cẩn thận</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Truck className="w-4 h-4 text-[#43A047]" />
                  </div>
                  <span>Giao hàng toàn quốc</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=800"
                alt="Nhãn lồng tươi"
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl text-[#1F5E3B] mb-3">Sản phẩm nổi bật</h3>
            <p className="text-[#6B7280]">Những lựa chọn được khách hàng yêu thích nhất</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Fresh Longan Section */}
      <section id="fresh" className="py-16 bg-[#F7FFF8]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-3xl text-[#1F5E3B] mb-6">Nhãn lồng tươi từ vườn</h3>
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
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Dried Longan Section */}
      <section id="dried" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl text-[#1F5E3B] mb-3">Nhãn sấy dẻo thơm</h3>
            <p className="text-[#6B7280] mb-8">Sấy tự nhiên, giữ nguyên vị ngọt thanh</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {driedLonganProducts.map(product => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="py-16 bg-gradient-to-r from-[#FFF8E7] to-[#DFF5E1]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white rounded-3xl p-8 md:p-12 shadow-lg">
            <div className="flex-1">
              <div className="inline-block px-4 py-1 bg-[#F4B942] text-white rounded-full text-sm mb-4">
                Ưu đãi đặc biệt
              </div>
              <h3 className="text-3xl text-[#1F5E3B] mb-3">Ưu đãi dành cho khách mới</h3>
              <p className="text-lg text-[#1F2937] mb-4">Giảm 10% cho đơn hàng đầu tiên</p>
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#DFF5E1] rounded-lg">
                <span className="text-[#1F5E3B]">Mã:</span>
                <span className="text-[#43A047] font-semibold">NHANVIET10</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <button className="px-8 py-3 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors">
                Mua sắm ngay
              </button>
            </div>
          </div>
        </div>
      </section>
        </>
      )}

      {currentPage === 'farm' && (
        <FarmPage onNavigateHome={() => navigateToPage('home')} />
      )}

      {currentPage === 'contact' && (
        <ContactPage />
      )}

      {currentPage === 'account' && user && (
        <AccountPage user={user} onUpdateUser={handleUpdateUser} />
      )}

      {currentPage === 'orders' && user && (
        <OrdersPage />
      )}

      {/* Footer */}
      <footer className="bg-[#F7FFF8] border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#43A047] rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg text-[#1F5E3B]">Nhãn Việt</h4>
              </div>
              <p className="text-sm text-[#6B7280]">
                Chuyên cung cấp nhãn lồng tươi và nhãn sấy tự nhiên,
                chọn lọc từ những vườn nhãn chất lượng.
              </p>
            </div>
            <div>
              <h4 className="text-[#1F5E3B] mb-4">Về chúng tôi</h4>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                {/* <li><button onClick={() => navigateToPage('farm')} className="hover:text-[#43A047] transition-colors">Câu chuyện thương hiệu</button></li>
                <li><button onClick={() => navigateToPage('farm')} className="hover:text-[#43A047] transition-colors">Vườn nhãn</button></li> */}
                <li><button onClick={() => navigateToPage('contact')} className="hover:text-[#43A047] transition-colors">Liên hệ</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#1F5E3B] mb-4">Chính sách</h4>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li><a href="#" className="hover:text-[#43A047]">Chính sách giao hàng</a></li>
                <li><a href="#" className="hover:text-[#43A047]">Chính sách đổi trả</a></li>
                <li><a href="#" className="hover:text-[#43A047]">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-[#43A047]">Hướng dẫn mua hàng</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#1F5E3B] mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>0866.918.366</span>
                </li>
                <li>Email: cskh@nhanviet.vn</li>
                <li>Địa chỉ: Hưng Yên / Bắc Giang, Việt Nam</li>
              </ul>
            </div>
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
  );
}