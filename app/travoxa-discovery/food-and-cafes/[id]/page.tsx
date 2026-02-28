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

    const food = await Food.findById(id)
        .populate('relatedTours', 'title image _id googleRating rating location city state')
        .populate('relatedSightseeing', 'title image _id rating location city state')
        .populate('relatedActivities', 'title image _id rating location city state')
        .populate('relatedRentals', 'title name image _id rating location city state')
        .populate('relatedStays', 'title name image _id rating location city state')
        .populate('relatedFood', 'name image _id rating location city state cuisine')
        .populate('relatedAttractions', 'title image _id rating location city state type category')
        .lean();

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
