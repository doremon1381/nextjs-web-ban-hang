import Link from 'next/link';
import { Leaf, Phone } from 'lucide-react';

export function Footer() {
  return (
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
              <li>
                <Link href="/lien-he" className="hover:text-[#43A047] transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Chính sách">
            <h2 className="text-base text-[#1F5E3B] mb-4 font-medium">Chính sách</h2>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li><span className="hover:text-[#43A047] transition-colors cursor-default">Chính sách giao hàng</span></li>
              <li><span className="hover:text-[#43A047] transition-colors cursor-default">Chính sách đổi trả</span></li>
              <li><span className="hover:text-[#43A047] transition-colors cursor-default">Chính sách bảo mật</span></li>
              <li><span className="hover:text-[#43A047] transition-colors cursor-default">Hướng dẫn mua hàng</span></li>
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
  );
}
