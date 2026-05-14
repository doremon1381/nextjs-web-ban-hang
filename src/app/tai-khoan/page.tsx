import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AccountPage } from '@/components/AccountPage';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tài Khoản',
  description: 'Quản lý thông tin tài khoản của bạn tại Nhãn Việt.',
};

export default async function TaiKhoanPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/?login=1');

  return <AccountPage />;
}
