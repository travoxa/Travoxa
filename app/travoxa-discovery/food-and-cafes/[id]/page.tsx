import { connectDB } from "@/lib/mongodb";
import Food from "@/models/Food";
import Tour from "@/models/Tour";
import Sightseeing from "@/models/Sightseeing";
import Activity from "@/models/Activity";
import Rental from "@/models/Rental";
import Stay from "@/models/Stay";
import Attraction from "@/models/Attraction";
import { notFound } from "next/navigation";
import FoodDetailsClient from "./FoodDetailsClient";

export const dynamic = "force-dynamic";

async function getFood(id: string) {
    await connectDB();
    Tour.find().limit(1); Sightseeing.find().limit(1); Activity.find().limit(1); Rental.find().limit(1); Stay.find().limit(1); Food.find().limit(1); Attraction.find().limit(1);

    let food = null;

    // Try finding by slug first
    food = await Food.findOneAndUpdate(
        { slug: id },
        { $inc: { views: 1 } },
        { new: true }
    )
        .populate('relatedTours', 'title image _id googleRating rating location city state slug')
        .populate('relatedSightseeing', 'title image _id rating location city state slug')
        .populate('relatedActivities', 'title image _id rating location city state slug')
        .populate('relatedRentals', 'title name image _id rating location city state slug')
        .populate('relatedStays', 'title name image _id rating location city state slug')
        .populate('relatedFood', 'name image _id rating location city state cuisine slug')
        .populate('relatedAttractions', 'title image _id rating location city state type category slug')
        .lean();

    // If not found, try by ID if it's a valid ObjectId
    if (!food && id.match(/^[0-9a-fA-F]{24}$/)) {
        food = await Food.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        )
            .populate('relatedTours', 'title image _id googleRating rating location city state slug')
            .populate('relatedSightseeing', 'title image _id rating location city state slug')
            .populate('relatedActivities', 'title image _id rating location city state slug')
            .populate('relatedRentals', 'title name image _id rating location city state slug')
            .populate('relatedStays', 'title name image _id rating location city state slug')
            .populate('relatedFood', 'name image _id rating location city state cuisine slug')
            .populate('relatedAttractions', 'title image _id rating location city state type category slug')
            .lean();
    }

    if (!food) return null;

    const parsedFood = JSON.parse(JSON.stringify(food));
    parsedFood.id = parsedFood._id.toString();

    return parsedFood;
}

export default async function FoodDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const food = await getFood(id);

    if (!food) {
        notFound();
    }

    return <FoodDetailsClient pkg={food as any} />;
}
