"use client";

import React from "react";
import Card from "@/components/ui/Cards";
import HomeFilterSearch from "@/components/ui/HomeFilterSearch";

// Fake placeholder cards used to fill up the strip when real packages are fewer than DESIRED_COUNT
const DESIRED_COUNT = 10;

const fakePlaceholders = [
  {
    id: "fake-1",
    name: "Agra – Taj Mahal",
    description: "World wonder, iconic for international tourists.",
    image: "/Destinations/Des1.jpeg",
    price: "₹15,200",
    locationLabel: "Agra, Uttar Pradesh",
  },
  {
    id: "fake-2",
    name: "Jaipur – Pink City",
    description: "Forts, palaces, culture — huge demand for couples & families.",
    image: "/Destinations/Des2.jpg",
    price: "₹16,750",
    locationLabel: "Jaipur, Rajasthan",
  },
  {
    id: "fake-3",
    name: "Kerala – Alleppey / Munnar",
    description: "Houseboats, tea plantations, hill stations — perfect for calm luxury.",
    image: "/Destinations/Des3.jpg",
    price: "₹22,600",
    locationLabel: "Kerala",
  },
  {
    id: "fake-4",
    name: "Goa",
    description: "Beaches + nightlife; huge seasonal demand especially November–February.",
    image: "/Destinations/Des4.jpg",
    price: "₹25,400",
    locationLabel: "Goa",
  },
  {
    id: "fake-5",
    name: "Varanasi",
    description: "Spiritual capital; sunrise boat rides, ghats, rituals.",
    image: "/Destinations/Des5.jpg",
    price: "₹26,900",
    locationLabel: "Varanasi, UP",
  },
  {
    id: "fake-6",
    name: "Manali & Kullu",
    description: "Himalayan beauty, snowfall, adventure tourism.",
    image: "/Destinations/Des6.jpg",
    price: "₹28,200",
    locationLabel: "Manali, HP",
  },
  {
    id: "fake-7",
    name: "Ladakh",
    description: "Pangong Lake, monasteries — extreme scenic & biker's paradise.",
    image: "/Destinations/Des7.jpg",
    price: "₹29,100",
    locationLabel: "Ladakh",
  },
  {
    id: "fake-8",
    name: "Andaman Islands",
    description: "Best white sand beaches in India; honeymoon hotspot.",
    image: "/Destinations/Des8.jpg",
    price: "₹17,900",
    locationLabel: "Andaman & Nicobar",
  },
  {
    id: "fake-9",
    name: "Mumbai",
    description: "Urban travel, food, nightlife, and Bollywood attractions.",
    image: "/Destinations/Des9.webp",
    price: "₹29,950",
    locationLabel: "Mumbai, Maharashtra",
  },
  {
    id: "fake-10",
    name: "Kashmir (Srinagar & Gulmarg)",
    description: "Considered 'heaven on earth'; shikara rides and snow adventures.",
    image: "/Destinations/Des10.jpg",
    price: "₹29,100",
    locationLabel: "Kashmir",
  },
];

// Format a price number to INR string
function formatPrice(price: number): string {
  if (!price) return "Contact us";
  return `₹${price.toLocaleString("en-IN")}`;
}

// Get the first image string whether the image field is a string or array
function getFirstImage(image: string | string[]): string {
  if (Array.isArray(image)) return image[0] || "/Destinations/Des1.jpeg";
  return image || "/Destinations/Des1.jpeg";
}

const Destinations = () => {
  const [cards, setCards] = React.useState(fakePlaceholders);

  React.useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch("/api/tours");
        const data = await res.json();

        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          // Map real packages to card format
          const realCards = data.data.map((pkg: any) => ({
            id: pkg.id || pkg._id?.toString(),
            name: pkg.title,
            description: pkg.overview || pkg.description || "",
            image: getFirstImage(pkg.image),
            price: formatPrice(pkg.price),
            locationLabel: pkg.location || "India",
            rating: pkg.rating,
            href: `/tour/${pkg.id || pkg._id?.toString()}`,
            isReal: true,
          }));

          // Fill remaining slots with fake placeholders (never exceed DESIRED_COUNT total before doubling)
          const slotsNeeded = Math.max(0, DESIRED_COUNT - realCards.length);
          const fakeToUse = fakePlaceholders.slice(0, slotsNeeded);

          setCards([...realCards, ...fakeToUse]);
        }
        // If fetch fails or returns no data, we keep the default fakePlaceholders already set
      } catch (err) {
        // Silently keep fake placeholders
      }
    };

    fetchTours();
  }, []);

  // Double the array for seamless infinite scroll
  const doubled = [...cards, ...cards];

  return (
    <div className="bg-white relative z-10 p-0">
      <div className="flex flex-col justify-center items-center pt-24 pb-8" data-aos="fade-up">
        <h2 className="text-center text-4xl lg:text-6xl text-black mb-8 Mont font-normal leading-tight">
          A Selection Of Exceptional <br /> <span className="">Tour Packages</span>
        </h2>
        {/* Filter Section directly embedded */}
        <div className="w-full max-w-5xl mx-auto mt-6" data-aos="fade-up" data-aos-delay="200">
          <HomeFilterSearch />
        </div>
      </div>

      <div className="w-full overflow-hidden py-10 relative" data-aos="fade-left" data-aos-delay="400">
        <div className="flex animate-scroll-horizontal">
          {doubled.map((item: any, index: number) => (
            <Card
              key={`${item.id}-${index}`}
              index={index}
              name={item.name}
              description={item.description}
              image={item.image}
              price={item.price}
              locationLabel={item.locationLabel}
              rating={item.rating}
              href={item.href}
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