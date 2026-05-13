'use client';
import { useState } from 'react';
import { X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { name: string; email: string }) => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'guest'>('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', phone: '', email: '', password: '' });

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto z-50 shadow-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-2xl text-[#1F5E3B]">
                {activeTab === 'login' && 'Đăng nhập'}
                {activeTab === 'register' && 'Tạo tài khoản'}
                {activeTab === 'guest' && 'Mua với tư cách khách'}
              </Dialog.Title>
              <Dialog.Close className="text-[#6B7280] hover:text-[#1F2937]">
                <X className="w-6 h-6" />
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">
              {activeTab === 'login' && 'Đăng nhập vào tài khoản của bạn'}
              {activeTab === 'register' && 'Tạo tài khoản mới'}
              {activeTab === 'guest' && 'Tiếp tục mua hàng với tư cách khách'}
            </Dialog.Description>

            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 px-4 py-2 rounded-full text-sm transition-colors ${
                  activeTab === 'login'
                    ? 'bg-[#43A047] text-white'
                    : 'bg-[#F7FFF8] text-[#1F2937]'
                }`}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 px-4 py-2 rounded-full text-sm transition-colors ${
                  activeTab === 'register'
                    ? 'bg-[#43A047] text-white'
                    : 'bg-[#F7FFF8] text-[#1F2937]'
                }`}
              >
                Đăng ký
              </button>
              <button
                onClick={() => setActiveTab('guest')}
                className={`flex-1 px-4 py-2 rounded-full text-sm transition-colors ${
                  activeTab === 'guest'
                    ? 'bg-[#43A047] text-white'
                    : 'bg-[#F7FFF8] text-[#1F2937]'
                }`}
              >
                Khách
              </button>
            </div>

            {activeTab === 'login' && (
              <form onSubmit={(e) => {
                e.preventDefault();
                onLogin({ name: 'Người dùng', email: loginData.email });
              }} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Email / Số điện thoại</label>
                  <input
                    type="text"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="Nhập email hoặc số điện thoại"
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Mật khẩu</label>
                  <input
                    type="password"
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Nhập mật khẩu"
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <input type="checkbox" className="rounded" />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                  <a href="#" className="text-sm text-[#43A047] hover:underline">
                    Quên mật khẩu?
                  </a>
                </div>
                <button type="submit" className="w-full px-4 py-3 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors">
                  Đăng nhập
                </button>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E5E7EB]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-[#6B7280]">hoặc</span>
                  </div>
                </div>
                <button type="button" className="w-full px-4 py-3 border-2 border-[#E5E7EB] text-[#1F2937] rounded-full hover:bg-[#F7FFF8] transition-colors">
                  Đăng nhập với Google
                </button>
              </form>
            )}

            {activeTab === 'register' && (
              <form onSubmit={(e) => {
                e.preventDefault();
                onLogin({ name: registerData.name, email: registerData.email });
              }} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Họ tên</label>
                  <input
                    type="text"
                    required
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    placeholder="Nhập họ và tên"
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    required
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    placeholder="Nhập số điện thoại"
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="Nhập email"
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Mật khẩu</label>
                  <input
                    type="password"
                    required
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="Nhập mật khẩu"
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                  />
                </div>
                <button type="submit" className="w-full px-4 py-3 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors">
                  Tạo tài khoản
                </button>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E5E7EB]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-[#6B7280]">hoặc</span>
                  </div>
                </div>
                <button type="button" className="w-full px-4 py-3 border-2 border-[#E5E7EB] text-[#1F2937] rounded-full hover:bg-[#F7FFF8] transition-colors">
                  Đăng ký với Google
                </button>
              </form>
            )}

            {activeTab === 'guest' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Họ tên</label>
                  <input
                    type="text"
                    placeholder="Nhập họ và tên"
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Địa chỉ giao hàng</label>
                  <textarea
                    placeholder="Nhập địa chỉ chi tiết"
                    rows={3}
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Ghi chú (tùy chọn)</label>
                  <textarea
                    placeholder="Ghi chú cho đơn hàng"
                    rows={2}
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                  />
                </div>
                <button className="w-full px-4 py-3 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors">
                  Tiếp tục thanh toán
                </button>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
