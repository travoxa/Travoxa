// components/Card.tsx
import { HiArrowRight } from "react-icons/hi2";

interface CardProps {
  name: string;
  description: string;
  image: string;
  index: number;
}

export default function Card({ name, description, image, index }: CardProps) {
  return (
    <div
      className={`
        group relative w-[300px] lg:w-[350px] shrink-0 rounded-2xl overflow-hidden
        mx-3 bg-white
        transition-all duration-300 hover:shadow-xl
        border border-gray-100
      `}
    >
      {/* Image Section */}
      <div className="h-[220px] relative overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        {/* Rating Mock */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <span>★</span> 4.8
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900">{name}</h3>
          <span className="text-lg font-bold text-black">$285</span>
        </div>
        <div className="flex items-center gap-1 mb-4 text-gray-500 text-xs uppercase tracking-wide">
          <span>Bali, Indonesia</span> {/* Mock location */}
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{description}</p>

        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200"></div> {/* User Avatar Mock */}
            <span className="text-xs text-gray-500">Hosted by Milan</span>
          </div>
          <button className="text-xs font-bold text-black border-b border-black pb-0.5 hover:text-green-600 hover:border-green-600 transition-colors">BOOK NOW</button>
        </div>
      </div>
    </div>
  );
}