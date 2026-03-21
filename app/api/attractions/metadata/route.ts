import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Attraction from '@/models/Attraction';

export async function GET() {
    try {
        await connectDB();

        const cities = await Attraction.distinct('city');
        const types = await Attraction.distinct('type');
        const categories = await Attraction.distinct('category');

        return NextResponse.json({
            success: true,
            data: {
                cities: cities.filter(Boolean).sort(),
                types: types.filter(Boolean).sort(),
                categories: categories.filter(Boolean).sort()
            }
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
