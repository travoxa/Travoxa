export interface RentalItem {
    id: number;
    name: string;
    type: string;
    model: string;
    rating: number;
    reviews: number;
    mileage: string;
    seats: string;
    fuel: string;
    helmet: string;
    price: number;
    image: string;
    verified: boolean;
    location: string;
}

// All rental items are now managed through the admin panel
// and stored in the database. This file only contains the TypeScript interface.
// Empty array exported for backward compatibility with components that use it
export const rentalsData: RentalItem[] = [];
