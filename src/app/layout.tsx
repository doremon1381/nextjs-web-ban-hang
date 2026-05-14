import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/cart/CartProvider';
import { CartMerge } from '@/components/cart/CartMerge';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartModal } from '@/components/CartModal';
import { FloatingContactButtons } from '@/components/FloatingContactButtons';

const beVietnam = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700'],
  subsets: ['vietnamese', 'latin'],
  display: 'swap',
  variable: '--font-be-vietnam',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Nhãn Việt',
    default: 'Nhãn Việt - Chuyên Nhãn Lồng Tươi & Nhãn Sấy Tự Nhiên | Giao Hàng Toàn Quốc',
  },
  description:
    'Nhãn Việt chuyên cung cấp nhãn lồng tươi Hưng Yên, Bắc Giang - cùi dày, ngọt thanh, hạt nhỏ. Nhãn sấy dẻo tự nhiên, không chất bảo quản. Giao hàng toàn quốc, đảm bảo chất lượng.',
  keywords: [
    'nhãn lồng tươi',
    'nhãn lồng Hưng Yên',
    'nhãn lồng Bắc Giang',
    'nhãn sấy dẻo',
    'nhãn sấy tự nhiên',
    'mua nhãn online',
    'nhãn tươi ngon',
    'nhãn lồng chất lượng',
  ],
  authors: [{ name: 'Nhãn Việt' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nhanviet.vn'),
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    title: 'Nhãn Việt - Chuyên Nhãn Lồng Tươi & Nhãn Sấy Tự Nhiên',
    description:
      'Nhãn lồng tươi ngọt thanh, cùi dày, hạt nhỏ. Nhãn sấy dẻo thơm, không chất bảo quản. Giao hàng toàn quốc.',
    images: [{ url: '/images/products/longan-fresh-1.jpg', width: 1200, height: 800, alt: 'Nhãn lồng tươi Hưng Yên' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nhãn Việt - Chuyên Nhãn Lồng Tươi & Nhãn Sấy Tự Nhiên',
    description:
      'Nhãn lồng tươi ngọt thanh, cùi dày, hạt nhỏ. Nhãn sấy dẻo thơm, không chất bảo quản.',
    images: ['/images/products/longan-fresh-1.jpg'],
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Nhãn Việt',
  description: 'Chuyên cung cấp nhãn lồng tươi và nhãn sấy tự nhiên',
  url: 'https://nhanviet.vn',
  logo: 'https://nhanviet.vn/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+84-866-918-366',
    contactType: 'customer service',
    areaServed: 'VN',
    availableLanguage: 'Vietnamese',
  },
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Hưng Yên / Bắc Giang',
    addressCountry: 'VN',
  },
};

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Nhãn Việt',
  image: 'https://images.unsplash.com/photo-1755971103481-3fd82333a80a?w=1200',
  priceRange: '$$',
  telephone: '+84-866-918-366',
  email: 'cskh@nhanviet.vn',
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Hưng Yên / Bắc Giang',
    addressCountry: 'VN',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={beVietnam.variable}>
      <body className="font-[family-name:var(--font-be-vietnam)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <CartProvider>
          <CartMerge />
          <Header />
          <main>{children}</main>
          <Footer />
          <CartModal />
          <FloatingContactButtons />
        </CartProvider>
      </body>
    </html>
  );
}
