import NormalHeader from "@/components/ui/NormalHeader";
import Footer from "@/components/ui/Footer";
import { notFound } from "next/navigation";
import Tour from "@/models/Tour";
import { connectDB } from "@/lib/mongodb";
import SmartTripConfigurator from "@/components/tour/SmartTripConfigurator";
import Image from 'next/image';
import { HiArrowSmLeft, HiBadgeCheck, HiStar } from 'react-icons/hi';
import Link from 'next/link';

async function getTourById(id: string) {
    try {
        await connectDB();
        const tour = await Tour.findById(id).populate('relatedActivities').lean();
        if (tour) {
            return JSON.parse(JSON.stringify(tour));
        }
    } catch (error) {
        console.error('[BOOK PAGE] Error fetching from DB:', error);
    }
    return null;
}

interface PageProps {
    params: Promise<{
        id: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BookTourPage({ params, searchParams }: PageProps) {
    const { id } = await params;
    const { notes } = await searchParams;
    const tour = await getTourById(id);

    if (!tour) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50/50 pt-[64px] lg:pt-[80px]">
            <NormalHeader logoHeight="h-[22px] lg:h-[28px]" />

            <div className="bg-white border-b border-gray-100 py-6 sticky top-[64px] lg:top-[80px] z-30 shadow-sm overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 -mr-12 scale-150">
                    <Image src="/logo.png" alt="logo" width={200} height={200} />
                </div>
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 relative">
                        <Link href={`/tour/${id}`} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black transition-colors shrink-0">
                            <HiArrowSmLeft size={24} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-full tracking-widest flex items-center gap-1">
                                    <HiStar /> Travoxa Smart Builder
                                </span>
                            </div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate max-w-[300px] md:max-w-md">
                                Customize: {tour.title}
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="bg-green-50 px-4 py-2 rounded-xl flex items-center gap-2 shrink-0">
                            <HiBadgeCheck className="text-green-600 text-lg" />
                            <div>
                                <p className="text-[10px] text-green-700 font-bold uppercase tracking-wider">Verified Package</p>
                                <p className="text-xs font-bold text-gray-700">Best Price Guaranteed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-12 pb-12">
                <SmartTripConfigurator tour={tour} initialNotes={Array.isArray(notes) ? notes[0] : notes} />
            </div>

            <Footer />
        </main>
    );
}
