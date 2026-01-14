
import { getPackageById, tourPackages } from "@/data/tourPackages";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footor";
import Image from "next/image";
import { notFound } from "next/navigation";
import { HiCheck, HiX, HiLocationMarker, HiStar, HiClock, HiCalendar } from "react-icons/hi";

// Generate static params for all packages
export async function generateStaticParams() {
    return tourPackages.map((pkg) => ({
        id: pkg.id,
    }));
}

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function TourDetailPage({ params }: PageProps) {
    const { id } = await params;
    const pkg = getPackageById(id);

    if (!pkg) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <div className="relative h-[70vh] w-full">
                <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white z-10 max-w-7xl mx-auto">
                    <div className="flex flex-wrap gap-3 mb-4">
                        <span className="bg-green-600 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                            Best Seller
                        </span>
                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm">
                            <HiStar className="text-yellow-400" />
                            <span className="font-bold">{pkg.rating}</span>
                            <span className="opacity-80">({pkg.reviews} reviews)</span>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{pkg.title}</h1>
                    <div className="flex items-center gap-4 text-lg text-white/90">
                        <div className="flex items-center gap-1">
                            <HiLocationMarker className="text-green-400" />
                            {pkg.location}
                        </div>
                        <span>|</span>
                        <div className="flex items-center gap-1">
                            <HiClock className="text-green-400" />
                            {pkg.duration}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Overview */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {pkg.overview}
                        </p>
                    </section>

                    {/* Itinerary */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Itinerary</h2>
                        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                            {pkg.itinerary.map((item, index) => (
                                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    {/* Icon/Dot */}
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-green-500 text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold z-10">
                                        {item.day}
                                    </div>

                                    {/* Card */}
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Inclusions & Exclusions */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <HiCheck className="text-green-600 text-xl" /> What's Included
                            </h3>
                            <ul className="space-y-3">
                                {pkg.inclusions.map((inc, i) => (
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
                                {pkg.exclusions.map((exc, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-300 mt-1.5 shrink-0" />
                                        {exc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </div>

                {/* Sidebar Booking Widget */}
                <div className="lg:col-span-1">
                    <div className="sticky top-28 bg-white rounded-3xl border border-gray-200 shadow-xl p-6 overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Image src="/logo.png" alt="logo" width={100} height={100} />
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-500 text-sm mb-1">Starting from</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-gray-900">${pkg.price}</span>
                                <span className="text-gray-400">/ person</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="border border-gray-200 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:border-green-500 transition-colors">
                                <HiCalendar className="text-gray-400 text-xl" />
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Select Date</p>
                                    <p className="text-sm font-semibold text-gray-900">Choose Availability</p>
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:border-green-500 transition-colors">
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-bold text-gray-400">
                                    2
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Guests</p>
                                    <p className="text-sm font-semibold text-gray-900">2 Adults</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mb-8">
                            <button className="flex-1 bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all active:scale-95">
                                Book Now
                            </button>
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-gray-400 mb-2">Free cancellation up to 7 days before trip</p>
                            <div className="flex justify-center gap-4 text-gray-300">
                                {/* Trust Badges Mock */}
                                <div className="w-8 h-8 rounded bg-gray-100" />
                                <div className="w-8 h-8 rounded bg-gray-100" />
                                <div className="w-8 h-8 rounded bg-gray-100" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <Footer />
        </main>
    );
}
