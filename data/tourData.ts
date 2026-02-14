
export interface TourPackage {
    id: string;
    title: string;
    location: string;
    price: number;
    duration: string; // e.g. "5 Days / 4 Nights"
    rating: number;
    reviews: number;
    image: string | string[]; // Support both single image (static) and array (MongoDB)
    overview: string;
    itinerary: {
        day: number;
        title: string;
        description: string;
    }[];
    inclusions: string[];
    exclusions: string[];
    availabilityDate?: string; // New field for MongoDB tours
    maxPeople?: string; // New field for MongoDB tours
    earlyBirdDiscount?: number; // New field for MongoDB tours
    meals?: string[]; // New field for MongoDB tours
}

// No static tour data - all tours come from MongoDB
export const tourData: TourPackage[] = [];
