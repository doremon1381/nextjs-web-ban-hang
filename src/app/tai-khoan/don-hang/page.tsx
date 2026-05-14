import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { OrdersPage } from '@/components/OrdersPage';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Đơn Hàng Của Tôi',
  description: 'Xem và theo dõi đơn hàng của bạn tại Nhãn Việt.',
};

export default async function DonHangPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/?login=1');

  return <OrdersPage />;
}
