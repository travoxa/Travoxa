import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Place from '@/models/Place';
import RecommendationCache from '@/models/RecommendationCache';

export async function POST(req: Request) {
  try {
    const { id, name, category, description, tags, elevation, coordinates, googleMapsLink } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing place ID' }, { status: 400 });
    }

    await connectDB();

    // Prepare update object
    const updateData: any = {
      name,
      category,
      description,
      tags,
      elevation,
      googleMapsLink,
      source: 'manual' // Mark as manually corrected
    };

    if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
      updateData.location = {
        type: 'Point',
        coordinates: [coordinates[0], coordinates[1]] // [lng, lat]
      };
    }

    const updatedPlace = await Place.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedPlace) {
      return NextResponse.json({ success: false, error: 'Place not found' }, { status: 404 });
    }

    // Clear relevant recommendation cache
    // We clear all caches that contain this place to ensure accuracy
    await RecommendationCache.deleteMany({
      results: id
    });

    console.log(`Place updated and cache cleared for: ${id}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Place updated successfully', 
      data: updatedPlace 
    });

  } catch (error: any) {
    console.error('Update place API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
