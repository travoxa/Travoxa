import { tourData } from "@/data/tourData";
import NormalHeader from "@/components/ui/NormalHeader";
import Footer from "@/components/ui/Footor";
import Image from "next/image";
import { notFound } from "next/navigation";
import { HiCheck, HiX, HiCalendar, HiLocationMarker, HiDownload, HiUserGroup, HiCurrencyRupee, HiChevronDown, HiChevronUp, HiBadgeCheck, HiPhone, HiGlobeAlt } from "react-icons/hi";
import { MdRestaurant, MdHotel, MdCameraAlt, MdDirectionsBus, MdLocalFireDepartment, MdHiking, MdParagliding, MdLandscape, MdTempleHindu } from "react-icons/md";
import HeroCarousel from "@/components/tour/HeroCarousel";
import SaveButton from "@/components/ui/SaveButton";
import BookingWidget from "@/components/tour/BookingWidget";


import Tour from "@/models/Tour";
import { connectDB } from "@/lib/mongodb";
import Sightseeing from '@/models/Sightseeing';
import Activity from '@/models/Activity';
import Rental from '@/models/Rental';
import Stay from '@/models/Stay';
import Food from '@/models/Food';
import Attraction from '@/models/Attraction';
import RelatedPackages from '@/components/ui/RelatedPackages';

// Helper for Highlight Icons
const getHighlightIcon = (highlight: string) => {
    switch (highlight.toLowerCase()) {
        case 'meals': return <MdRestaurant />;
        case 'hotel': return <MdHotel />;
        case 'sightseeing': return <MdCameraAlt />;
        case 'transport': return <MdDirectionsBus />;
        case 'bonfire': return <MdLocalFireDepartment />;
        case 'trek': return <MdHiking />;
        case 'adventure': return <MdParagliding />;
        case 'nature': return <MdLandscape />;
        case 'culture': return <MdTempleHindu />;
        default: return <HiCheck />;
    }
};

const ensureProtocol = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
};

// Client Component wrapper for Accordion (since this is an async server component, we need a small client component or just make this part interactive. 
// Actually, it's better to make a separate Client Component for the Itinerary if we want interaction. 
// However, I can't easily split files right now without creating new ones. 
// I will instead mark this page as 'use client' if I can? No, it has async data fetching.
// I will create a small inner component for the Accordion or just use <details> for native accordion which requires no JS state!)
// <details> is the best solution here to avoid refactoring to Client Component.


// Fetch tour from API (MongoDB) or static data
// Fetch tour from API (MongoDB) or static data
async function getTourById(id: string) {
    // First try to fetch from MongoDB directly
    try {
        await connectDB();
        // pre-register models to ensure population works
        Sightseeing.find().limit(1); Activity.find().limit(1); Rental.find().limit(1); Stay.find().limit(1); Food.find().limit(1); Attraction.find().limit(1);

        const tour = await Tour.findById(id)
            .populate('relatedTours', 'title image _id googleRating rating location city state')
            .populate('relatedSightseeing', 'title image _id rating location city state')
            .populate('relatedActivities', 'title image _id rating location city state')
            .populate('relatedRentals', 'title name image _id rating location city state')
            .populate('relatedStays', 'title name image _id rating location city state')
            .populate('relatedFood', 'name image _id rating location city state cuisine')
            .populate('relatedAttractions', 'title image _id rating location city state type category')
            .lean();

        if (tour) {
            console.log('[DETAIL PAGE] Found MongoDB tour with id:', id);
            // Serialize _id and dates to simple strings to pass to components
            return {
                ...JSON.parse(JSON.stringify(tour)),
                _id: tour._id.toString(),
                id: tour._id.toString(),
                createdAt: tour.createdAt ? new Date(tour.createdAt).toISOString() : undefined,
                updatedAt: tour.updatedAt ? new Date(tour.updatedAt).toISOString() : undefined,
                availabilityBatches: tour.availabilityBatches ? tour.availabilityBatches.map((batch: any) => ({
                    ...batch,
                    _id: batch._id ? batch._id.toString() : undefined,
                })) : [],
                pricing: tour.pricing ? tour.pricing.map((p: any) => ({
                    people: p.people,
                    hotelType: p.hotelType,
                    rooms: p.rooms,
                    packagePrice: p.packagePrice,
                    pricePerPerson: p.pricePerPerson,
                    _id: p._id ? p._id.toString() : undefined
                })) : [],
            };
        }
    } catch (error) {
        console.error('[DETAIL PAGE] Error fetching from DB:', error);
    }

    // Fallback to static data
    const staticTour = tourData.find(t => t.id === id);
    if (staticTour) {
        console.log('[DETAIL PAGE] Found static tour with id:', id);
    }
    return staticTour;
}

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/lib/models/User";

export default async function TourDetailPage({ params }: PageProps) {
    const { id } = await params;
    const pkg = await getTourById(id);

    if (!pkg) {
        console.error('[DETAIL PAGE] Tour not found for id:', id);
        notFound();
    }

    // specific logic for phone number
    let userPhone = '';
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
        await connectDB();
        const user = await User.findOne({ email: session.user.email });
        if (user && user.phone) {
            userPhone = user.phone;
        }
    }

    // Normalize images to always be an array
    const images = Array.isArray(pkg.image) ? pkg.image : [pkg.image];

    return (
        <main className="min-h-screen bg-white">
            <NormalHeader logoHeight="h-[22px] lg:h-[28px]" />


            {/* Hero Section with Carousel */}
            <HeroCarousel
                images={images}
                title={pkg.title}
                rating={pkg.rating}
                reviews={pkg.reviews}
                location={pkg.location}
                duration={pkg.duration}
                itemId={pkg._id ? pkg._id.toString() : pkg.id}
                itemType="tour"
                itemLink={`/tour/${pkg._id ? pkg._id.toString() : pkg.id}`}
                hideControls={true}
            />

            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">


                    {/* Overview */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            Overview
                            <SaveButton
                                itemId={pkg._id ? pkg._id.toString() : pkg.id}
                                itemType="tour"
                                title={pkg.title}
                                itemLink={`/tour/${pkg._id ? pkg._id.toString() : pkg.id}`}
                            />
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {pkg.overview}
                        </p>
                    </section>

                    {/* Location Details */}
                    {(pkg.location || pkg.pickupLocation || pkg.dropLocation) && (
                        <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col gap-6">
                            {/* Main Destination */}
                            {pkg.location && (
                                <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                                        <HiLocationMarker size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Destination</p>
                                        <p className="font-semibold text-gray-900 text-lg">{pkg.location}</p>
                                        {pkg.locationMapLink && (
                                            <a href={ensureProtocol(pkg.locationMapLink)} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xs font-semibold hover:underline mt-1 inline-block">
                                                View on Map
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pkg.pickupLocation && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm shrink-0">
                                            <HiLocationMarker size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Pickup Location</p>
                                            <p className="font-semibold text-gray-900">{pkg.pickupLocation}</p>
                                            {pkg.pickupMapLink && (
                                                <a href={ensureProtocol(pkg.pickupMapLink)} target="_blank" rel="noopener noreferrer" className="text-green-600 text-xs font-semibold hover:underline mt-1 inline-block">
                                                    View on Map
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {pkg.dropLocation && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-500 shadow-sm shrink-0">
                                            <HiLocationMarker size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Drop Location</p>
                                            <p className="font-semibold text-gray-900">{pkg.dropLocation}</p>
                                            {pkg.dropMapLink && (
                                                <a href={ensureProtocol(pkg.dropMapLink)} target="_blank" rel="noopener noreferrer" className="text-red-500 text-xs font-semibold hover:underline mt-1 inline-block">
                                                    View on Map
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Highlights */}
                    {pkg.highlights && pkg.highlights.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Trip Highlights</h2>
                            <div className="flex flex-wrap gap-4">
                                {pkg.highlights.map((h: string, i: number) => (
                                    <div key={i} className="flex flex-col items-center justify-center gap-2 bg-gray-50 border border-gray-100 p-4 rounded-xl min-w-[80px]">
                                        <div className="text-2xl text-green-600">
                                            {getHighlightIcon(h)}
                                        </div>
                                        <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">{h}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}






                    {/* Itinerary */}
                    {pkg.itinerary && pkg.itinerary.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">Itinerary</h2>
                            <div className="relative space-y-8 pb-12 overflow-hidden">
                                {/* Global Solid Line - Bolder */}
                                <div className="absolute left-11 top-0 bottom-0 w-2 bg-green-200" />

                                {pkg.itinerary.map((item: any, index: number) => (
                                    <div key={index} className="relative pl-28">
                                        {/* Mask for Line (First Item - Top Half) */}
                                        {index === 0 && (
                                            <div className="absolute left-0 top-0 bottom-1/2 w-24 bg-white z-10" />
                                        )}

                                        {/* Mask for Line (Last Item - Bottom Half + Infinite) */}
                                        {index === pkg.itinerary.length - 1 && (
                                            <div className="absolute left-0 top-1/2 h-[9999px] w-24 bg-white z-10" />
                                        )}

                                        {/* Gradient Tail (Last Item) - Bolder */}
                                        {index === pkg.itinerary.length - 1 && (
                                            <div className="absolute left-11 top-1/2 h-40 w-2 bg-gradient-to-b from-green-200 to-transparent z-10" />
                                        )}

                                        {/* Timeline Dot/Badge - Larger & Centered */}
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-white py-2 z-20">
                                            <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-lg border-4 border-green-50 shadow-sm">
                                                D{item.day}
                                            </div>
                                        </div>

                                        <details open className="group bg-white border border-gray-200 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden relative z-20">
                                            <summary className="flex cursor-pointer items-center justify-between p-6 text-gray-900 font-medium">
                                                <h3 className="text-lg font-bold">{item.title}</h3>
                                                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                                    <HiChevronDown size={20} className="text-gray-400" />
                                                </span>
                                            </summary>

                                            <div className="p-6 pt-0 border-t border-gray-100 bg-gray-50/50">
                                                <p className="text-gray-600 leading-relaxed mb-6">{item.description}</p>

                                                {/* Day Details Grid */}
                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                    {item.stay && (
                                                        <div className="p-3 bg-white rounded-xl border border-gray-200">
                                                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Stay</p>
                                                            <p className="text-sm font-semibold text-gray-800">{item.stay}</p>
                                                        </div>
                                                    )}
                                                    {item.activity && (
                                                        <div className="p-3 bg-white rounded-xl border border-gray-200">
                                                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Activity</p>
                                                            <p className="text-sm font-semibold text-gray-800">{item.activity}</p>
                                                        </div>
                                                    )}
                                                    {item.meal && (
                                                        <div className="p-3 bg-white rounded-xl border border-gray-200">
                                                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Meals</p>
                                                            <p className="text-sm font-semibold text-gray-800">{item.meal}</p>
                                                        </div>
                                                    )}
                                                    {item.transfer && (
                                                        <div className="p-3 bg-white rounded-xl border border-gray-200">
                                                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Transfer</p>
                                                            <p className="text-sm font-semibold text-gray-800">{item.transfer}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </details>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Partners Info Section */}
                    {pkg.partners && pkg.partners.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Tour Partners</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pkg.partners.map((partner: any, idx: number) => (
                                    <div key={idx} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-4">
                                        <div className="flex items-center gap-4">
                                            {partner.logo ? (
                                                <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                                    <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain p-1" />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                                                    <span className="text-gray-400 text-xs font-medium">No Logo</span>
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                                    {partner.name}
                                                    {partner.isVerified && <HiBadgeCheck className="text-blue-500 text-xl" title="Verified Partner" />}
                                                </h3>
                                                {(partner.location || partner.state) && (
                                                    <p className="text-sm text-gray-500 flex items-start gap-1 mt-1">
                                                        <HiLocationMarker className="text-gray-400 mt-0.5 shrink-0" />
                                                        <span>
                                                            {partner.location}{partner.location && partner.state ? ', ' : ''}{partner.state}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {(partner.phone || partner.website) && (
                                            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                                                {partner.phone && (
                                                    <a href={`tel:${partner.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                                                        <HiPhone className="text-gray-400" />
                                                        <span>{partner.phone}</span>
                                                    </a>
                                                )}
                                                {partner.website && (
                                                    <a href={ensureProtocol(partner.website)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline transition-colors">
                                                        <HiGlobeAlt className="text-gray-400" />
                                                        <span>Visit Website</span>
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Meal Options */}
                    {pkg.meals && pkg.meals.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Meal Plan</h2>

                            {/* Check if legacy simple array or new day-wise structure */}
                            {typeof pkg.meals[0] === 'string' ? (
                                <div className="flex flex-wrap gap-3">
                                    {pkg.meals.map((meal: string, i: number) => (
                                        <div key={i} className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl shadow-sm min-w-[80px] text-center">
                                            <span className="text-sm font-medium text-gray-700">{meal}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {pkg.meals.map((dayMeal: any, i: number) => (
                                        <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                                            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
                                                <span className="font-bold text-gray-800">Day {dayMeal.day}</span>
                                            </div>
                                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {dayMeal.breakfast && dayMeal.breakfast.length > 0 && (
                                                    <div>
                                                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Breakfast</h4>
                                                        <ul className="space-y-1">
                                                            {dayMeal.breakfast.map((item: string, idx: number) => (
                                                                <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0"></div>
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {dayMeal.lunch && dayMeal.lunch.length > 0 && (
                                                    <div>
                                                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Lunch</h4>
                                                        <ul className="space-y-1">
                                                            {dayMeal.lunch.map((item: string, idx: number) => (
                                                                <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></div>
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {dayMeal.dinner && dayMeal.dinner.length > 0 && (
                                                    <div>
                                                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Dinner</h4>
                                                        <ul className="space-y-1">
                                                            {dayMeal.dinner.map((item: string, idx: number) => (
                                                                <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></div>
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {dayMeal.snacks && dayMeal.snacks.length > 0 && (
                                                    <div>
                                                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Snacks</h4>
                                                        <ul className="space-y-1">
                                                            {dayMeal.snacks.map((item: string, idx: number) => (
                                                                <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0"></div>
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {dayMeal.custom && dayMeal.custom.length > 0 && (
                                                    <div>
                                                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Other</h4>
                                                        <ul className="space-y-1">
                                                            {dayMeal.custom.map((item: string, idx: number) => (
                                                                <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></div>
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}



                    {/* Inclusions & Exclusions */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <HiCheck className="text-green-600 text-xl" /> What's Included
                            </h3>
                            <ul className="space-y-3">
                                {(pkg.inclusions || []).map((inc: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                                        {inc}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <HiX className="text-red-500 text-xl" /> What's Excluded
                            </h3>
                            <ul className="space-y-3">
                                {(pkg.exclusions || []).map((exc: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-300 mt-1.5 shrink-0" />
                                        {exc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Cancellation Policy */}
                    {pkg.cancellationPolicy && pkg.cancellationPolicy.length > 0 && (
                        <section className="bg-orange-50/50 border border-orange-100 rounded-3xl p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
                                Cancellation Policy
                            </h2>
                            <ul className="space-y-3">
                                {pkg.cancellationPolicy.map((policy: string, i: number) => (
                                    <li key={i} className="flex gap-3 text-gray-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2.5 shrink-0" />
                                        <span className="leading-relaxed">{policy}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                {/* Sidebar Booking Widget */}
                <div className="lg:col-span-1">
                    <BookingWidget
                        price={pkg.price}
                        tourId={pkg._id ? pkg._id.toString() : pkg.id}
                        tourTitle={pkg.title}
                        earlyBirdDiscount={pkg.earlyBirdDiscount}
                        availabilityDate={pkg.availabilityDate}
                        availabilityBatches={pkg.availabilityBatches}
                        totalSlots={pkg.totalSlots}
                        pricing={pkg.pricing}
                        bookedSlots={pkg.bookedSlots}
                        bookingAmount={pkg.bookingAmount}
                        brochureUrl={pkg.brochureUrl}
                        userPhone={userPhone}
                    />
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-6 pb-12">
                <RelatedPackages
                    tours={pkg.relatedTours}
                    sightseeing={pkg.relatedSightseeing}
                    activities={pkg.relatedActivities}
                    rentals={pkg.relatedRentals}
                    stays={pkg.relatedStays}
                    food={pkg.relatedFood}
                    attractions={pkg.relatedAttractions}
                />
            </div>

            <Footer />
        </main>
    );
}
