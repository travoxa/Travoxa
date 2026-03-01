'use client'

import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import { useRouter } from 'next/navigation'
import { RiStore2Line, RiEditLine, RiCloseLine, RiCheckLine } from 'react-icons/ri'

// Reusing Admin components for now since Vendor uses same listings framework
import AddActivitiesClient from '@/app/admin/activities/AddActivitiesClient'
import AddTourClient from '@/app/admin/tour/AddTourClient'
import AddRentalsClient from '@/app/admin/rentals/AddRentalsClient'
import AddStayClient from '@/app/admin/stay/AddStayClient'
import AddFoodClient from '@/app/admin/food/AddFoodClient'
import AddSightseeingClient from '@/app/admin/sightseeing/AddSightseeingClient'

interface VendorDashboardClientProps {
    vendorUser: {
        name: string
        email: string
        id: string
        vendorDetails?: {
            businessName: string
            businessType: string
            address?: string
        }
    }
}

const VendorDashboardClient: React.FC<VendorDashboardClientProps> = ({ vendorUser }) => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        businessName: vendorUser.vendorDetails?.businessName || '',
        businessType: vendorUser.vendorDetails?.businessType || '',
        address: vendorUser.vendorDetails?.address || ''
    });

    const router = useRouter()

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/vendor/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editForm),
            });

            if (response.ok) {
                setIsEditing(false);
                router.refresh();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating vendor profile:', error);
            alert('Something went wrong');
        } finally {
            setIsSaving(false);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center text-white">
                                    <RiStore2Line size={32} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-3xl font-medium text-gray-800 Inter">
                                            {vendorUser.vendorDetails?.businessName || 'Your Business'}
                                        </h1>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black"
                                            title="Edit Profile"
                                        >
                                            <RiEditLine size={20} />
                                        </button>
                                    </div>
                                    <p className="text-gray-500 capitalize">{vendorUser.vendorDetails?.businessType?.replace('_', ' ') || 'Vendor'}</p>
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold">Edit Business Profile</h2>
                                    <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-black">
                                        <RiCloseLine size={24} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Business Name</label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            value={editForm.businessName}
                                            onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                                            placeholder="Enter business name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Business Type</label>
                                        <select
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            value={editForm.businessType}
                                            onChange={(e) => setEditForm({ ...editForm, businessType: e.target.value })}
                                        >
                                            <option value="tour_operator">Tour Operator</option>
                                            <option value="rental_agency">Rental Agency</option>
                                            <option value="activity_provider">Activity Provider</option>
                                            <option value="hospitality">Hotel / Stay Provider</option>
                                            <option value="food_beverage">Restaurant / Cafe</option>
                                            <option value="multi_service">Multi-Service Agency</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-gray-700">Business Address / City</label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            value={editForm.address}
                                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                            placeholder="Enter business address"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-8">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <RiCheckLine size={18} />
                                        )}
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        )}

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

            case 'Listings':
                const businessType = vendorUser.vendorDetails?.businessType || 'activity_provider';

                const componentMap: Record<string, { component: any, title: string }> = {
                    'tour_operator': { component: AddTourClient, title: 'My Tours' },
                    'rental_agency': { component: AddRentalsClient, title: 'My Rentals' },
                    'activity_provider': { component: AddActivitiesClient, title: 'My Activities' },
                    'hospitality': { component: AddStayClient, title: 'My Stays' },
                    'food_beverage': { component: AddFoodClient, title: 'My Food & Beverages' },
                    'multi_service': { component: AddSightseeingClient, title: 'My Listings' },
                };

                const { component: ListingComponent, title: listingTitle } = componentMap[businessType] || componentMap['activity_provider'];

                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-medium text-gray-800 mb-6 Inter">{listingTitle}</h1>
                        <ListingComponent vendorId={vendorUser.id} showManagementBox={true} showListings={true} showFormDirectly={false} />
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

    const vendorPermissions = [
        'Overview',
        'Listings'
    ];

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
