import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';

// Import all models that vendors can create
import Tour from '@/models/Tour';
import Activity from '@/models/Activity';
import Rental from '@/models/Rental';
import Sightseeing from '@/models/Sightseeing';
import Stay from '@/models/Stay';
import Food from '@/models/Food';

export async function POST(req: Request) {
    try {
        await connectDB();

        const { id, collectionType, status } = await req.json();

        if (!id || !collectionType || !status) {
            return NextResponse.json(
                { success: false, error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return NextResponse.json(
                { success: false, error: 'Invalid status' },
                { status: 400 }
            );
        }

        let Model;
        switch (collectionType.toLowerCase()) {
            case 'tours':
                Model = Tour;
                break;
            case 'activities':
                Model = Activity;
                break;
            case 'rentals':
                Model = Rental;
                break;
            case 'sightseeing':
                Model = Sightseeing;
                break;
            case 'stay':
                Model = Stay;
                break;
            case 'food':
                Model = Food;
                break;
            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid collection type' },
                    { status: 400 }
                );
        }

        const updatedItem = await Model.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedItem) {
            return NextResponse.json(
                { success: false, error: 'Item not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: updatedItem });
    } catch (error: any) {
        console.error('Error updating vendor request status:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to update status' },
            { status: 500 }
        );
    }
}
