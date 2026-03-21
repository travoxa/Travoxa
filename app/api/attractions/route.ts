import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Attraction from '@/models/Attraction';
import { slugify, generateAttractionSlug } from '@/utils/slugify';

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const vendorId = searchParams.get('vendorId');
        const admin = searchParams.get('admin');
        const status = searchParams.get('status');

        const query: any = {};
        if (vendorId) {
            query.vendorId = vendorId;
        } else if (admin === 'true') {
            if (status) query.status = status;
        } else {
            query.status = 'approved';
        }

        const attractions = await Attraction.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: attractions }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        console.log('Attraction POST Payload:', JSON.stringify(body, null, 2));

        const slug = body.slug || generateAttractionSlug(body.title, body.city);

        const attractionData = {
            ...body,
            slug,
            status: body.vendorId ? 'pending' : 'approved'
        };

        const attraction = await Attraction.create(attractionData);
        console.log('Created Attraction:', JSON.stringify(attraction, null, 2));
        return NextResponse.json({ success: true, data: attraction }, { status: 201 });
    } catch (error: any) {
        console.error('Attraction POST Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
