import { HiArrowRight } from "react-icons/hi2";
import Card from "@/components/ui/Cards";


interface CardProps {
  name: string;
  description: string;
  image: string;
  index: number;
}

const Destinations = () => {

    const cardsData = Array.from({ length: 10 }).map((_, i) => ({
        id: i + 1,
        name: `Card ${i + 1}`,
        description: "This is a sample description for the card.",
        image: `https://picsum.photos/seed/${i + 1}/300/200`,
    }));

    const doubled = [...cardsData, ...cardsData]
  return (
    <div className='mx-[12px] py-[5vh] border-[0.5px] border-black rounded-[12px] bg-white' >
        <div className='flex flex-col justify-center items-center ' >
            <p className='text-[30px] Inter font-normal' >Visit Best Destinations in India with <span className="text-[#4da528]" >TRAVOXA</span></p>
            <button className='mt-[24px] font-light flex justify-center items-center gap-[10px] ' > See all Destinations <div className="p-[8px] bg-black rounded-full" ><HiArrowRight color="white"  /></div></button>
        </div>

        <div className="w-full overflow-hidden py-20 relative">
          <div className="flex animate-scroll-horizontal">
            {doubled.map((item, index) => (
              <Card
                key={index}
                index={index}
                name={item.name}
                description={item.description}
                image={item.image}
              />
            ))}
          </div>
          
          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
        </div>

      
    
    </div>
  )
}

export default Destinations