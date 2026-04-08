import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Tour from '@/models/Tour';
import Stay from '@/models/Stay';
import Rental from '@/models/Rental';
import Sightseeing from '@/models/Sightseeing';
import Activity from '@/models/Activity';
import Attraction from '@/models/Attraction';
import Food from '@/models/Food';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q') || '';
        const location = searchParams.get('location') || '';
        const full = searchParams.get('full') === 'true';

        await connectDB();

        const searchRegex = new RegExp(query, 'i');
        const locationRegex = location ? new RegExp(location, 'i') : null;

        // Helper to construct query
        const getFilter = (titleField: string = 'title', supportsLocation: boolean = true) => {
            const filters: any[] = [];
            if (query) {
                filters.push({ [titleField]: searchRegex });
            }
            if (location && supportsLocation) {
                filters.push({ 
                    $or: [
                        { location: locationRegex },
                        { city: locationRegex },
                        { state: locationRegex },
                        { area: locationRegex }
                    ] 
                });
            }
            
            if (filters.length === 0) return {};
            if (filters.length === 1) return filters[0];
            return { $and: filters };
        };

        // If no query and no location, we might return some featured results or empty
        if (!query && !location) {
            return NextResponse.json({ success: true, data: full ? { tours: [], stays: [], rentals: [], sightseeing: [], activities: [], attractions: [], food: [] } : [] });
        }

        const [tours, stays, rentals, sightseeing, activities, attractions, food] = await Promise.all([
            Tour.find(getFilter('title')).limit(full ? 10 : 3).lean(),
            Stay.find(getFilter('title')).limit(full ? 10 : 3).lean(),
            Rental.find(getFilter('name')).limit(full ? 10 : 3).lean(),
            Sightseeing.find(getFilter('title')).limit(full ? 10 : 3).lean(),
            Activity.find(getFilter('title')).limit(full ? 10 : 3).lean(),
            Attraction.find(getFilter('title')).limit(full ? 10 : 3).lean(),
            Food.find(getFilter('title')).limit(full ? 10 : 3).lean(),
        ]);

        if (full) {
            const mapId = (items: any[]) => items.map(item => ({ ...item, id: (item._id || item.id).toString() }));
            return NextResponse.json({
                success: true,
                data: {
                    tours: mapId(tours),
                    stays: mapId(stays),
                    rentals: mapId(rentals),
                    sightseeing: mapId(sightseeing),
                    activities: mapId(activities),
                    attractions: mapId(attractions),
                    food: mapId(food)
                }
            });
        }

        const formatResults = (items: any[], category: string, titleField: string = 'title') => {
            return items.map(item => {
                let location = item.location || item.city || item.state || item.area || '';
                
                // Handle case where location is an object (common in Activity/Attraction models)
                if (location && typeof location === 'object') {
                    location = (location as any).name || (location as any).address || '';
                }

                return {
                    id: (item._id || item.id).toString(),
                    title: item[titleField],
                    category,
                    location: String(location),
                    type: item.type || category,
                    slug: item.slug || ''
                };
            });
        };

        const results: any[] = [];

        results.push(...formatResults(tours, 'Tour'));
        results.push(...formatResults(stays, 'Stay'));
        results.push(...formatResults(rentals, 'Rental', 'name'));
        results.push(...formatResults(sightseeing, 'Sightseeing'));
        results.push(...formatResults(activities, 'Activity'));
        results.push(...formatResults(attractions, 'Attraction'));
        results.push(...formatResults(food, 'Food'));

        // Sort by relevance (Exact match > Prefix match > Word start match > Contains match)
        results.sort((a, b) => {
            const t1 = (a.title || "").toLowerCase().trim();
            const t2 = (b.title || "").toLowerCase().trim();
            const q = query.toLowerCase().trim();
            
            if (!q) return t1.localeCompare(t2);

            const getScore = (text: string, search: string) => {
                if (text === search) return 100;
                if (text.startsWith(search)) return 80;
                if (text.split(/\s+/).some(word => word.startsWith(search))) return 60;
                if (text.includes(search)) return 40;
                return 0;
            };

            const score1 = getScore(t1, q);
            const score2 = getScore(t2, q);

            if (score1 !== score2) return score2 - score1; // Higher score first
            return t1.localeCompare(t2); // Secondary alphabetical sort
        });

        return NextResponse.json({ success: true, data: results.slice(0, 15) });
    } catch (error) {
        console.error('Search API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
