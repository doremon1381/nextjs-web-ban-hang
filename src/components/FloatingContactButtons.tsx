import { Phone, MessageCircle, Facebook } from 'lucide-react';

export function FloatingContactButtons() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {/* Phone Button */}
      <a
        href="tel:0866918366"
        className="w-14 h-14 bg-[#43A047] hover:bg-[#388E3C] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200 group relative"
        aria-label="Gọi điện"
      >
        <Phone className="w-6 h-6" />
        <span className="absolute right-16 bg-[#1F2937] text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Gọi điện
        </span>
      </a>

      {/* Zalo Button */}
      <a
        href="https://zalo.me/0866918366"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#0068FF] hover:bg-[#0052CC] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200 group relative"
        aria-label="Chat Zalo"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-16 bg-[#1F2937] text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Chat Zalo
        </span>
      </a>

      {/* Facebook Messenger Button */}
      <a
        href="https://m.me/nhanviet"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#0084FF] hover:bg-[#006DE0] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200 group relative"
        aria-label="Messenger"
      >
        <Facebook className="w-6 h-6" />
        <span className="absolute right-16 bg-[#1F2937] text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Messenger
        </span>
      </a>
    </div>
  );
}
