import { HiArrowRight } from "react-icons/hi2";
import Card from "@/components/ui/Cards";
import HomeFilterSearch from "@/components/ui/HomeFilterSearch";

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
      description: "Pangong Lake, monasteries — extreme scenic & biker's paradise.",
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
      description: "Considered 'heaven on earth'; shikara rides and snow adventures.",
      image: "/Destinations/Des10.jpg",
    },
  ];

  const doubled = [...cardsData, ...cardsData];

  return (
    <div className='bg-white relative z-10 p-0'>

      <div className='flex flex-col justify-center items-center pt-24 pb-8' data-aos="fade-up">
        <h2 className='text-center text-3xl lg:text-5xl text-black mb-6 Mont leading-tight'>
          A Selection Of Exceptional <br /> <span className="">Tour Packages</span>
        </h2>
        {/* Filter Section directly embedded */}
        <div className="w-full max-w-5xl mx-auto mt-6" data-aos="fade-up" data-aos-delay="200">
          <HomeFilterSearch />
        </div>
      </div>

      <div className="w-full overflow-hidden py-10 relative" data-aos="fade-left" data-aos-delay="400">
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
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Destinations;