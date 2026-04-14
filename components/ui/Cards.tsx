// components/Card.tsx
import { HiArrowRight } from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";

interface CardProps {
  name: string;
  description: string;
  image: string;
  index: number;
  price: string;
  href?: string; // optional link for real packages
  locationLabel?: string; // optional real location
  rating?: number; // optional real rating
}

export default function Card({ name, description, image, index, price, href, locationLabel, rating }: CardProps) {
  const CardInner = (
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
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 300px, 350px"
        />
        {/* Rating */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <span>★</span> {rating ?? 4.8}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{name}</h3>
          <span className="text-lg font-bold text-black shrink-0 ml-2">{price}</span>
        </div>
        <div className="flex items-center gap-1 mb-4 text-gray-500 text-xs uppercase tracking-wide">
          <span>{locationLabel ?? "India"}</span>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{description}</p>

        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            <span className="text-xs text-gray-500">Hosted by Travoxa</span>
          </div>
          <span className="text-xs font-bold text-black border-b border-black pb-0.5 group-hover:text-green-600 group-hover:border-green-600 transition-colors cursor-pointer">BOOK NOW</span>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block shrink-0">
        {CardInner}
      </Link>
    );
  }

  return CardInner;
}