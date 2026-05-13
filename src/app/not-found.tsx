import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl text-[#43A047] font-bold mb-4">404</h1>
        <h2 className="text-2xl text-[#1F5E3B] mb-4">Trang không tồn tại</h2>
        <p className="text-[#6B7280] mb-8">Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-[#43A047] text-white rounded-full hover:bg-[#388E3C] transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
