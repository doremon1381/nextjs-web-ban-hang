import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  buttonText: string;
}

export function CategoryCard({ title, description, image, buttonText }: CategoryCardProps) {
  return (
    <div className="group bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-xl transition-all cursor-pointer">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>

      <div className="p-6">
        <h3 className="text-xl text-[#1F5E3B] mb-2">{title}</h3>
        <p className="text-sm text-[#6B7280] mb-4">{description}</p>

        <button className="flex items-center gap-2 text-[#43A047] hover:gap-3 transition-all group-hover:text-[#388E3C]">
          <span className="text-sm">{buttonText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
