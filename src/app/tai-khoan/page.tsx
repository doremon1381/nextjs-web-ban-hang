import type { Metadata } from 'next';
import { AccountPage } from '@/components/AccountPage';

export const metadata: Metadata = {
  title: 'Tài Khoản',
  description: 'Quản lý thông tin tài khoản của bạn tại Nhãn Việt.',
};

export default function TaiKhoanPage() {
  return <AccountPage />;
}
