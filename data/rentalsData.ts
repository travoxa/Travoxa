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
    helmet: string; // or "Self Drive" for consistency with previous data, though maybe 'features' would be better? keeping faithful to original for now
    price: number;
    image: string;
    verified: boolean;
    location: string;
}

export const rentalsData: RentalItem[] = [
    {
        id: 1,
        name: "Honda Activa 6G",
        type: "Scooter",
        model: "2023 MODEL",
        rating: 4.6,
        reviews: 120,
        mileage: "45 km/l",
        seats: "2 Seats",
        fuel: "Petrol",
        helmet: "Helmet Included",
        price: 399,
        image: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&q=80&w=600",
        verified: true,
        location: "Calangute, Goa"
    },
    {
        id: 2,
        name: "Royal Enfield Classic 350",
        type: "Bike",
        model: "2023 MODEL",
        rating: 4.8,
        reviews: 95,
        mileage: "35 km/l",
        seats: "2 Seats",
        fuel: "Petrol",
        helmet: "Helmet Included",
        price: 899,
        image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600",
        verified: true,
        location: "Calangute, Goa"
    },
    {
        id: 3,
        name: "Thar 4x4 Convertible",
        type: "Car",
        model: "2022 MODEL",
        rating: 4.9,
        reviews: 210,
        mileage: "15 km/l",
        seats: "4 Seats",
        fuel: "Diesel",
        helmet: "Self Drive",
        price: 3500,
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600",
        verified: true,
        location: "Panjim, Goa"
    }
];
