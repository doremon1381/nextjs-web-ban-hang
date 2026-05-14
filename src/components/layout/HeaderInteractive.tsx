'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, User, Phone, Leaf, Package, Menu, X } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { LoginModal } from '@/components/LoginModal';
import { createClient } from '@/lib/supabase/client';

interface Props {
  initialUser: { name: string; email: string } | null;
}

export function HeaderInteractive({ initialUser }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { count, setIsOpen: setCartOpen } = useCart();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(initialUser);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Auto-open login modal when the middleware redirected here with ?login=1,
  // then clean the query string so Back/refresh don't re-trigger it.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === '1') {
      setIsLoginOpen(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
    if (params.get('error') === 'auth') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Subscribe to auth state changes for cross-tab sync and OAuth redirect updates.
  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        setUser({
          name: u.user_metadata?.full_name || u.user_metadata?.name || u.email || 'Người dùng',
          email: u.email ?? '',
        });
      } else {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData);
    setIsLoginOpen(false);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setShowUserMenu(false);
    // Re-fetch server components so protected pages and Header re-read auth state.
    router.refresh();
  };

  const navLinkClass = (href: string) =>
    `py-2 block transition-colors ${pathname === href ? 'text-[#43A047] font-medium' : 'text-[#1F2937] hover:text-[#43A047]'}`;

  return (
    <>
      <div className="bg-[#43A047] text-white py-2.5" role="banner">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
          <span className="text-sm">MIỄN PHÍ GIAO HÀNG CHO ĐƠN TỪ 499.000 VNĐ</span>
        </div>
      </div>

      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" aria-label="Nhãn Việt - Về trang chủ">
              <div className="w-12 h-12 bg-[#DFF5E1] rounded-full flex items-center justify-center">
                <Leaf className="w-7 h-7 text-[#43A047]" aria-hidden="true" />
              </div>
              <div className="text-left">
                <span className="text-2xl text-[#1F5E3B]">Nhãn Việt</span>
                <p className="text-xs text-[#6B7280]">Tinh hoa nông sản Việt</p>
              </div>
            </Link>

            <nav className="hidden md:flex flex-1 justify-center" aria-label="Menu chính">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <Link href="/" className={navLinkClass('/')} aria-current={pathname === '/' ? 'page' : undefined}>
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link href="/san-pham/nhan-tuoi" className={navLinkClass('/san-pham/nhan-tuoi')}>
                    Nhãn tươi
                  </Link>
                </li>
                <li>
                  <Link href="/san-pham/nhan-say" className={navLinkClass('/san-pham/nhan-say')}>
                    Nhãn sấy
                  </Link>
                </li>
                <li>
                  <Link href="/lien-he" className={navLinkClass('/lien-he')} aria-current={pathname === '/lien-he' ? 'page' : undefined}>
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              <a href="tel:+84866918366" className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#FFF8E7] rounded-full text-sm text-[#1F5E3B]">
                <Phone className="w-4 h-4" />
                <span>0866.918.366</span>
              </a>

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
                      <Link
                        href="/tai-khoan"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full px-4 py-2.5 text-left text-sm text-[#1F2937] hover:bg-[#F7FFF8] transition-colors flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        <span>Tài khoản của tôi</span>
                      </Link>
                      <Link
                        href="/tai-khoan/don-hang"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full px-4 py-2.5 text-left text-sm text-[#1F2937] hover:bg-[#F7FFF8] transition-colors flex items-center gap-2"
                      >
                        <Package className="w-4 h-4" />
                        <span>Đơn hàng của tôi</span>
                      </Link>
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
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 text-[#1F5E3B] hover:text-[#43A047] transition-colors"
                aria-label="Giỏ hàng"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden md:inline text-sm">Giỏ hàng</span>
                {count > 0 && (
                  <span className="absolute -top-1 left-1.5 w-4 h-4 bg-[#43A047] text-white text-xs rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-[#1F5E3B]"
                aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-[#E5E7EB] bg-white" aria-label="Menu di động">
            <ul className="px-4 py-2 space-y-1 text-sm">
              <li>
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`${navLinkClass('/')} block py-3`}>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/san-pham/nhan-tuoi" onClick={() => setIsMobileMenuOpen(false)} className={`${navLinkClass('/san-pham/nhan-tuoi')} block py-3`}>
                  Nhãn tươi
                </Link>
              </li>
              <li>
                <Link href="/san-pham/nhan-say" onClick={() => setIsMobileMenuOpen(false)} className={`${navLinkClass('/san-pham/nhan-say')} block py-3`}>
                  Nhãn sấy
                </Link>
              </li>
              <li>
                <Link href="/lien-he" onClick={() => setIsMobileMenuOpen(false)} className={`${navLinkClass('/lien-he')} block py-3`}>
                  Liên hệ
                </Link>
              </li>
              {!user && (
                <li>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); setIsLoginOpen(true); }}
                    className="w-full text-left py-3 text-[#1F2937] hover:text-[#43A047] transition-colors"
                  >
                    Đăng nhập
                  </button>
                </li>
              )}
            </ul>
          </nav>
        )}
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} />
    </>
  );
}
