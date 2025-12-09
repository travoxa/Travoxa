import { HiArrowRight } from "react-icons/hi2";

// components/Card.tsx
interface CardProps {
  name: string;
  description: string;
  image: string;
  index: number;
}

export default function Card({ name, description, image, index }: CardProps) {
  const isEven = index % 2 === 0;

  return (
        <div
            className={`
                relative z-1 w-[50vw] lg:w-[30vw] h-[20vh] lg:h-[50vh] shrink-0 rounded-xl overflow-hidden shadow-lg
                mx-4 p-4
                bg-cover bg-center bg-no-repeat
                transition-transform duration-300 hover:scale-105
                border-[0.5px] border-black
                ${isEven ? "mt-6" : "mb-6"}
            `}
            style={{ backgroundImage: `url(${image})` }}
            >
            {/* Bottom-to-top gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

            {/* Card content */}
            <div className="absolute z-1 bottom-2 lg:bottom-5 left-2 lg:left-5"> 
                <h3 className="text-[12px] lg:text-lg font-semibold text-white">{name}</h3>
                <p className="text-[10px] lg:text-sm text-gray-200 mt-2">{description}</p>
                <button className='text-[10px] text-white mt-0 lg:mt-[12px] font-light flex justify-center items-center gap-[10px] ' > See Destinations <div className="p-[8px] bg-white rounded-full" ><HiArrowRight color="black"  /></div></button>
            </div>
        </div>

  );
}