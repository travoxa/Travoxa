
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

export const tourData: TourPackage[] = [
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
    },
    {
        id: "northern-lights-iceland",
        title: "Iceland Northern Lights",
        location: "Reykjavik, Iceland",
        price: 2100,
        duration: "5 Days / 4 Nights",
        rating: 4.9,
        reviews: 310,
        image: "/Destinations/Des7.jpg",
        overview: "Chase the magical Northern Lights in Iceland. Explore waterfalls, geysers, and black sand beaches in this winter wonderland.",
        itinerary: [
            { day: 1, title: "Arrival in Reykjavik", description: "Transfer to hotel. Evening Northern Lights hunt (weather permitting)." },
            { day: 2, title: "Golden Circle Tour", description: "Visit Thingvellir National Park, Geysir Geothermal Area, and Gullfoss Waterfall." },
            { day: 3, title: "South Coast Adventure", description: "See Seljalandsfoss and Skogafoss waterfalls. Walk on Reynisfjara Black Sand Beach." },
            { day: 4, title: "Blue Lagoon Spa", description: "Relax in the geothermal waters of the Blue Lagoon. Farewell dinner in Reykjavik." },
            { day: 5, title: "Departure", description: "Transfer to Keflavik Airport." }
        ],
        inclusions: ["Airport transfers", "4 nights accommodation", "Daily breakfast", "Guided tours", "Blue Lagoon entry"],
        exclusions: ["International flights", "Lunch and dinner", "Personal gear"]
    },
    {
        id: "safari-serengeti",
        title: "Serengeti Safari Adventure",
        location: "Arusha, Tanzania",
        price: 3200,
        duration: "7 Days / 6 Nights",
        rating: 5.0,
        reviews: 180,
        image: "/Destinations/Des8.jpg",
        overview: "Witness the Great Migration and the Big Five in the vast plains of the Serengeti. A once-in-a-lifetime wildlife experience.",
        itinerary: [
            { day: 1, title: "Arrival in Arusha", description: "Transfer to lodge. Safari briefing." },
            { day: 2, title: "Tarangire National Park", description: "Full day game drive seeing elephants and baobab trees." },
            { day: 3, title: "Serengeti Central", description: "Drive to Serengeti. Afternoon game drive." },
            { day: 4, title: "Serengeti Full Day", description: "Full day exploring the Serengeti plains. Picnic lunch in the bush." },
            { day: 5, title: "Ngorongoro Crater", description: "Descend into the crater for a game drive. Spot rhinos and lions." },
            { day: 6, title: "Lake Manyara", description: "Morning game drive. Visit a Masai village." },
            { day: 7, title: "Departure", description: "Drive back to Arusha for flight." }
        ],
        inclusions: ["All transfers", "Safari jeep", "Park fees", "Full board meals", "Professional guide"],
        exclusions: ["International flights", "Tips for guide", "Visas", "Alcoholic drinks"]
    },
    {
        id: "amalfi-coast-romance",
        title: "Amalfi Coast Romance",
        location: "Positano, Italy",
        price: 2500,
        duration: "6 Days / 5 Nights",
        rating: 4.8,
        reviews: 245,
        image: "/Destinations/Des9.webp",
        overview: "Stunning coastal views, lemon groves, and charming villages. The perfect romantic getaway on Italy's most beautiful coastline.",
        itinerary: [
            { day: 1, title: "Arrival in Naples", description: "Private car transfer to Positano hotel." },
            { day: 2, title: "Positano & Amalfi", description: "Walking tour of Positano. Boat ride to Amalfi town." },
            { day: 3, title: "Capri Day Trip", description: "Ferry to Capri. Visit Blue Grotto and Anacapri." },
            { day: 4, title: "Ravello & Gardens", description: "Visit the hilltop town of Ravello and Villa Cimbrone gardens." },
            { day: 5, title: "Cooking Class", description: "Traditional Italian cooking class with local ingredients. Farewell dinner." },
            { day: 6, title: "Departure", description: "Transfer to Naples Airport." }
        ],
        inclusions: ["Private transfers", "5 nights sea-view room", "Daily breakfast", "Cooking class", "Ferry tickets"],
        exclusions: ["International flights", "City tax", "Lunch and dinner"]
    },
    {
        id: "egypt-pyramids-nile",
        title: "Pyramids & Nile Cruise",
        location: "Cairo, Egypt",
        price: 1650,
        duration: "8 Days / 7 Nights",
        rating: 4.7,
        reviews: 290,
        image: "/Destinations/Des10.jpg",
        overview: "Discover ancient wonders from the Pyramids of Giza to the temples of Luxor and Aswan on a luxury Nile cruise.",
        itinerary: [
            { day: 1, title: "Arrival in Cairo", description: "Transfer to hotel near Pyramids." },
            { day: 2, title: "Giza Pyramids & Sphinx", description: "Tour of the Great Pyramids and Sphinx. Visit Egyptian Museum." },
            { day: 3, title: "Fly to Aswan", description: "Flight to Aswan. Board Nile Cruise. Visit High Dam." },
            { day: 4, title: "Kom Ombo & Edfu", description: "Sail to Kom Ombo Temple and Edfu Temple of Horus." },
            { day: 5, title: "Luxor West Bank", description: "Visit Valley of the Kings and Temple of Hatshepsut." },
            { day: 6, title: "Luxor East Bank", description: "Karnak and Luxor Temples. Fly back to Cairo." },
            { day: 7, title: "Old Cairo", description: "Explore Khan El Khalili bazaar and Citadel." },
            { day: 8, title: "Departure", description: "Transfer to Cairo Airport." }
        ],
        inclusions: ["Domestic flights", "4 nights cruise", "3 nights hotel", "Guided tours", "Entrance fees"],
        exclusions: ["International flights", "Visa", "Tips", "Optional hot air balloon"]
    },
    {
        id: "grand-canyon-adventure",
        title: "Grand Canyon Explorer",
        location: "Arizona, USA",
        price: 1200,
        duration: "4 Days / 3 Nights",
        rating: 4.8,
        reviews: 150,
        image: "/Destinations/Des1.jpeg",
        overview: "Hike, raft, and explore the awe-inspiring Grand Canyon. A perfect short adventure for nature enthusiasts.",
        itinerary: [
            { day: 1, title: "Las Vegas to Grand Canyon", description: "Drive from Vegas to South Rim. Sunset at Mather Point." },
            { day: 2, title: "Rim Trail Hike", description: "Hike along the rim. Geological museum visit." },
            { day: 3, title: "Helicopter Tour", description: "Optional helicopter ride over the canyon. Afternoon free time." },
            { day: 4, title: "Departure", description: "Sunrise view. Drive back to Las Vegas." }
        ],
        inclusions: ["Transport from Vegas", "3 nights lodge", "Park entry", "Guided hikes"],
        exclusions: ["Flights to Vegas", "Helicopter tour", "Meals"]
    },
    {
        id: "dubai-luxury-escape",
        title: "Dubai Luxury Escape",
        location: "Dubai, UAE",
        price: 1900,
        duration: "5 Days / 4 Nights",
        rating: 4.9,
        reviews: 330,
        image: "/Destinations/Des2.jpg",
        overview: "Experience the glitz and glamour of Dubai. Shopping, desert safaris, and the world's tallest building.",
        itinerary: [
            { day: 1, title: "Arrival in Dubai", description: "VIP transfer to downtown hotel." },
            { day: 2, title: "Modern Dubai Tour", description: "Visit Burj Khalifa (At the Top), Dubai Mall, and Fountain Show." },
            { day: 3, title: "Desert Safari", description: "Afternoon dune bashing, camel ride, and BBQ dinner in desert camp." },
            { day: 4, title: "Palm Jumeirah", description: "Visit Atlantis, The Palm. Aquaventure Waterpark or beach relaxation." },
            { day: 5, title: "Departure", description: "Transfer to Dubai Airport." }
        ],
        inclusions: ["VIP Transfers", "5-star hotel", "Burj Khalifa tickets", "Desert Safari", "Waterpark entry"],
        exclusions: ["Flights", "Tourism Dirham fee", "Lunch and dinner"]
    },
    {
        id: "patagonia-trekking",
        title: "Patagonia Trekking",
        location: "Torres del Paine, Chile",
        price: 2800,
        duration: "8 Days / 7 Nights",
        rating: 5.0,
        reviews: 95,
        image: "/Destinations/Des3.jpg",
        overview: "Trek through the raw beauty of Patagonia. Glaciers, granite peaks, and turquoise lakes await.",
        itinerary: [
            { day: 1, title: "Arrival in Punta Arenas", description: "Bus to Puerto Natales. Gear check." },
            { day: 2, title: "Base of the Towers", description: "Hike to the iconic Las Torres viewpoint." },
            { day: 3, title: "Los Cuernos", description: "Hike along Nordenskjöld Lake." },
            { day: 4, title: "French Valley", description: "Trek into the French Valley to see hanging glaciers." },
            { day: 5, title: "Grey Glacier", description: "Hike to Grey Glacier viewpoint. Boat trip across Grey Lake." },
            { day: 6, title: "Return to Puerto Natales", description: "Transfer back to town. Farewell dinner." },
            { day: 7, title: "Free Day", description: "Relax or explore local caves." },
            { day: 8, title: "Departure", description: "Bus to Punta Arenas Airport." }
        ],
        inclusions: ["Refugio accommodation", "All meals on trek", "Guide", "Park entry", "Transfers"],
        exclusions: ["International flights", "Personal gear", "Santiage transfers"]
    },
    {
        id: "vietnam-classic",
        title: "Vietnam Highlights",
        location: "Hanoi & Halong Bay, Vietnam",
        price: 1100,
        duration: "7 Days / 6 Nights",
        rating: 4.7,
        reviews: 210,
        image: "/Destinations/Des4.jpg",
        overview: "From the bustling streets of Hanoi to the limestone karsts of Halong Bay, experience the best of Northern Vietnam.",
        itinerary: [
            { day: 1, title: "Arrival in Hanoi", description: "Transfer to Old Quarter hotel. Water Puppet Show." },
            { day: 2, title: "Hanoi City Tour", description: "Visit Ho Chi Minh Mausoleum, Temple of Literature, and Train Street." },
            { day: 3, title: "Halong Bay Cruise", description: "Drive to Halong Bay. Board overnight cruise. Kayaking and swimming." },
            { day: 4, title: "Halong to Hanoi", description: "Tai Chi on deck. Cave visit. Return to Hanoi." },
            { day: 5, title: "Ninh Binh Day Trip", description: "Visit Trang An (Kong Skull Island filming location) and Bai Dinh Pagoda." },
            { day: 6, title: "Street Food Tour", description: "Guided street food tour tasting Pho, Banh Mi, and Egg Coffee." },
            { day: 7, title: "Departure", description: "Transfer to Noi Bai Airport." }
        ],
        inclusions: ["Hotels", "Overnight cruise", "Meals as per itinerary", "Transfers", "Guide"],
        exclusions: ["International flights", "Visa", "Personal expenses"]
    },
    {
        id: "scottish-highlands",
        title: "Scottish Highlands Mystery",
        location: "Inverness, Scotland",
        price: 1550,
        duration: "5 Days / 4 Nights",
        rating: 4.8,
        reviews: 140,
        image: "/Destinations/Des5.jpg",
        overview: "Castles, lochs, and legends. Explore the dramatic landscapes of the Scottish Highlands.",
        itinerary: [
            { day: 1, title: "Edinburgh to Inverness", description: "Train to Inverness. Check-in." },
            { day: 2, title: "Loch Ness & Urquhart Castle", description: "Cruise on Loch Ness. Explore castle ruins." },
            { day: 3, title: "Isle of Skye Day Trip", description: "Full day tour to Skye. Fairy Pools and Old Man of Storr." },
            { day: 4, title: "Culloden Battlefield", description: "Visit Culloden and Clava Cairns (Outlander inspiration)." },
            { day: 5, title: "Departure", description: "Train back to Edinburgh." }
        ],
        inclusions: ["Train tickets", "4 nights B&B", "Skye tour", "Loch Ness cruise"],
        exclusions: ["Flights to Edinburgh", "Lunch and dinner", "Entry fees"]
    },
    {
        id: "costa-rica-eco",
        title: "Costa Rica Eco Adventure",
        location: "La Fortuna, Costa Rica",
        price: 1750,
        duration: "6 Days / 5 Nights",
        rating: 4.9,
        reviews: 195,
        image: "/Destinations/Des6.jpg",
        overview: "Zip-lining, hot springs, and wildlife. Immerse yourself in the 'Pura Vida' lifestyle.",
        itinerary: [
            { day: 1, title: "Arrival in San Jose", description: "Transfer to Arenal area." },
            { day: 2, title: "Arenal Volcano Hike", description: "Morning hike. Afternoon relax in Tabacon Hot Springs." },
            { day: 3, title: "Monteverde Cloud Forest", description: "Transfer to Monteverde. Hanging bridges walk." },
            { day: 4, title: "Zip-line Adventure", description: "Canopy tour zip-lining. Visit a coffee plantation." },
            { day: 5, title: "Manuel Antonio Beach", description: "Transfer to coast. National park visit to see monkeys and sloths." },
            { day: 6, title: "Departure", description: "Transfer to San Jose Airport." }
        ],
        inclusions: ["Transfers", "Hotels", "Activities", "Breakfasts"],
        exclusions: ["Flights", "Meals not listed", "Tips"]
    },
    {
        id: "new-zealand-south-island",
        title: "New Zealand South Island",
        location: "Queenstown, New Zealand",
        price: 2900,
        duration: "9 Days / 8 Nights",
        rating: 4.9,
        reviews: 110,
        image: "/Destinations/Des7.jpg",
        overview: "The adventure capital of the world. Fjords, mountains, and adrenaline activities.",
        itinerary: [
            { day: 1, title: "Arrival in Christchurch", description: "Pick up rental car. Explore city." },
            { day: 2, title: "Lake Tekapo", description: "Drive to Tekapo. Stargazing tour." },
            { day: 3, title: "Mt Cook", description: "Drive to Mt Cook. Hooker Valley Track hike." },
            { day: 4, title: "Wanaka", description: "Drive to Wanaka. Photo at 'That Wanaka Tree'." },
            { day: 5, title: "Queenstown", description: "Drive to Queenstown via Crown Range Road." },
            { day: 6, title: "Milford Sound", description: "Coach and cruise day trip to Milford Sound." },
            { day: 7, title: "Adventure Day", description: "Bungy jumping or Jet boat ride (optional)." },
            { day: 8, title: "Glenorchy", description: "Scenic drive to Lord of the Rings locations." },
            { day: 9, title: "Departure", description: "Fly out of Queenstown." }
        ],
        inclusions: ["Car rental", "8 nights accommodation", "Milford Sound cruise", "Stargazing"],
        exclusions: ["International flights", "Fuel", "Meals", "Adventure activities"]
    },
    {
        id: "morocco-imperial-cities",
        title: "Magic of Morocco",
        location: "Marrakech, Morocco",
        price: 1300,
        duration: "6 Days / 5 Nights",
        rating: 4.6,
        reviews: 280,
        image: "/Destinations/Des8.jpg",
        overview: "Souks, spices, and stunning architecture. A journey through the imperial cities.",
        itinerary: [
            { day: 1, title: "Arrival in Marrakech", description: "Transfer to Riad. Evening in Jemaa el-Fnaa square." },
            { day: 2, title: "Marrakech Tour", description: "Bahia Palace, Koutoubia Mosque, and Majorelle Garden." },
            { day: 3, title: "Atlas Mountains", description: "Day trip to Ouzoud Waterfalls or Imlil village." },
            { day: 4, title: "Essaouira", description: "Day trip to the coastal town of Essaouira." },
            { day: 5, title: "Souk Shopping", description: "Guided shopping tour in the Medina. Hammam spa experience." },
            { day: 6, title: "Departure", description: "Transfer to Marrakech Airport." }
        ],
        inclusions: ["Riad accommodation", "Transfers", "Guided tours", "Breakfast"],
        exclusions: ["Flights", "Lunch and dinner", "Tips"]
    },
    {
        id: "great-barrier-reef",
        title: "Great Barrier Reef Dive",
        location: "Cairns, Australia",
        price: 1950,
        duration: "5 Days / 4 Nights",
        rating: 4.8,
        reviews: 165,
        image: "/Destinations/Des9.webp",
        overview: "Dive into the world's largest coral reef system. Beautiful marine life and tropical rainforests.",
        itinerary: [
            { day: 1, title: "Arrival in Cairns", description: "Transfer to hotel. Esplanade walk." },
            { day: 2, title: "Reef Day Trip", description: "Full day snorkeling/diving on outer reef pontoon." },
            { day: 3, title: "Kuranda Rainforest", description: "Skyrail over the rainforest. Scenic railway return." },
            { day: 4, title: "Daintree & Cape Tribulation", description: "Full day tour to the oldest rainforest and beach meeting point." },
            { day: 5, title: "Departure", description: "Transfer to Cairns Airport." }
        ],
        inclusions: ["4 nights hotel", "Reef cruise", "Skyrail tickets", "Daintree tour", "Transfers"],
        exclusions: ["Flights", "Meals", "Diving gear rental (if extra)"]
    },
    {
        id: "banff-lake-louise",
        title: "Canadian Rockies Winter",
        location: "Banff, Canada",
        price: 1850,
        duration: "5 Days / 4 Nights",
        rating: 4.9,
        reviews: 130,
        image: "/Destinations/Des10.jpg",
        overview: "Snowy peaks and frozen lakes. A magical winter escape in Banff National Park.",
        itinerary: [
            { day: 1, title: "Arrival in Calgary", description: "Shuttle to Banff. Check-in." },
            { day: 2, title: "Banff Sightseeing", description: "Banff Gondola, Bow Falls, and Surprise Corner." },
            { day: 3, title: "Lake Louise", description: "Visit Lake Louise. Ice skating or sleigh ride." },
            { day: 4, title: "Johnston Canyon", description: "Ice walk in the canyon to frozen waterfalls." },
            { day: 5, title: "Departure", description: "Shuttle to Calgary Airport." }
        ],
        inclusions: ["Airport shuttle", "4 nights hotel", "Gondola ticket", "Ice walk guide"],
        exclusions: ["Flights", "Meals", "Park pass (if not inc)"]
    },
    {
        id: "paris-city-lights",
        title: "Paris City of Lights",
        location: "Paris, France",
        price: 1600,
        duration: "4 Days / 3 Nights",
        rating: 4.7,
        reviews: 410,
        image: "/Destinations/Des1.jpeg",
        overview: "Romance, art, and gastronomy. The ultimate weekend break in Paris.",
        itinerary: [
            { day: 1, title: "Arrival in Paris", description: "Transfer to hotel. Seine River cruise." },
            { day: 2, title: "Louvre & Eiffel", description: "Guided tour of Louvre Museum. Eiffel Tower summit." },
            { day: 3, title: "Montmartre & Sacré-Cœur", description: "Walking tour of artists' quarter. Cabaret show (optional)." },
            { day: 4, title: "Departure", description: "Transfer to CDG Airport." }
        ],
        inclusions: ["Transfers", "3 nights hotel", "Museum pass", "River cruise"],
        exclusions: ["Flights", "City tax", "Meals"]
    },
    {
        id: "cape-town-winelands",
        title: "Cape Town & Winelands",
        location: "Cape Town, South Africa",
        price: 1700,
        duration: "6 Days / 5 Nights",
        rating: 4.8,
        reviews: 175,
        image: "/Destinations/Des2.jpg",
        overview: "Table Mountain views, penguins, and world-class wine tasting.",
        itinerary: [
            { day: 1, title: "Arrival in Cape Town", description: "Transfer to V&A Waterfront hotel." },
            { day: 2, title: "Table Mountain & City", description: "Cable car up Table Mountain. City orientation tour." },
            { day: 3, title: "Cape Peninsula", description: "Cape Point, Chapman's Peak Drive, and Boulders Beach penguins." },
            { day: 4, title: "Winelands Tour", description: "Visit Stellenbosch and Franschhoek for tastings." },
            { day: 5, title: "Robben Island", description: "Ferry to Robben Island museum. Afternoon free." },
            { day: 6, title: "Departure", description: "Transfer to Cape Town Airport." }
        ],
        inclusions: ["Transfers", "5 nights hotel", "Tours mentioned", "Wine tasting"],
        exclusions: ["Flights", "Meals", "Tips"]
    },
    {
        id: "bhutan-himalayas",
        title: "Mystical Bhutan",
        location: "Paro & Thimphu, Bhutan",
        price: 2400,
        duration: "5 Days / 4 Nights",
        rating: 5.0,
        reviews: 60,
        image: "/Destinations/Des3.jpg",
        overview: "The Land of the Thunder Dragon. Monasteries, dzongs, and pristine nature.",
        itinerary: [
            { day: 1, title: "Arrival in Paro", description: "Drive to Thimphu. Visit Tashichho Dzong." },
            { day: 2, title: "Thimphu Sightseeing", description: "Buddha Dordenma statue and Folk Heritage Museum." },
            { day: 3, title: "Punakha Day Trip", description: "Drive over Dochula Pass. Visit Punakha Dzong." },
            { day: 4, title: "Tiger's Nest Hike", description: "Hike to Paro Taktsang (Tiger's Nest) monastery." },
            { day: 5, title: "Departure", description: "Fly out of Paro." }
        ],
        inclusions: ["Visa fee", "SDF fee", "All meals", "Guide", "Transfers", "Hotels"],
        exclusions: ["Flights to Paro", "Alcohol", "Tips"]
    },
    {
        id: "jordan-petra-wadi-rum",
        title: "Jordan Ancient Wonders",
        location: "Amman, Jordan",
        price: 1550,
        duration: "6 Days / 5 Nights",
        rating: 4.9,
        reviews: 205,
        image: "/Destinations/Des4.jpg",
        overview: "Float in the Dead Sea, explore the rose-red city of Petra, and sleep under stars in Wadi Rum.",
        itinerary: [
            { day: 1, title: "Arrival in Amman", description: "Transfer to hotel. City tour." },
            { day: 2, title: "Jerash & Ajloun", description: "Visit Roman ruins of Jerash." },
            { day: 3, title: "Petra", description: "Full day exploring Petra treasury and monastery." },
            { day: 4, title: "Wadi Rum", description: "Jeep tour in desert. Overnight in luxury bubble tent." },
            { day: 5, title: "Dead Sea", description: "Transfer to Dead Sea resort. Float and relax." },
            { day: 6, title: "Departure", description: "Transfer to Amman Airport." }
        ],
        inclusions: ["Transfers", "Hotels & Camp", "Breakfasts & Dinners", "Guide", "Entry fees"],
        exclusions: ["Flights", "Lunch", "Tips"]
    },
    {
        id: "kerala-backwaters",
        title: "Kerala Backwaters & Hills",
        location: "Cochin, India",
        price: 950,
        duration: "6 Days / 5 Nights",
        rating: 4.7,
        reviews: 190,
        image: "/Destinations/Des5.jpg",
        overview: "God's Own Country. Houseboats, tea plantations, and ayurvedic massages.",
        itinerary: [
            { day: 1, title: "Arrival in Cochin", description: "Transfer to Munnar hill station." },
            { day: 2, title: "Munnar Sightseeing", description: "Tea Museum, Mattupetty Dam, and Eravikulam National Park." },
            { day: 3, title: "Thekkady", description: "Drive to Thekkady. Spice plantation tour. Boat ride." },
            { day: 4, title: "Alleppey Houseboat", description: "Board traditional houseboat. Cruise backwaters overnight." },
            { day: 5, title: "Cochin Tour", description: "Disembark and drive to Cochin. Visit Chinese Fishing Nets." },
            { day: 6, title: "Departure", description: "Transfer to Cochin Airport." }
        ],
        inclusions: ["Private car", "Hotels", "1 night Houseboat (all meals)", "Driver allowance"],
        exclusions: ["Flights", "Entry tickets", "Meals in hotels"]
    },
    {
        id: "prague-vienna-budapest",
        title: "Central Europe Gems",
        location: "Prague, Czech Republic",
        price: 2100,
        duration: "9 Days / 8 Nights",
        rating: 4.8,
        reviews: 350,
        image: "/Destinations/Des6.jpg",
        overview: "The golden triangle of Europe. Imperial architecture, history, and vibrant culture.",
        itinerary: [
            { day: 1, title: "Arrival in Prague", description: "Transfer to hotel." },
            { day: 2, title: "Prague Castle", description: "Castle district and Charles Bridge walking tour." },
            { day: 3, title: "Prague to Vienna", description: "Train to Vienna. Evening concert." },
            { day: 4, title: "Schönbrunn Palace", description: "Tour of imperial summer palace." },
            { day: 5, title: "Vienna to Budapest", description: "Train to Budapest. Danube river cruise." },
            { day: 6, title: "Buda & Pest", description: "Fisherman's Bastion and Parliament tour." },
            { day: 7, title: "Thermal Baths", description: "Relax in Széchenyi Thermal Bath." },
            { day: 8, title: "Free Day", description: "Shopping or museums." },
            { day: 9, title: "Departure", description: "Transfer to Budapest Airport." }
        ],
        inclusions: ["Train tickets", "8 nights hotel", "City tours", "River cruise"],
        exclusions: ["Flights", "Meals", "Bath entry"]
    }
];
