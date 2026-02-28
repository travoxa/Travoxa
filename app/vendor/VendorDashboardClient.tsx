'use client'

import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import { useRouter } from 'next/navigation'
import { RiStore2Line } from 'react-icons/ri'

// Reusing Admin components for now since Vendor uses same listings framework
import AddTourClient from '@/app/admin/tour/AddTourClient'
import AddSightseeingClient from '@/app/admin/sightseeing/AddSightseeingClient'
import AddRentalsClient from '@/app/admin/rentals/AddRentalsClient'
import AddActivitiesClient from '@/app/admin/activities/AddActivitiesClient'
import AddStayClient from '@/app/admin/stay/AddStayClient'
import AddFoodClient from '@/app/admin/food/AddFoodClient'

interface VendorDashboardClientProps {
    vendorUser: {
        name: string
        email: string
        id: string
        vendorDetails?: {
            businessName: string
            businessType: string
        }
    }
}

const VendorDashboardClient: React.FC<VendorDashboardClientProps> = ({ vendorUser }) => {
    // Determine default tab based on business type, or default to Overview
    const defaultTab = () => {
        const type = vendorUser.vendorDetails?.businessType;
        if (type === 'tour_operator') return 'Tour';
        if (type === 'rental_agency') return 'Rentals';
        if (type === 'activity_provider') return 'Activities';
        if (type === 'hospitality') return 'Stay';
        if (type === 'food_beverage') return 'Food';
        return 'Overview';
    };

    const [activeTab, setActiveTab] = useState(defaultTab());
    const router = useRouter()

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center text-white">
                                <RiStore2Line size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-medium text-gray-800 Inter">{vendorUser.vendorDetails?.businessName || 'Your Business'}</h1>
                                <p className="text-gray-500 capitalize">{vendorUser.vendorDetails?.businessType?.replace('_', ' ') || 'Vendor'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
                                <span className="text-sm font-medium text-gray-500">Active Listings</span>
                                <span className="text-3xl font-bold text-black">--</span>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
                                <span className="text-sm font-medium text-gray-500">Total Bookings</span>
                                <span className="text-3xl font-bold text-black">--</span>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
                                <span className="text-sm font-medium text-gray-500">Average Rating</span>
                                <span className="text-3xl font-bold text-black">--</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-8 mt-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome to your Portal</h2>
                            <p className="text-gray-600 mb-6">Manage your listings, view bookings, and update your business profile from here.</p>

                            <p className="text-sm text-amber-600 bg-amber-50 p-4 rounded-lg">
                                Tip: Use the sidebar to navigate to your specific listing categories to start adding inventory.
                            </p>
                        </div>
                    </div>
                )

            case 'Tour':
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-medium text-gray-800 mb-6 Inter">My Tours</h1>
                        <AddTourClient vendorId={vendorUser.id} />
                    </div>
                )

            case 'Sightseeing':
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-medium text-gray-800 mb-6 Inter">My Sightseeing Packages</h1>
                        <AddSightseeingClient vendorId={vendorUser.id} showManagementBox={false} showListings={true} showFormDirectly={true} />
                    </div>
                )

            case 'Rentals':
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-medium text-gray-800 mb-6 Inter">My Rentals</h1>
                        <AddRentalsClient vendorId={vendorUser.id} showManagementBox={false} showListings={true} showFormDirectly={true} />
                    </div>
                )

            case 'Activities':
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-medium text-gray-800 mb-6 Inter">My Activities</h1>
                        <AddActivitiesClient vendorId={vendorUser.id} showManagementBox={false} showListings={true} showFormDirectly={true} />
                    </div>
                )

            case 'Stay':
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-medium text-gray-800 mb-6 Inter">My Stays</h1>
                        <AddStayClient vendorId={vendorUser.id} showManagementBox={false} showListings={true} showFormDirectly={true} />
                    </div>
                )

            case 'Food':
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-medium text-gray-800 mb-6 Inter">My Food Listings</h1>
                        <AddFoodClient vendorId={vendorUser.id} showManagementBox={false} showListings={true} showFormDirectly={true} />
                    </div>
                )

            case 'Profile':
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-medium text-gray-800 mb-6 Inter">Business Profile</h1>
                        <div className="bg-white rounded-xl border border-gray-200 p-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit details in Onboarding Flow</h2>
                            <button
                                onClick={() => router.push('/vendor/onboarding')}
                                className="px-6 py-3 bg-black text-white rounded-lg text-sm font-medium"
                            >
                                Update Profile Details
                            </button>
                        </div>
                    </div>
                )

            default:
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-medium text-gray-800 mb-6 Inter">{activeTab}</h1>
                        <div className="bg-white rounded-xl border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Coming Soon</h2>
                            <p className="text-gray-600">This section is under development.</p>
                        </div>
                    </div>
                )
        }
    }

    // Determine viable sidebar options for the vendor based on type 
    // (A multi-service agent gets everything, others get specific items)
    const isMulti = vendorUser.vendorDetails?.businessType === 'multi_service';
    const type = vendorUser.vendorDetails?.businessType;

    const vendorPermissions = [
        'Overview',
        (isMulti || type === 'tour_operator') ? 'Tour' : null,
        (isMulti || type === 'tour_operator') ? 'Sightseeing' : null,
        (isMulti || type === 'rental_agency') ? 'Rentals' : null,
        (isMulti || type === 'activity_provider') ? 'Activities' : null,
        (isMulti || type === 'hospitality') ? 'Stay' : null,
        (isMulti || type === 'food_beverage') ? 'Food' : null,
        'Profile' // Replacing generic Landing etc
    ].filter(Boolean) as string[];

    return (
        <div className="flex min-h-screen bg-white font-sans">
            {/* Sidebar Reused with permissions tricking */}
            <Sidebar
                user={vendorUser}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isAdmin={true} // Using isAdmin=true to force the specialized admin layout vs standard user layout
                permissions={vendorPermissions}
            />

            {/* Main Content */}
            <main className="flex-1 ml-52 p-8 lg:p-12 overflow-y-auto w-[calc(100%-13rem)]">
                <div className="max-w-7xl mx-auto space-y-8">
                    <TopBar onNavigate={setActiveTab} isAdmin={true} />

                    {/* Dynamic Content Area */}
                    <div className="fade-in-up">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default VendorDashboardClient
