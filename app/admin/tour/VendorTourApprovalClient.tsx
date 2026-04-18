'use client';
import { useState, useEffect } from 'react';
import { RiCheckLine, RiCloseLine, RiTimeLine, RiInformationLine, RiMapPinLine, RiMoneyDollarCircleLine, RiCalendarLine, RiListCheck, RiEBikeLine, RiFileListLine, RiHotelLine, RiTruckLine, RiRestaurantLine, RiGroupLine, RiDownloadLine, RiShieldUserLine, RiMapLine } from 'react-icons/ri';

interface VendorTour {
    id: string;
    title: string;
    location: string;
    price: number;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    vendorId?: string;
    image?: string[];
    overview?: string;
    duration?: string;
    itinerary?: any[];
    highlights?: string[];
    inclusions?: string[];
    exclusions?: string[];
    cancellationPolicy?: string[];
    pricing?: any[];
    availabilityBatches?: any[];
    locationMapLink?: string;

    pickupLocation?: string;
    pickupMapLink?: string;
    dropLocation?: string;
    dropMapLink?: string;
    partners?: any[];
    brochureUrl?: string;
    bookingAmount?: number;
    earlyBirdDiscount?: number;
    meals?: any[];
    totalSlots?: number;
    bookedSlots?: number;
}

export default function VendorTourApprovalClient() {
    const [tours, setTours] = useState<VendorTour[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTour, setSelectedTour] = useState<VendorTour | null>(null);

    const fetchPendingTours = async () => {
        setLoading(true);
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/tours?admin=true&status=pending');
            const data = await res.json();
            if (data.success && data.data) {
                setTours(data.data.map((t: any) => ({
                    id: t._id,
                    title: t.title,
                    location: t.location,
                    price: t.price,
                    status: t.status,
                    createdAt: t.createdAt,
                    vendorId: t.vendorId,
                    image: t.image,
                    overview: t.overview,
                    duration: t.duration,
                    itinerary: t.itinerary,
                    highlights: t.highlights,
                    inclusions: t.inclusions,
                    exclusions: t.exclusions,
                    cancellationPolicy: t.cancellationPolicy,
                    pricing: t.pricing,
                    availabilityBatches: t.availabilityBatches,
                    locationMapLink: t.locationMapLink,

                    pickupLocation: t.pickupLocation,
                    pickupMapLink: t.pickupMapLink,
                    dropLocation: t.dropLocation,
                    dropMapLink: t.dropMapLink,
                    partners: t.partners,
                    brochureUrl: t.brochureUrl,
                    bookingAmount: t.bookingAmount,
                    earlyBirdDiscount: t.earlyBirdDiscount,
                    meals: t.meals,
                    totalSlots: t.totalSlots,
                    bookedSlots: t.bookedSlots
                })));
            }
        } catch (error) {
            console.error("Failed to fetch pending vendor tours", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingTours();
    }, []);

    const handleAction = async (id: string, newStatus: 'approved' | 'rejected') => {
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/admin/vendor-approval', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    collectionType: 'tours',
                    status: newStatus
                })
            });

            if (res.ok) {
                setTours(prev => prev.filter(t => t.id !== id));
                if (selectedTour?.id === id) setSelectedTour(null);
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="animate-pulse space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-50 rounded-xl" />)}</div>;

    return (
        <div className="space-y-6 Inter">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tours.length === 0 ? (
                    <div className="col-span-full bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                        <RiTimeLine size={48} className="mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-600">No pending vendor tours</h3>
                        <p className="text-gray-400 text-sm mt-1">When vendors submit new packages, they will appear here for review.</p>
                    </div>
                ) : (
                    tours.map((tour) => (
                        <div key={tour.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-1/3 relative h-full min-h-[160px]">
                                {tour.image && tour.image[0] ? (
                                    <img src={tour.image[0]} alt={tour.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold">No Image</div>
                                )}
                                <button
                                    onClick={() => setSelectedTour(tour)}
                                    className="absolute bottom-2 left-2 p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm text-gray-700 hover:text-blue-600 transition-colors"
                                    title="View Full Package"
                                >
                                    <RiInformationLine size={18} />
                                </button>
                            </div>
                            <div className="w-2/3 p-5 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">{tour.location}</span>
                                        <span className="text-xs text-gray-400 font-mono tracking-tighter">{new Date(tour.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className="font-semibold text-gray-900 leading-tight mb-1 line-clamp-1">{tour.title}</h4>
                                    <p className="text-lg font-bold text-gray-900 mb-2">₹{tour.price.toLocaleString()}</p>
                                    <p className="text-[9px] text-gray-300 font-mono uppercase tracking-widest">ID: {tour.id.slice(-8)}</p>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleAction(tour.id, 'rejected')}
                                        className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                                    >
                                        <RiCloseLine size={16} /> Reject
                                    </button>
                                    <button
                                        onClick={() => handleAction(tour.id, 'approved')}
                                        className="flex-1 py-2 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-1"
                                    >
                                        <RiCheckLine size={16} /> Approve
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Detail Modal */}
            {selectedTour && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] w-full max-w-5xl max-h-full overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 border border-white/20">
                        {/* Header */}
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase tracking-wider">Vendor Package</span>
                                    <span className="text-[10px] text-gray-400 font-mono">#{selectedTour.id}</span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 leading-tight">{selectedTour.title}</h3>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
                                    <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                                        <RiMapPinLine className="text-blue-500" /> {selectedTour.location}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                                        <RiTimeLine className="text-blue-500" /> {selectedTour.duration}
                                    </span>

                                    <span className="flex items-center gap-1.5 text-sm font-black text-gray-900 bg-gray-50 px-3 py-1 rounded-full">
                                        <RiMoneyDollarCircleLine className="text-green-500 text-lg" /> ₹{selectedTour.price.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {selectedTour.brochureUrl && (
                                    <a href={selectedTour.brochureUrl} target="_blank" className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors" title="Download Brochure">
                                        <RiDownloadLine size={20} />
                                    </a>
                                )}
                                <button
                                    onClick={() => setSelectedTour(null)}
                                    className="p-3 hover:bg-gray-100 rounded-2xl transition-colors text-gray-400 hover:text-gray-900"
                                >
                                    <RiCloseLine size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar bg-white">
                            {/* Images Grid */}
                            {selectedTour.image && selectedTour.image.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {selectedTour.image.map((img, i) => (
                                        <div key={i} className={`rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm transition-transform hover:scale-[1.02] ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                                            <img src={img} alt={`Tour ${i}`} className="w-full h-full object-cover min-h-[140px]" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                {/* Left Column: Main Info */}
                                <div className="lg:col-span-2 space-y-12">
                                    {/* Overview */}
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <RiFileListLine className="text-blue-500" /> Overview
                                        </h4>
                                        <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50/50 p-6 rounded-[24px] border border-gray-50">
                                            {selectedTour.overview}
                                        </div>
                                    </div>

                                    {/* Highlights */}
                                    {selectedTour.highlights && selectedTour.highlights.length > 0 && (
                                        <div className="space-y-4">
                                            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <RiEBikeLine className="text-blue-500" /> Package Highlights
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {selectedTour.highlights.map((h, i) => (
                                                    <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                        <span className="text-xs font-medium text-gray-700">{h}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Itinerary */}
                                    {selectedTour.itinerary && selectedTour.itinerary.length > 0 && (
                                        <div className="space-y-6">
                                            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <RiCalendarLine className="text-blue-500" /> Day-wise Itinerary
                                            </h4>
                                            <div className="space-y-6">
                                                {selectedTour.itinerary.map((day: any, i: number) => (
                                                    <div key={i} className="group relative">
                                                        <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-gray-100 group-last:hidden" />
                                                        <div className="flex gap-6">
                                                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-blue-100 z-10 shrink-0">
                                                                {day.day}
                                                            </div>
                                                            <div className="bg-white border border-gray-100 p-6 rounded-[28px] shadow-sm hover:shadow-md transition-shadow w-full">
                                                                <h5 className="font-bold text-gray-900 mb-2">{day.title}</h5>
                                                                <p className="text-xs text-gray-500 leading-relaxed mb-4">{day.description}</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {day.stay && <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-bold"><RiHotelLine /> {day.stay}</span>}
                                                                    {day.meal && <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-bold"><RiRestaurantLine /> {day.meal}</span>}
                                                                    {day.activity && <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold"><RiEBikeLine /> {day.activity}</span>}
                                                                    {day.transfer && <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold"><RiTruckLine /> {day.transfer}</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Detailed Meals */}
                                    {selectedTour.meals && selectedTour.meals.length > 0 && (
                                        <div className="space-y-4">
                                            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <RiRestaurantLine className="text-orange-500" /> Detailed Meal Plan
                                            </h4>
                                            <div className="bg-gray-50 rounded-[28px] p-6 space-y-4">
                                                {selectedTour.meals.map((m: any, i: number) => (
                                                    <div key={i} className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-2xl border border-gray-100">
                                                        <div className="w-12 font-black text-gray-300">D{m.day}</div>
                                                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                                                            {['breakfast', 'lunch', 'dinner', 'snacks'].map(meal => (
                                                                <div key={meal}>
                                                                    <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">{meal}</div>
                                                                    <div className="text-[11px] text-gray-700 font-medium">
                                                                        {m[meal]?.join(', ') || 'Not included'}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Logistics & Pricing */}
                                <div className="space-y-8">
                                    {/* Pricing & Booking */}
                                    <div className="bg-gray-900 p-8 rounded-[32px] text-white space-y-6 shadow-2xl shadow-gray-200">
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400">Booking Summary</h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                                <span className="text-xs text-gray-400">Base Package</span>
                                                <span className="text-2xl font-black italic">₹{selectedTour.price.toLocaleString()}</span>
                                            </div>
                                            {selectedTour.bookingAmount && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-400">Initial Booking</span>
                                                    <span className="font-bold">₹{selectedTour.bookingAmount.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {selectedTour.earlyBirdDiscount && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-green-400">Early Bird Offer</span>
                                                    <span className="font-black">-{selectedTour.earlyBirdDiscount}%</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-xs pt-2">
                                                <span className="text-gray-400">Total Slots</span>
                                                <span className="font-bold">{selectedTour.totalSlots || 'Unlimited'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pricing Tiers */}
                                    {selectedTour.pricing && selectedTour.pricing.length > 0 && (
                                        <div className="space-y-4 bg-white border border-gray-100 p-6 rounded-[28px] shadow-sm">
                                            <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2"><RiMoneyDollarCircleLine /> Pricing Tiers</h4>
                                            <div className="space-y-2">
                                                {selectedTour.pricing.map((p: any, i: number) => (
                                                    <div key={i} className="p-3 bg-gray-50 rounded-xl flex justify-between items-center text-[11px]">
                                                        <div>
                                                            <div className="font-black text-gray-700">{p.people} People</div>
                                                            <div className="text-gray-400 text-[10px]">{p.hotelType} • {p.rooms} Rooms</div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-black text-blue-600">₹{p.packagePrice.toLocaleString()}</div>
                                                            <div className="text-gray-400 text-[9px]">₹{p.pricePerPerson}/pp</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Batches */}
                                    {selectedTour.availabilityBatches && selectedTour.availabilityBatches.length > 0 && (
                                        <div className="space-y-4 bg-white border border-gray-100 p-6 rounded-[28px] shadow-sm">
                                            <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2"><RiCalendarLine /> Available Batches</h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {selectedTour.availabilityBatches.map((b: any, i: number) => (
                                                    <div key={i} className={`p-3 rounded-xl border flex flex-col gap-1 ${b.active ? 'border-blue-100 bg-blue-50/30' : 'bg-gray-50 opacity-50 border-gray-100'}`}>
                                                        <div className="text-[10px] text-gray-400 font-bold uppercase">Batch {i + 1}</div>
                                                        <div className="text-[11px] font-black text-gray-700 flex items-center gap-2">
                                                            {b.startDate} <span className="text-gray-300">→</span> {b.endDate}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Logistics (Pickup/Drop) */}
                                    {(selectedTour.pickupLocation || selectedTour.dropLocation) && (
                                        <div className="space-y-4 bg-white border border-gray-100 p-6 rounded-[28px] shadow-sm">
                                            <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2"><RiTruckLine /> Logistics</h4>
                                            <div className="space-y-4">
                                                {selectedTour.pickupLocation && (
                                                    <div className="space-y-1.5">
                                                        <div className="text-[10px] font-black text-blue-600 uppercase">Pickup</div>
                                                        <div className="text-[11px] text-gray-700 font-medium px-3 py-2 bg-gray-50 rounded-xl relative group">
                                                            {selectedTour.pickupLocation}
                                                            {selectedTour.pickupMapLink && (
                                                                <a href={selectedTour.pickupMapLink} target="_blank" className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:scale-110 transition-transform">
                                                                    <RiMapLine size={16} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                {selectedTour.dropLocation && (
                                                    <div className="space-y-1.5">
                                                        <div className="text-[10px] font-black text-orange-600 uppercase">Drop</div>
                                                        <div className="text-[11px] text-gray-700 font-medium px-3 py-2 bg-gray-50 rounded-xl relative group">
                                                            {selectedTour.dropLocation}
                                                            {selectedTour.dropMapLink && (
                                                                <a href={selectedTour.dropMapLink} target="_blank" className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:scale-110 transition-transform">
                                                                    <RiMapLine size={16} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Partners */}
                                    {selectedTour.partners && selectedTour.partners.length > 0 && (
                                        <div className="space-y-4 bg-white border border-gray-100 p-6 rounded-[28px] shadow-sm">
                                            <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2"><RiShieldUserLine /> Partners</h4>
                                            <div className="space-y-3">
                                                {selectedTour.partners.map((p, i) => (
                                                    <div key={i} className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl">
                                                        {p.logo ? (
                                                            <img src={p.logo} alt={p.name} className="w-8 h-8 rounded-lg object-contain bg-white pb-px border border-gray-200" />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-[10px] text-gray-400 font-bold">L</div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-[11px] font-bold text-gray-900 truncate">{p.name}</div>
                                                            <div className="text-[9px] text-gray-500 truncate">{p.website || p.phone}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Policies (Bottom) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-12">
                                <div className="space-y-4 bg-green-50/30 p-8 rounded-[32px]">
                                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                        <RiListCheck className="text-green-500" /> Inclusions
                                    </h4>
                                    <ul className="grid grid-cols-1 gap-3">
                                        {selectedTour.inclusions?.map((item, i) => (
                                            <li key={i} className="text-[11px] text-gray-600 flex items-start gap-3 bg-white/50 p-3 rounded-xl border border-white">
                                                <span className="text-green-500 font-black">✓</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-4 bg-red-50/30 p-8 rounded-[32px]">
                                    <h4 className="font-bold text-gray-900 flex items-center gap-2 text-red-600">
                                        <RiCloseLine className="text-red-500" /> Exclusions
                                    </h4>
                                    <ul className="grid grid-cols-1 gap-3">
                                        {selectedTour.exclusions?.map((item, i) => (
                                            <li key={i} className="text-[11px] text-gray-600 flex items-start gap-3 bg-white/50 p-3 rounded-xl border border-white">
                                                <span className="text-red-500 font-black">×</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Cancellation Policy */}
                            {selectedTour.cancellationPolicy && selectedTour.cancellationPolicy.length > 0 && (
                                <div className="space-y-4 bg-gray-50 p-8 rounded-[32px]">
                                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                        <RiShieldUserLine className="text-gray-500" /> Cancellation Policy
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {selectedTour.cancellationPolicy.map((p, i) => (
                                            <div key={i} className="text-[11px] text-gray-500 bg-white p-4 rounded-xl border border-gray-100 italic">
                                                "{p}"
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-8 border-t border-gray-100 bg-white flex gap-4">
                            <button
                                onClick={() => handleAction(selectedTour.id, 'rejected')}
                                className="flex-1 py-4 bg-white border-2 border-red-100 text-red-600 rounded-[24px] text-sm font-black hover:bg-red-50 transition-all hover:border-red-200 active:scale-95"
                            >
                                Reject Application
                            </button>
                            <button
                                onClick={() => handleAction(selectedTour.id, 'approved')}
                                className="flex-2 md:flex-[2] py-4 bg-gray-900 text-white rounded-[24px] text-sm font-black hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <RiCheckLine size={20} /> Approve & Publish Package
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
