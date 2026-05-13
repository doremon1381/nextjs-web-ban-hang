import type { Metadata } from 'next';
import { ContactPage } from '@/components/ContactPage';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: 'Liên Hệ',
  description: 'Liên hệ với Nhãn Việt để được tư vấn về nhãn lồng tươi và nhãn sấy. Hotline: 0866.918.366',
};

export default function LienHePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Trang chủ', href: '/' },
        { name: 'Liên hệ', href: '/lien-he' },
      ]} />
      <ContactPage />
    </>
  );
}
