
export interface TourPackage {
    id: string;
    title: string;
    location: string;
    price: number;
    duration: string; // e.g. "5 Days / 4 Nights"
    rating: number;
    reviews: number;
    image: string;
    overview: string;
    itinerary: {
        day: number;
        title: string;
        description: string;
    }[];
    inclusions: string[];
    exclusions: string[];
}

export const tourPackages: TourPackage[] = [
    {
        id: "bali-bliss",
        title: "Bali Bliss Retreat",
        location: "Bali, Indonesia",
        price: 850,
        duration: "6 Days / 5 Nights",
        rating: 4.8,
        reviews: 124,
        image: "/Destinations/Des1.jpeg",
        overview: "Experience the magic of Bali with its pristine beaches, lush rice terraces, and vibrant culture. This 6-day retreat offers the perfect blend of relaxation and adventure.",
        itinerary: [
            { day: 1, title: "Arrival in Denpasar", description: "Arrive at Ngurah Rai International Airport. Transfer to your hotel in Ubud. Welcome dinner." },
            { day: 2, title: "Ubud Cultural Tour", description: "Visit the Sacred Monkey Forest Sanctuary, Ubud Palace, and Tegalalang Rice Terrace." },
            { day: 3, title: "Mount Batur Sunrise Trek", description: "Early morning trek to Mount Batur for a breathtaking sunrise. Afternoon spa relaxation." },
            { day: 4, title: "Nusa Penida Day Trip", description: "Speedboat to Nusa Penida. Visit Kelingking Beach, Angel’s Billabong, and Crystal Bay." },
            { day: 5, title: "Seminyak Beach Day", description: "Transfer to Seminyak. Free day to explore the beaches, shops, and beach clubs." },
            { day: 6, title: "Departure", description: "Transfer to the airport for your flight home." }
        ],
        inclusions: ["Airport transfers", "5 nights accommodation", "Daily breakfast", "Guided tours", "Entrance fees"],
        exclusions: ["International flights", "Personal expenses", "Travel insurance", "Lunch and dinner (unless specified)"]
    },
    {
        id: "swiss-alps-adventure",
        title: "Swiss Alps Adventure",
        location: "Interlaken, Switzerland",
        price: 1800,
        duration: "7 Days / 6 Nights",
        rating: 4.9,
        reviews: 89,
        image: "/Destinations/Des2.jpg",
        overview: "Immerse yourself in the breathtaking landscapes of the Swiss Alps. From snow-capped peaks to crystal-clear lakes, this adventure is a nature lover's dream.",
        itinerary: [
            { day: 1, title: "Arrival in Zurich", description: "Arrive in Zurich. Train transfer to Interlaken. Check-in and evening leisure." },
            { day: 2, title: "Jungfraujoch Excursion", description: "Train journey to the 'Top of Europe' - Jungfraujoch. Ice Palace and Sphinx Observatory." },
            { day: 3, title: "Lake Brienz Boat Trip", description: "Scenic boat cruise on the turquoise Lake Brienz. Visit Giessbach Falls." },
            { day: 4, title: "Adventure Sports", description: "Optional paragliding or canyoning. Afternoon hiking in Grindelwald." },
            { day: 5, title: "Lucerne Day Trip", description: "Train to Lucerne. Chapel Bridge, Lion Monument, and Old Town exploration." },
            { day: 6, title: "Zurich City Tour", description: "Return to Zurich. Guided city tour including Lake Zurich and Bahnhofstrasse." },
            { day: 7, title: "Departure", description: "Transfer to Zurich Airport." }
        ],
        inclusions: ["Swiss Travel Pass (8 days)", "6 nights accommodation", "Daily breakfast", "Jungfraujoch excursion", "Boat cruise"],
        exclusions: ["International flights", "Visa fees", "Adventure sports add-ons"]
    },
    {
        id: "majestic-maldives",
        title: "Majestic Maldives",
        location: "Malé Atoll, Maldives",
        price: 2200,
        duration: "5 Days / 4 Nights",
        rating: 5.0,
        reviews: 210,
        image: "/Destinations/Des3.jpg",
        overview: "Escape to paradise in the Maldives. Stay in a luxurious overwater villa, snorkel in vibrant coral reefs, and enjoy world-class hospitality.",
        itinerary: [
            { day: 1, title: "Arrival in Malé", description: "Speedboat transfer to your private island resort. Check-in to your water villa." },
            { day: 2, title: "Water Sports & Snorkeling", description: "Morning snorkeling safari. Afternoon kayaking or jet skiing." },
            { day: 3, title: "Sunset Dolphin Cruise", description: "Relax on the beach. Evening sunset cruise to spot dolphins." },
            { day: 4, title: "Spa & Wellness", description: "Indulge in a signature spa treatment. Romantic candlelight dinner on the beach." },
            { day: 5, title: "Departure", description: "Speedboat transfer to Malé International Airport." }
        ],
        inclusions: ["Speedboat transfers", "4 nights Water Villa", "All-inclusive meal plan", "Snorkeling gear", "Sunset cruise"],
        exclusions: ["International flights", "Scuba diving courses", "Premium alcoholic beverages"]
    },
    {
        id: "kyoto-cultural-journey",
        title: "Kyoto Cultural Journey",
        location: "Kyoto, Japan",
        price: 1450,
        duration: "6 Days / 5 Nights",
        rating: 4.7,
        reviews: 156,
        image: "/Destinations/Des4.jpg",
        overview: "Step back in time in Kyoto, the cultural heart of Japan. Explore ancient temples, lush bamboo groves, and traditional geisha districts.",
        itinerary: [
            { day: 1, title: "Arrival in Osaka/Kyoto", description: "Arrive at KIX Airport. Transfer to Kyoto. Welcome tea ceremony." },
            { day: 2, title: "Temples of Kyoto", description: "Visit Kinkaku-ji (Golden Pavilion), Ryoan-ji, and Nijo Castle." },
            { day: 3, title: "Arashiyama Bamboo Grove", description: "Walk through the famous Bamboo Grove and visit the Tenryu-ji Temple." },
            { day: 4, title: "Fushimi Inari Shrine", description: "Hike through the thousands of vermilion torii gates. Afternoon sake tasting." },
            { day: 5, title: "Nara Day Trip", description: "Train to Nara Park to see the friendly deer and Todai-ji Temple." },
            { day: 6, title: "Departure", description: "Transfer to KIX Airport." }
        ],
        inclusions: ["Airport transfers", "5 nights hotel", "Daily breakfast", "Tea ceremony", "JR Kansai Pass"],
        exclusions: ["International flights", "Lunch and dinner", "Personal shopping"]
    },
    {
        id: "santorini-sunset",
        title: "Santorini Sunset Dreams",
        location: "Santorini, Greece",
        price: 1600,
        duration: "5 Days / 4 Nights",
        rating: 4.9,
        reviews: 305,
        image: "/Destinations/Des5.jpg",
        overview: "Experience the romance of Santorini with its iconic white-washed buildings, blue domes, and world-famous sunsets over the caldera.",
        itinerary: [
            { day: 1, title: "Arrival in Santorini", description: "Transfer to your cliffside hotel in Oia. Evening at leisure." },
            { day: 2, title: "Caldera Catamaran Cruise", description: "Sail around the volcano and hot springs. BBQ lunch on board." },
            { day: 3, title: "Wine Tasting Tour", description: "Visit 3 traditional wineries and taste the unique volcanic wines of Santorini." },
            { day: 4, title: "Fira and Imerovigli", description: "Hike from Fira to Oia (optional) or explore the capital Fira. Sunset dinner in Oia." },
            { day: 5, title: "Departure", description: "Transfer to Santorini Airport." }
        ],
        inclusions: ["Airport transfers", "4 nights accommodation", "Daily breakfast", "Catamaran cruise", "Wine tasting"],
        exclusions: ["International flights", "City tax", "Meals not mentioned"]
    },
    {
        id: "machu-picchu-trek",
        title: "Inca Trail to Machu Picchu",
        location: "Cusco, Peru",
        price: 1350,
        duration: "5 Days / 4 Nights",
        rating: 4.8,
        reviews: 220,
        image: "/Destinations/Des6.jpg",
        overview: "Walk the path of the Incas. A bucket-list trek through the Andes leading to the majestic Lost City of the Incas, Machu Picchu.",
        itinerary: [
            { day: 1, title: "Cusco Acclimatization", description: "Arrive in Cusco. Rest and acclimatize. Brief walking tour of the city." },
            { day: 2, title: "Sacred Valley", description: "Visit Pisac Market and Ollantaytambo Fortress. Overnight in Ollantaytambo." },
            { day: 3, title: "Inca Trail - Day 1", description: "Start the trek at Km 82. Hike to Wayllabamba camp." },
            { day: 4, title: "Inca Trail - Day 2 & 3 (Express)", description: "Cross Dead Woman's Pass. Descend to the Cloud Forest. Arrive at Aguas Calientes (via train shortcut for this 5-day version)." },
            { day: 5, title: "Machu Picchu & Return", description: "Guided tour of Machu Picchu citadel. Train back to Cusco. Departure." },
        ],
        inclusions: ["Transfers", "Inca Trail permit", "Professional guide", "Meals on trek", "Train tickets"],
        exclusions: ["International flights", "Sleeping bag rental", "Huayna Picchu entrance", "Tips"]
    }
];

export function getPackageById(id: string): TourPackage | undefined {
    return tourPackages.find((pkg) => pkg.id === id);
}
