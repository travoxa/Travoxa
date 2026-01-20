import { rentalsData, RentalItem } from "@/data/rentalsData";
import { sightseeingPackages, SightseeingPackage } from "@/data/sightseeingData";
import { tourData, TourPackage } from "@/data/tourData";

export interface SearchResults {
    rentals: RentalItem[];
    sightseeing: SightseeingPackage[];
    tours: TourPackage[];
}

export const searchUniversal = (query: string, location: string): SearchResults => {
    const normalize = (str: string) => str.toLowerCase().trim();
    const q = normalize(query);
    const loc = normalize(location);

    const hasQuery = q.length > 0;
    const hasLoc = loc.length > 0;

    if (!hasQuery && !hasLoc) {
        return { rentals: [], sightseeing: [], tours: [] };
    }

    // Rentals
    const rentals = rentalsData.filter(item => {
        const matchLoc = hasLoc ? normalize(item.location).includes(loc) : true;
        const matchQuery = hasQuery ? (
            normalize(item.name).includes(q) ||
            normalize(item.type).includes(q) ||
            normalize(item.model).includes(q)
        ) : true;
        return matchLoc && matchQuery;
    });

    // Sightseeing
    const sightseeing = sightseeingPackages.filter(item => {
        const matchLoc = hasLoc ? (
            normalize(item.city).includes(loc) ||
            normalize(item.state).includes(loc)
        ) : true;
        const matchQuery = hasQuery ? (
            normalize(item.title).includes(q) ||
            item.placesCovered.some(p => normalize(p).includes(q))
        ) : true;
        return matchLoc && matchQuery;
    });

    // Tours
    const tours = tourData.filter(item => {
        const matchLoc = hasLoc ? normalize(item.location).includes(loc) : true;
        const matchQuery = hasQuery ? (
            normalize(item.title).includes(q) ||
            normalize(item.location).includes(q)
        ) : true;
        return matchLoc && matchQuery;
    });

    // If only Query is provided, search all location fields as well if no direct text match found?
    // The requirement says: "if the user only enterd a location name... search for everything on that"
    // Our logic handles "hasLoc" to filter by location fields.
    // If user enters location in the main "Search" input (query), we might want to check location fields there too.

    if (hasQuery && !hasLoc) {
        // Double check if 'q' matches location fields in data when 'loc' is empty
        const rentalsByLoc = rentalsData.filter(item => normalize(item.location).includes(q));
        const sightseeingByLoc = sightseeingPackages.filter(item => normalize(item.city).includes(q) || normalize(item.state).includes(q));
        const toursByLoc = tourData.filter(item => normalize(item.location).includes(q));

        // Merge unique results
        const merge = <T extends { id: string | number }>(arr1: T[], arr2: T[]) => {
            const map = new Map();
            arr1.forEach(i => map.set(i.id, i));
            arr2.forEach(i => map.set(i.id, i));
            return Array.from(map.values());
        };

        return {
            rentals: merge(rentals, rentalsByLoc),
            sightseeing: merge(sightseeing, sightseeingByLoc),
            tours: merge(tours, toursByLoc)
        };
    }

    return { rentals, sightseeing, tours };
};
