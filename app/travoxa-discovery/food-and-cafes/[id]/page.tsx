import { connectDB } from "@/lib/mongodb";
import Food from "@/models/Food";
import { notFound } from "next/navigation";
import FoodDetailsClient from "./FoodDetailsClient";

export const dynamic = "force-dynamic";

async function getFood(id: string) {
    await connectDB();
    const food = await Food.findById(id).lean();
    if (!food) return null;

    return {
        ...food,
        _id: (food._id as any).toString(),
        id: (food._id as any).toString(),
        category: (food as any).type,
        createdAt: (food as any).createdAt ? new Date((food as any).createdAt).toISOString() : null,
        fullMenu: (food as any).fullMenu ? (food as any).fullMenu.map((cat: any) => ({
            ...cat,
            _id: cat._id?.toString(),
            items: cat.items?.map((item: any) => ({
                ...item,
                _id: item._id?.toString()
            }))
        })) : []
    };
}

export default async function FoodDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const food = await getFood(id);

    if (!food) {
        notFound();
    }

    return <FoodDetailsClient pkg={food as any} />;
}
