'use client'

import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { RiStore2Line, RiEditLine, RiCloseLine, RiCheckLine, RiNotification3Line, RiLogoutBoxLine, RiMenuLine } from 'react-icons/ri'

// Reusing Admin components for now since Vendor uses same listings framework
import AddActivitiesClient from '@/app/admin/activities/AddActivitiesClient'
import AddTourClient from '@/app/admin/tour/AddTourClient'
import AddRentalsClient from '@/app/admin/rentals/AddRentalsClient'
import AddStayClient from '@/app/admin/stay/AddStayClient'
import AddFoodClient from '@/app/admin/food/AddFoodClient'
import AddSightseeingClient from '@/app/admin/sightseeing/AddSightseeingClient'
import AddAttractionsClient from '@/app/admin/attractions/AddAttractionsClient'

interface VendorDashboardClientProps {
    vendorUser: {
        name: string
        email: string
        id: string
        vendorDetails?: {
            businessName: string
            businessType: string
            address?: string
            instagram?: string
            facebook?: string
            twitter?: string
            googleBusiness?: string
            youtube?: string
        }
    }
}

const VendorDashboardClient: React.FC<VendorDashboardClientProps> = ({ vendorUser }) => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [multiServiceTab, setMultiServiceTab] = useState('My Tours');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        businessName: vendorUser.vendorDetails?.businessName || '',
        businessType: vendorUser.vendorDetails?.businessType || '',
        address: vendorUser.vendorDetails?.address || '',
        instagram: vendorUser.vendorDetails?.instagram || '',
        facebook: vendorUser.vendorDetails?.facebook || '',
        twitter: vendorUser.vendorDetails?.twitter || '',
        googleBusiness: vendorUser.vendorDetails?.googleBusiness || '',
        youtube: vendorUser.vendorDetails?.youtube || ''
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

    const renderOverview = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-black rounded-lg flex items-center justify-center text-white shrink-0">
                        <RiStore2Line className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg md:text-3xl font-medium text-gray-800 Inter text-left">
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
                        <p className="text-xs md:text-base text-gray-500 capitalize">{vendorUser.vendorDetails?.businessType?.replace('_', ' ') || 'Vendor'}</p>
                    </div>
                </div>
            </div>

            {isEditing && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Edit Business Profile</h2>
                        <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-black">
                            <RiCloseLine size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Instagram Profile</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                value={editForm.instagram}
                                onChange={(e) => setEditForm({ ...editForm, instagram: e.target.value })}
                                placeholder="https://instagram.com/yourprofile"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Facebook Page</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                value={editForm.facebook}
                                onChange={(e) => setEditForm({ ...editForm, facebook: e.target.value })}
                                placeholder="https://facebook.com/yourpage"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Twitter (X) Profile</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                value={editForm.twitter}
                                onChange={(e) => setEditForm({ ...editForm, twitter: e.target.value })}
                                placeholder="https://twitter.com/yourprofile"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">YouTube Channel</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                value={editForm.youtube}
                                onChange={(e) => setEditForm({ ...editForm, youtube: e.target.value })}
                                placeholder="https://youtube.com/yourchannel"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Google Business Profile</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                value={editForm.googleBusiness}
                                onChange={(e) => setEditForm({ ...editForm, googleBusiness: e.target.value })}
                                placeholder="Link to your Google Business Profile"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="flex-1 md:flex-none px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 md:flex-none px-6 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
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

            <div className="grid grid-cols-3 gap-2 md:gap-6">
                <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-1 md:gap-2">
                    <span className="text-[10px] md:text-sm font-medium text-gray-500">Active Listings</span>
                    <span className="text-xl md:text-3xl font-bold text-black">--</span>
                </div>
                <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-1 md:gap-2">
                    <span className="text-[10px] md:text-sm font-medium text-gray-500">Total Bookings</span>
                    <span className="text-xl md:text-3xl font-bold text-black">--</span>
                </div>
                <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-1 md:gap-2">
                    <span className="text-[10px] md:text-sm font-medium text-gray-500">Average Rating</span>
                    <span className="text-xl md:text-3xl font-bold text-black">--</span>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-8 mt-4 md:mt-8">
                <h2 className="text-base md:text-xl font-bold text-gray-800 mb-1 md:mb-2">Welcome to your Portal</h2>
                <p className="text-[10px] md:text-base text-gray-600 mb-4 md:mb-6">Manage your listings, view bookings, and update your business profile from here.</p>

                <p className="text-[10px] md:text-sm text-amber-600 bg-amber-50 p-3 md:p-4 rounded-lg">
                    Tip: Use the sidebar to navigate to your specific listing categories to start adding inventory.
                </p>
            </div>
        </div>
    );

    const renderListings = () => {
        const businessType = vendorUser.vendorDetails?.businessType || 'activity_provider';

        if (businessType === 'multi_service') {
            const tabs = [
                { id: 'My Tours', label: 'Tours', component: AddTourClient },
                { id: 'My Sightseeing', label: 'Sightseeing', component: AddSightseeingClient },
                { id: 'My Activities', label: 'Activities', component: AddActivitiesClient },
                { id: 'My Rentals', label: 'Rentals', component: AddRentalsClient },
                { id: 'My Stays', label: 'Stays', component: AddStayClient },
                { id: 'My Food & Beverages', label: 'Food & Cafes', component: AddFoodClient },
                { id: 'My Attractions', label: 'Attractions', component: AddAttractionsClient },
            ];

            const ActiveComponent = tabs.find(t => t.id === multiServiceTab)?.component || AddTourClient;

            return (
                <div className="space-y-6">
                    <h1 className="text-lg md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-left">Listings Management</h1>

                    <div className="mb-8 border-b border-gray-200">
                        <div className="flex overflow-x-auto gap-6 hide-scrollbar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setMultiServiceTab(tab.id)}
                                    className={`pb-2 md:pb-4 text-[10px] md:text-sm font-medium whitespace-nowrap transition-colors border-b-2 relative ${multiServiceTab === tab.id
                                        ? 'border-black text-black'
                                        : 'border-transparent text-gray-500 hover:text-gray-800'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <ActiveComponent vendorId={vendorUser.id} showManagementBox={true} showListings={true} showFormDirectly={false} />
                </div>
            );
        }

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
                <h1 className="text-lg md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-left">{listingTitle}</h1>
                <ListingComponent vendorId={vendorUser.id} showManagementBox={true} showListings={true} showFormDirectly={false} />
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview':
                return renderOverview();
            case 'Listings':
                return renderListings();
            default:
                return (
                    <div className="space-y-6">
                        <h1 className="text-lg md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-left">{activeTab}</h1>
                        <div className="bg-white rounded-xl border border-gray-200 p-8">
                            <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-2 md:mb-4">Coming Soon</h2>
                            <p className="text-xs md:text-base text-gray-600">This section is under development.</p>
                        </div>
                    </div>
                );
        }
    };

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
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-50 px-6 py-3 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-1 -ml-1 text-gray-600 hover:text-black transition-colors"
                    >
                        <RiMenuLine size={24} />
                    </button>
                    <button onClick={() => window.location.href = '/'} className="cursor-pointer ml-1">
                        <Image
                            src="/logo.png"
                            alt="Travoxa"
                            width={100}
                            height={40}
                            style={{ width: "auto", height: "24px" }}
                            className="object-contain"
                        />
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.location.href = '/api/admin/logout'}
                        className="w-8 h-8 rounded-full overflow-hidden bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                        title="Logout"
                    >
                        <RiLogoutBoxLine size={11} />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full md:ml-52 p-4 pt-20 md:p-8 lg:p-12 overflow-y-auto md:w-[calc(100%-13rem)]">
                <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
                    <div className="hidden md:block">
                        <TopBar
                            onNavigate={setActiveTab}
                            isAdmin={true}
                            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                        />
                    </div>

                    {/* Dynamic Content Area */}
                    <div className="fade-in-up">
                        {/* Desktop View */}
                        <div className="hidden md:block">
                            {renderContent()}
                        </div>

                        {/* Mobile View - Stacked Content */}
                        <div className="md:hidden space-y-8 pb-12">
                            <div className="space-y-6">
                                {renderOverview()}
                            </div>

                            <div className="space-y-6">
                                {renderListings()}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VendorDashboardClient;
