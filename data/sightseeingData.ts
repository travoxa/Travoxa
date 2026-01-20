
export interface SightseeingPackage {
    id: string;
    title: string;
    city: string;
    state: string;
    duration: string; // e.g., "Full Day (8 Hours)"
    maxPeople: number;
    vehicleType: "Sedan" | "SUV" | "Tempo Traveller" | "Mini Bus";
    highlights: string[];
    placesCovered: string[];
    price: number;
    priceType: "per_vehicle" | "per_person";
    overview: string;
    itinerary: {
        time?: string;
        title: string;
        description: string;
    }[];
    inclusions: string[];
    exclusions: string[];
    image: string;
    rating: number;
    reviews: number;
    isPrivate: boolean;
}

export const sightseeingPackages: SightseeingPackage[] = [
    {
        id: "jaipur-full-day-sedan",
        title: "Jaipur Heritage Full Day Tour",
        city: "Jaipur",
        state: "Rajasthan",
        duration: "Full Day (8 Hours)",
        maxPeople: 4,
        vehicleType: "Sedan",
        highlights: ["Amber Fort", "Hawa Mahal", "Jal Mahal"],
        placesCovered: ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar", "Jal Mahal"],
        price: 2500,
        priceType: "per_vehicle",
        overview: "Explore the Pink City in comfort with a private sedan. Visit the majestic Amber Fort, the iconic Hawa Mahal, and the royal City Palace. Perfect for couples or small families.",
        itinerary: [
            { time: "9:00 AM", title: "Pickup", description: "Pickup from your hotel or residence in Jaipur." },
            { time: "9:30 AM", title: "Amber Fort", description: "Explore the magnificent hill fort and its palaces." },
            { time: "12:00 PM", title: "Jal Mahal", description: "Photo stop at the Water Palace." },
            { time: "1:00 PM", title: "Lunch", description: "Break for traditional Rajasthani lunch (own expense)." },
            { time: "2:00 PM", title: "City Palace & Jantar Mantar", description: "Visit the royal residence and the ancient observatory." },
            { time: "4:00 PM", title: "Hawa Mahal", description: "Visit the Palace of Winds." },
            { time: "5:00 PM", title: "Local Markets", description: "Short visit to Johari Bazaar for shopping." },
            { time: "6:00 PM", title: "Drop-off", description: "Drop back at your hotel." }
        ],
        inclusions: ["Private AC Sedan", "Driver Allowance", "Fuel & Parking", "Water Bottle"],
        exclusions: ["Monument Entry Fees", "Lunch", "Guide Tips"],
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=800",
        rating: 4.8,
        reviews: 125,
        isPrivate: true
    },
    {
        id: "jaipur-full-day-suv",
        title: "Jaipur Royal Sightseeing",
        city: "Jaipur",
        state: "Rajasthan",
        duration: "Full Day (9 Hours)",
        maxPeople: 6,
        vehicleType: "SUV",
        highlights: ["Nahargarh Fort", "Amber Fort", "Sunset View"],
        placesCovered: ["Amber Fort", "Nahargarh Fort", "Jaigarh Fort"],
        price: 3500,
        priceType: "per_vehicle",
        overview: "A spacious SUV tour covering the three famous forts of Jaipur including the sunset view from Nahargarh.",
        itinerary: [
            { time: "9:00 AM", title: "Pickup", description: "Pickup from hotel." },
            { time: "10:00 AM", title: "Amber Fort", description: "Detailed tour of Amber Fort." },
            { time: "1:00 PM", title: "Jaigarh Fort", description: "Visit Jaigarh and the world's largest cannon." },
            { time: "3:00 PM", title: "Nahargarh Fort", description: "Explore Nahargarh and enjoy sunset views over the city." },
            { time: "6:00 PM", title: "Drop-off", description: "Return to hotel." }
        ],
        inclusions: ["Private AC SUV (Innova/Crysta)", "Driver", "Toll & Parking"],
        exclusions: ["Entry Tickets", "Meals"],
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=800",
        rating: 4.9,
        reviews: 89,
        isPrivate: true
    },
    {
        id: "delhi-darshan-bus",
        title: "Delhi Darshan Bus Tour",
        city: "New Delhi",
        state: "Delhi",
        duration: "Full Day (10 Hours)",
        maxPeople: 20,
        vehicleType: "Mini Bus",
        highlights: ["Red Fort", "Lotus Temple", "India Gate"],
        placesCovered: ["Red Fort", "Raj Ghat", "India Gate", "Lotus Temple", "Qutub Minar"],
        price: 499,
        priceType: "per_person",
        overview: "Join our economical shared bus tour to see the best of Old and New Delhi in a single day.",
        itinerary: [
            { time: "8:30 AM", title: "Pickup", description: "Pickup from central meeting point." },
            { time: "9:30 AM", title: "Red Fort", description: "Visit the historic Red Fort (outside view if closed)." },
            { time: "11:00 AM", title: "Raj Ghat", description: "Pay respects at Mahatma Gandhi's memorial." },
            { time: "1:00 PM", title: "India Gate", description: "Drive past India Gate and President's House." },
            { time: "3:00 PM", title: "Lotus Temple", description: "Visit the Bahá'í House of Worship." },
            { time: "5:00 PM", title: "Qutub Minar", description: "Visit the tallest brick minaret." },
            { time: "6:30 PM", title: "Drop-off", description: "Return to meeting point." }
        ],
        inclusions: ["AC Bus Seat", "Guide"],
        exclusions: ["Entry Tickets", "Meals", "Pickup from Hotel"],
        image: "https://images.unsplash.com/photo-1545231027-637d2f6210f8?auto=format&fit=crop&q=80&w=800",
        rating: 4.2,
        reviews: 340,
        isPrivate: false
    },
    {
        id: "udaipur-lakes-sedan",
        title: "Udaipur City of Lakes Tour",
        city: "Udaipur",
        state: "Rajasthan",
        duration: "Full Day (8 Hours)",
        maxPeople: 4,
        vehicleType: "Sedan",
        highlights: ["City Palace", "Lake Pichola", "Saheliyon Ki Bari"],
        placesCovered: ["City Palace", "Jagdish Temple", "Lake Pichola (Boat Ride)", "Saheliyon Ki Bari", "Fateh Sagar Lake"],
        price: 2200,
        priceType: "per_vehicle",
        overview: "Discover the romantic city of Udaipur. Visit majestic palaces and enjoy serene lake views.",
        itinerary: [
            { title: "Morning", description: "Visit City Palace and Jagdish Temple." },
            { title: "Afternoon", description: "Boat ride on Lake Pichola (ticket extra)." },
            { title: "Evening", description: "Sunset at Fateh Sagar Lake or Monsoon Palace." }
        ],
        inclusions: ["AC Sedan", "Driver"],
        exclusions: ["Boat Ride Tickets", "Entry Fees", "Lunch"],
        image: "https://images.unsplash.com/photo-1590050752117-238cb0fb32b6?auto=format&fit=crop&q=80&w=800", /* Placeholder replaced with Mysore Palace for similarity or find better URL */
        rating: 4.7,
        reviews: 95,
        isPrivate: true
    },
    {
        id: "kerala-munnar-sightseeing",
        title: "Munnar Hills Sightseeing",
        city: "Munnar",
        state: "Kerala",
        duration: "Full Day",
        maxPeople: 6,
        vehicleType: "SUV",
        highlights: ["Tea Museum", "Mattupetty Dam", "Echo Point"],
        placesCovered: ["Tea Museum", "Mattupetty Dam", "Echo Point", "Top Station", "Eravikulam National Park"],
        price: 3000,
        priceType: "per_vehicle",
        overview: "Breath in the fresh air of Munnar's tea gardens. A refreshing tour of the hill station's best spots.",
        itinerary: [
            { title: "9:00 AM", description: "Pickup and proceed to Eravikulam National Park." },
            { title: "12:00 PM", description: "Visit Tea Museum." },
            { title: "2:00 PM", description: "Mattupetty Dam and boating." },
            { title: "4:00 PM", description: "Echo Point and Top Station." }
        ],
        inclusions: ["AC SUV", "Driver cum Guide"],
        exclusions: ["Park Entry Fees", "Boating Fees"],
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800",
        rating: 4.9,
        reviews: 210,
        isPrivate: true
    },
    {
        id: "agra-taj-mahal-tour",
        title: "Agra Taj Mahal & Fort Tour",
        city: "Agra",
        state: "Uttar Pradesh",
        duration: "Half Day (5 Hours)",
        maxPeople: 4,
        vehicleType: "Sedan",
        highlights: ["Taj Mahal", "Agra Fort"],
        placesCovered: ["Taj Mahal", "Agra Fort", "Mehtab Bagh"],
        price: 1800,
        priceType: "per_vehicle",
        overview: "Seamless tour of the Taj Mahal and Agra Fort. Perfect for travelers arriving by train.",
        itinerary: [
            { title: "Pickup", description: "Pickup from Agra Cantonment Station or Hotel." },
            { title: "Taj Mahal", description: "Guided tour of the Taj Mahal." },
            { title: "Agra Fort", description: "Explore the massive red sandstone fort." },
            { title: "Drop", description: "Drop back at station/hotel." }
        ],
        inclusions: ["AC Sedan", "Parking"],
        exclusions: ["Guide", "Entry Tickets"],
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800",
        rating: 5.0,
        reviews: 500,
        isPrivate: true
    },
    {
        id: "goa-north-tour",
        title: "North Goa Beach & Fort Tour",
        city: "Goa",
        state: "Goa",
        duration: "Full Day",
        maxPeople: 4,
        vehicleType: "Sedan",
        highlights: ["Baga Beach", "Fort Aguada", "Calangute"],
        placesCovered: ["Fort Aguada", "Sinquerim Beach", "Candolim", "Calangute", "Baga", "Anjuna"],
        price: 2000,
        priceType: "per_vehicle",
        overview: "Hit the most famous beaches and forts of North Goa in your own private car.",
        itinerary: [
            { title: "Start", description: "Pickup from hotel in North Goa." },
            { title: "Forts", description: "Visit Fort Aguada and lighthouse." },
            { title: "Beaches", description: "Hop through Calangute, Baga and Anjuna beaches." }
        ],
        inclusions: ["AC Car", "Fuel"],
        exclusions: ["Food", "Water Sports"],
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800",
        rating: 4.6,
        reviews: 180,
        isPrivate: true
    },
    {
        id: "mumbai-city-lights",
        title: "Mumbai City Lights Evening Tour",
        city: "Mumbai",
        state: "Maharashtra",
        duration: "4 Hours",
        maxPeople: 4,
        vehicleType: "Sedan",
        highlights: ["Marine Drive", "Gateway of India", "CST Station"],
        placesCovered: ["Gateway of India", "Taj Mahal Palace Hotel", "Marine Drive", "CST Station (Night View)"],
        price: 1800,
        priceType: "per_vehicle",
        overview: "See the City of Dreams come alive at night. Drive past the Queens Necklace and colonial landmarks.",
        itinerary: [
            { title: "6:00 PM", description: "Pickup." },
            { title: "Gateway", description: "Gateway of India and Taj Hotel." },
            { title: "Drive", description: "Drive along Marine Drive." },
            { title: "CST", description: "View the illuminated CST station." }
        ],
        inclusions: ["AC Sedan", "Driver"],
        exclusions: ["Food"],
        image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=800",
        rating: 4.8,
        reviews: 210,
        isPrivate: true
    },
    {
        id: "amritsar-golden-temple",
        title: "Amritsar Golden Temple & Wagah Border",
        city: "Amritsar",
        state: "Punjab",
        duration: "Full Day",
        maxPeople: 6,
        vehicleType: "SUV",
        highlights: ["Golden Temple", "Jallianwala Bagh", "Wagah Border"],
        placesCovered: ["Golden Temple", "Jallianwala Bagh", "Wagah Border Ceremony"],
        price: 3200,
        priceType: "per_vehicle",
        overview: "Spiritual morning at the Golden Temple followed by the patriotic beating retreat ceremony at Wagah Border.",
        itinerary: [
            { title: "Morning", description: "Golden Temple and Jallianwala Bagh." },
            { title: "Lunch", description: "Kulcha time (own expense)." },
            { title: "Afternoon", description: "Drive to Wagah Border." },
            { title: "Evening", description: "Wagah Border Ceremony." }
        ],
        inclusions: ["SUV", "Parking", "Border Pass assistance"],
        exclusions: ["Meals"],
        image: "https://images.unsplash.com/photo-1596420551522-835698b68875?auto=format&fit=crop&q=80&w=800",
        rating: 4.9,
        reviews: 400,
        isPrivate: true
    }
];
