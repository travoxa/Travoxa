import { HiArrowRight } from "react-icons/hi2";
import Card from "@/components/ui/Cards";


interface CardProps {
  name: string;
  description: string;
  image: string;
  index: number;
}

const Destinations = () => {

    const cardsData = [
      {
        id: 1,
        name: "Agra – Taj Mahal",
        description: "World wonder, iconic for international tourists.",
        image: "/Destinations/Des1.jpeg",
      },
      {
        id: 2,
        name: "Jaipur – Pink City",
        description: "Forts, palaces, culture — huge demand for couples & families.",
        image: "/Destinations/Des2.jpg",
      },
      {
        id: 3,
        name: "Kerala – Alleppey / Munnar",
        description: "Houseboats, tea plantations, hill stations — perfect for calm luxury.",
        image: "/Destinations/Des3.jpg",
      },
      {
        id: 4,
        name: "Goa",
        description: "Beaches + nightlife; huge seasonal demand especially November–February.",
        image: "/Destinations/Des4.jpg",
      },
      {
        id: 5,
        name: "Varanasi",
        description: "Spiritual capital; sunrise boat rides, ghats, rituals.",
        image: "/Destinations/Des5.jpg",
      },
      {
        id: 6,
        name: "Manali & Kullu",
        description: "Himalayan beauty, snowfall, adventure tourism.",
        image: "/Destinations/Des6.jpg",
      },
      {
        id: 7,
        name: "Ladakh",
        description: "Pangong Lake, monasteries — extreme scenic & biker’s paradise.",
        image: "/Destinations/Des7.jpg",
      },
      {
        id: 8,
        name: "Andaman Islands",
        description: "Best white sand beaches in India; honeymoon hotspot.",
        image: "/Destinations/Des8.jpg",
      },
      {
        id: 9,
        name: "Mumbai",
        description: "Urban travel, food, nightlife, and Bollywood attractions.",
        image: "/Destinations/Des9.webp",
      },
      {
        id: 10,
        name: "Kashmir (Srinagar & Gulmarg)",
        description: "Considered “heaven on earth”; shikara rides and snow adventures.",
        image: "/Destinations/Des10.jpg",
      },
    ];



    const doubled = [...cardsData, ...cardsData]
  return (
    <div className='mx-[12px] py-[5vh] border-[0.5px] border-black rounded-[12px] bg-white' >
        <div className='flex flex-col justify-center items-center ' >
            <p className='text-center text-[20px]  lg:text-[40px] Mont font-normal' >Visit Best Destinations in India with <span className="text-[#4da528]" >TRAVOXA</span></p>
            <button className='mt-[24px] text-[10px] lg:text-[18px] font-light flex justify-center items-center gap-[10px] ' > See all Destinations <div className="p-[8px] bg-black rounded-full" ><HiArrowRight color="white"  /></div></button>
        </div>

        <div className="w-full overflow-hidden py-[24px] lg:py-20 relative">
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