import React from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { FaMotorcycle, FaHiking, FaBed, FaMapMarkedAlt, FaUtensils, FaHandsHelping } from 'react-icons/fa';

const products = [
    {
        name: "Vehicle Rentals",
        description: "Flexible and affordable scooty, bike, and car rentals for your travel needs.",
        price: "Starts from ₹400 / day",
        icon: <FaMotorcycle className="text-4xl text-emerald-500" />,
        features: ["Well-maintained vehicles", "Flexible pickup/drop", "Insurance included"]
    },
    {
        name: "Guided Activities",
        description: "Curated experiences including trekking, rafting, and local workshops.",
        price: "Starts from ₹1,200 / person",
        icon: <FaHiking className="text-4xl text-orange-500" />,
        features: ["Professional guides", "Safety equipment", "Life-long memories"]
    },
    {
        name: "Stays & Homestays",
        description: "Handpicked stays ranging from cozy homestays to premium resorts.",
        price: "Starts from ₹1,500 / night",
        icon: <FaBed className="text-4xl text-blue-500" />,
        features: ["Clean & sanitized", "Local experience", "Best price guarantee"]
    },
    {
        name: "Sightseeing Tours",
        description: "Comprehensive day tours and multi-day packages to top attractions.",
        price: "Starts from ₹800 / person",
        icon: <FaMapMarkedAlt className="text-4xl text-purple-500" />,
        features: ["Customizable routes", "AC/Non-AC options", "Knowledgeable drivers"]
    },
    {
        name: "Local Food Experiences",
        description: "Taste the authentic local cuisine through our curated food trails.",
        price: "Starts from ₹300 / meal",
        icon: <FaUtensils className="text-4xl text-red-500" />,
        features: ["Hygienic places", "Authentic recipes", "Group discounts"]
    },
    {
        name: "Volunteer Programs",
        description: "Skill-based volunteering opportunities with local communities.",
        price: "Starts from ₹0 (Skill Exchange)",
        icon: <FaHandsHelping className="text-4xl text-green-500" />,
        features: ["Impactful work", "Cultural exchange", "Certificate of participation"]
    }
];

const ProductsPage = () => {
    return (
        <div className="bg-white min-h-screen font-sans">
            <Header />
            <div className="pt-40 pb-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-light mb-6 text-gray-900 Mont uppercase tracking-tight">Our Products & Services</h1>
                        <p className="text-xl text-gray-600 Inter max-w-2xl mx-auto font-light leading-relaxed">
                            Explore our range of travel services designed to make your journey seamless and unforgettable.
                            All prices are mentioned in Indian Rupees (INR).
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {products.map((product, i) => (
                            <div key={i} className="bg-white p-10 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
                                <div>
                                    <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                        {product.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-gray-900 Mont">{product.name}</h3>
                                    <p className="text-gray-500 mb-6 font-light leading-relaxed">{product.description}</p>
                                    <ul className="space-y-3 mb-8">
                                        {product.features.map((feature, j) => (
                                            <li key={j} className="flex items-center text-sm text-gray-600 font-light">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="pt-6 border-t border-gray-50">
                                    <p className="text-2xl font-black text-black Mont italic">{product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-emerald-50 p-12 rounded-[36px] text-center max-w-4xl mx-auto">
                        <h2 className="text-3xl font-light mb-4 Mont text-emerald-900">Custom Travel Packages</h2>
                        <p className="text-emerald-700 font-light mb-8 max-w-2xl mx-auto">
                            Need a personalized itinerary for your group or a special occasion? Contact our travel experts for a custom quote.
                        </p>
                        <a href="/contact" className="inline-block bg-emerald-600 text-white px-10 py-4 rounded-full font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                            Get a Custom Quote
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductsPage;
