'use client';
import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { createClient } from '@/lib/supabase/client';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { name: string; email: string }) => void;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const TAB_CLASSES = (active: boolean) =>
  `flex-1 px-4 py-2 rounded-full text-sm transition-colors ${
    active ? 'bg-[#43A047] text-white' : 'bg-[#F7FFF8] text-[#1F2937]'
  }`;

const INPUT_CLASS =
  'w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43A047]';

const SUBMIT_CLASS =
  'w-full px-4 py-3 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed';

const OAUTH_CLASS =
  'w-full px-4 py-3 border-2 border-[#E5E7EB] text-[#1F2937] rounded-full hover:bg-[#F7FFF8] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed';

const DIVIDER = (
  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-[#E5E7EB]" />
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-2 bg-white text-[#6B7280]">hoặc</span>
    </div>
  </div>
);

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'guest'>('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', phone: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const supabase = createClient();

  function clear() { setError(''); setSuccess(''); }

  function switchTab(tab: typeof activeTab) {
    setActiveTab(tab);
    clear();
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    clear();

    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });

    setLoading(false);

    if (err) {
      if (err.message.includes('Invalid login credentials')) {
        setError('Email hoặc mật khẩu không đúng.');
      } else if (err.message.includes('Email not confirmed')) {
        setError('Vui lòng xác nhận email trước khi đăng nhập.');
      } else {
        setError('Đăng nhập thất bại. Vui lòng thử lại.');
      }
      return;
    }

    if (data.user) {
      const name =
        data.user.user_metadata?.full_name ||
        data.user.user_metadata?.name ||
        data.user.email ||
        'Người dùng';
      onLogin({ name, email: data.user.email ?? '' });
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    clear();

    const { error: err } = await supabase.auth.signUp({
      email: registerData.email,
      password: registerData.password,
      options: {
        data: {
          full_name: registerData.name,
          phone: registerData.phone,
        },
      },
    });

    setLoading(false);

    if (err) {
      if (err.message.includes('already registered') || err.message.includes('already been registered')) {
        setError('Email này đã được đăng ký. Vui lòng đăng nhập.');
      } else if (err.message.includes('Password should')) {
        setError('Mật khẩu phải có ít nhất 6 ký tự.');
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại.');
      }
      return;
    }

    setSuccess('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.');
    setRegisterData({ name: '', phone: '', email: '', password: '' });
  }

  async function handleOAuth(provider: 'google' | 'facebook') {
    setLoading(true);
    clear();

    const { error: err } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });

    if (err) {
      setLoading(false);
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
    }
    // On success the browser navigates away — no setLoading(false) needed.
  }

  async function handleForgotPassword() {
    if (!loginData.email) {
      setError('Vui lòng nhập email để lấy lại mật khẩu.');
      return;
    }
    setLoading(true);
    clear();

    const { error: err } = await supabase.auth.resetPasswordForEmail(loginData.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    setLoading(false);

    if (err) {
      setError('Không thể gửi email. Vui lòng thử lại.');
      return;
    }

    setSuccess('Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.');
  }

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
              <button onClick={() => switchTab('login')} className={TAB_CLASSES(activeTab === 'login')}>
                Đăng nhập
              </button>
              <button onClick={() => switchTab('register')} className={TAB_CLASSES(activeTab === 'register')}>
                Đăng ký
              </button>
              <button onClick={() => switchTab('guest')} className={TAB_CLASSES(activeTab === 'guest')}>
                Khách
              </button>
            </div>

            {error && (
              <p role="alert" className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">
                {error}
              </p>
            )}
            {success && (
              <p role="status" className="mb-4 text-sm text-green-700 bg-green-50 px-4 py-2.5 rounded-xl">
                {success}
              </p>
            )}

            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="Nhập địa chỉ email"
                    className={INPUT_CLASS}
                    autoComplete="email"
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
                    className={INPUT_CLASS}
                    autoComplete="current-password"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <input type="checkbox" className="rounded" />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-[#43A047] hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <button type="submit" disabled={loading} className={SUBMIT_CLASS}>
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Đăng nhập
                </button>

                {DIVIDER}

                <button type="button" disabled={loading} onClick={() => handleOAuth('google')} className={OAUTH_CLASS}>
                  <GoogleIcon />
                  Đăng nhập với Google
                </button>
                <button type="button" disabled={loading} onClick={() => handleOAuth('facebook')} className={OAUTH_CLASS}>
                  <FacebookIcon />
                  Đăng nhập với Facebook
                </button>
              </form>
            )}

            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Họ tên</label>
                  <input
                    type="text"
                    required
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    placeholder="Nhập họ và tên"
                    className={INPUT_CLASS}
                    autoComplete="name"
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
                    className={INPUT_CLASS}
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="Nhập địa chỉ email"
                    className={INPUT_CLASS}
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Mật khẩu</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="Ít nhất 6 ký tự"
                    className={INPUT_CLASS}
                    autoComplete="new-password"
                  />
                </div>
                <button type="submit" disabled={loading} className={SUBMIT_CLASS}>
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Tạo tài khoản
                </button>

                {DIVIDER}

                <button type="button" disabled={loading} onClick={() => handleOAuth('google')} className={OAUTH_CLASS}>
                  <GoogleIcon />
                  Đăng ký với Google
                </button>
                <button type="button" disabled={loading} onClick={() => handleOAuth('facebook')} className={OAUTH_CLASS}>
                  <FacebookIcon />
                  Đăng ký với Facebook
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
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Địa chỉ giao hàng</label>
                  <textarea
                    placeholder="Nhập địa chỉ chi tiết"
                    rows={3}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#1F2937] mb-2">Ghi chú (tùy chọn)</label>
                  <textarea
                    placeholder="Ghi chú cho đơn hàng"
                    rows={2}
                    className={INPUT_CLASS}
                  />
                </div>
                <button className={SUBMIT_CLASS}>
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
