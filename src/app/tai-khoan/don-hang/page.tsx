import type { Metadata } from 'next';
import { OrdersPage } from '@/components/OrdersPage';

export const metadata: Metadata = {
  title: 'Đơn Hàng Của Tôi',
  description: 'Xem và theo dõi đơn hàng của bạn tại Nhãn Việt.',
};

export default function DonHangPage() {
  return <OrdersPage />;
}
