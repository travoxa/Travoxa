'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import { useRouter } from 'next/navigation'
import { RiShieldCheckLine } from 'react-icons/ri'

// Admin-specific components
// import AddLocationClient from '@/app/admin/add-locations/AddLocationClient'

import AddTourClient from '@/app/admin/tour/AddTourClient'
import AddSightseeingClient from '@/app/admin/sightseeing/AddSightseeingClient'
import AddRentalsClient from '@/app/admin/rentals/AddRentalsClient'
import TeamManagementClient from '@/app/admin/team/TeamManagementClient'
import AddHostedBackpackerClient from '@/app/admin/backpackers/AddHostedBackpackerClient'

import AddActivitiesClient from '@/app/admin/activities/AddActivitiesClient'
import AddAttractionsClient from '@/app/admin/attractions/AddAttractionsClient'
import AddFoodClient from '@/app/admin/food/AddFoodClient'
import AddStayClient from '@/app/admin/stay/AddStayClient'
import AddHelplineClient from '@/app/admin/helpline/AddHelplineClient'
import VendorRequestsClient from '@/app/admin/requests/VendorRequestsClient'
import TourRequestsClient from '@/app/admin/tour/TourRequestsClient'
import VendorTourApprovalClient from '@/app/admin/tour/VendorTourApprovalClient'
import BlogManagementClient from '@/app/admin/blogs/BlogManagementClient'
import AIHarvesterClient from '@/app/admin/components/AIHarvesterClient'
import AISettingsClient from '@/app/admin/components/AISettingsClient'
import HomeCitiesClient from '@/app/admin/landing/HomeCitiesClient'
import HelpControlClient from '@/app/admin/help-control/HelpControlClient'

interface AdminDashboardClientProps {
    adminUser: {
        name: string
        email: string
        permissions?: string[]
    }
}

const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({ adminUser }) => {
    const permissions = adminUser.permissions || [];
    const [activeTab, setActiveTab] = useState(permissions.includes('Overview') ? 'Overview' : (permissions[0] || 'Overview'))
    const [activeDiscoveryForm, setActiveDiscoveryForm] = useState<'sightseeing' | 'rentals' | 'activities' | 'attractions' | 'food' | 'stay' | 'helpline' | null>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [hasPendingTourRequests, setHasPendingTourRequests] = useState(false)
    const [hasPendingVendorTours, setHasPendingVendorTours] = useState(false)
    const [hasPendingVendorRequests, setHasPendingVendorRequests] = useState(false)
    const [hasPendingBackpackers, setHasPendingBackpackers] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const checkPendingRequests = async () => {
            try {
                // 1. Check Tour Requests (Standard & Custom)
                const [standardRes, customRes] = await Promise.all([
                    fetch('/api/tours/request'),
                    fetch('/api/tours/custom-request')
                ]);
                const standardData = await standardRes.json();
                const customData = await customRes.json();

                const hasPendingStandard = standardData.success && standardData.data.some((req: any) => req.status === 'pending');
                const hasPendingCustom = customData.success && customData.data.some((req: any) => req.status === 'pending');
                setHasPendingTourRequests(hasPendingStandard || hasPendingCustom);

                // 2. Check Vendor Tours
                const vendorToursRes = await fetch('/api/tours?admin=true&status=pending');
                const vendorToursData = await vendorToursRes.json();
                setHasPendingVendorTours(vendorToursData.success && vendorToursData.data.length > 0);

                // 3. Check Other Vendor Requests
                const otherCollections = ['activities', 'rentals', 'sightseeing', 'stay', 'food'];
                const otherRes = await Promise.all(
                    otherCollections.map(col => fetch(`/api/${col}?admin=true&status=pending`))
                );
                const otherData = await Promise.all(otherRes.map(res => res.json()));
                const hasAnyOtherPending = otherData.some(d => d.success && d.data.length > 0);
                setHasPendingVendorRequests(hasAnyOtherPending);

                // 4. Check Pending Backpackers (Unverified community trips)
                const backpackersRes = await fetch('/api/groups?admin=true');
                const backpackersData = await backpackersRes.json();
                if (backpackersData.groups) {
                    const hasUnverified = backpackersData.groups.some((g: any) => g.tripSource !== 'hosted' && !g.verified);
                    setHasPendingBackpackers(hasUnverified);
                }

            } catch (error) {
                console.error('Error checking pending requests:', error);
            }
        };

        checkPendingRequests();
        // Check every 5 minutes
        const interval = setInterval(checkPendingRequests, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const renderContent = () => {
        const permissions = adminUser.permissions || [];

        const hasDiscoveryPermission = (subSection?: string) => {
            if (permissions.includes('Discovery')) return true;
            if (!subSection) {
                return permissions.some(p => p.startsWith('Discovery:'));
            }
            return permissions.includes(`Discovery:${subSection}`);
        };

        const hasTourPermission = (subSection?: string) => {
            if (permissions.includes('Tour')) return true;
            if (!subSection) {
                return permissions.some(p => p.startsWith('Tour:'));
            }
            return permissions.includes(`Tour:${subSection}`);
        };

        const hasOtherPermission = () => {
            return permissions.includes('Other');
        };

        // For backwards compatibility or default routing, we can still allow 'Discovery'
        // If 'Discovery' is the active tab but it's now split, we might want to default to the first available one
        const isAllowed = permissions.includes(activeTab) ||
            (activeTab === 'Discovery' && hasDiscoveryPermission()) ||
            (activeTab.startsWith('Discovery:') && hasDiscoveryPermission(activeTab.split(':')[1])) ||
            (activeTab === 'Tour' && hasTourPermission()) ||
            (activeTab.startsWith('Tour:') && hasTourPermission(activeTab.split(':')[1])) ||
            (activeTab === 'AI:Harvester' || activeTab === 'AI:Settings') ||
            (activeTab === 'Help Control' && hasOtherPermission()) ||
            (activeTab === 'Blogs' && hasOtherPermission());

        if (!isAllowed) {
            return (
                <div className="flex flex-col items-center justify-center h-[50vh] md:h-[60vh] text-gray-500 px-4 text-center">
                    <RiShieldCheckLine size={64} className="mb-4 opacity-20" />
                    <h2 className="text-xl font-medium Inter">Access Restricted</h2>
                    <p className="text-sm">You don't have permission to access the {activeTab} section.</p>
                </div>
            );
        }

        switch (activeTab) {
            case 'Landing':
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-center md:text-left">Landing Content</h1>
                        <HomeCitiesClient />
                    </div>
                )

            case 'Tour:All':
            case 'Tour': // For backwards compatibility
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-center md:text-left">All Tours</h1>
                        <AddTourClient />
                    </div>
                )

            case 'Tour:Requests':
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-center md:text-left">Tour Requests</h1>
                        <TourRequestsClient />
                    </div>
                )

            case 'Tour:VendorTours':
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-center md:text-left">Vendor Tour Submissions</h1>
                        <VendorTourApprovalClient />
                    </div>
                )

            case 'Discovery:Sightseeing':
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-center md:text-left">Sightseeing</h1>
                        <AddSightseeingClient showManagementBox={true} showListings={true} />
                    </div>
                )

            case 'Discovery:Rentals':
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-center md:text-left">Rentals</h1>
                        <AddRentalsClient showManagementBox={true} showListings={true} />
                    </div>
                )

            case 'Discovery:Activities':
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-center md:text-left">Activities</h1>
                        <AddActivitiesClient showManagementBox={true} showListings={true} />
                    </div>
                )

            case 'Discovery:Attractions':
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-center md:text-left">Attractions</h1>
                        <AddAttractionsClient showManagementBox={true} showListings={true} />
                    </div>
                )

            case 'Discovery:Food':
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-center md:text-left">Food & Cafes</h1>
                        <AddFoodClient showManagementBox={true} showListings={true} />
                    </div>
                )

            case 'Discovery:Stay':
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-center md:text-left">Stay</h1>
                        <AddStayClient showManagementBox={true} showListings={true} />
                    </div>
                )

            case 'Discovery:Emergency':
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-center md:text-left">Emergency Setup</h1>
                        <AddHelplineClient showManagementBox={true} showListings={true} />
                    </div>
                )

            case 'Discovery': // Fallback if needed, though they should route to specific ones now
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-center md:text-left">Discovery Overview</h1>
                        <p className="text-gray-600">Please select a specific Discovery category from the sidebar menu.</p>
                    </div>
                )

            case 'Backpackers':
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-center md:text-left">Backpackers</h1>
                        <AddHostedBackpackerClient />
                    </div>
                )

            case 'Vendor Requests':
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-center md:text-left">Vendor Requests</h1>
                        <VendorRequestsClient />
                    </div>
                )

            case 'Team':
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-center md:text-left">Team</h1>
                        <TeamManagementClient />
                    </div>
                )
            
            case 'Blogs':
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-center md:text-left">Blogs</h1>
                        <BlogManagementClient />
                    </div>
                )

            case 'Help Control':
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-center md:text-left">Help Control</h1>
                        <HelpControlClient />
                    </div>
                )

            case 'AI:Harvester':
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-center md:text-left">AI Harvester</h1>
                        <AIHarvesterClient />
                    </div>
                )

            case 'AI:Settings':
                return (
                    <div className="space-y-6">
                        <AISettingsClient />
                    </div>
                )

            case 'Overview':
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-center md:text-left">Overview</h1>
                    </div>
                )

            default:
                return (
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4 md:mb-6 Inter text-center md:text-left">{activeTab}</h1>
                        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Coming Soon</h2>
                            <p className="text-gray-600">This section is under development.</p>
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="flex min-h-screen bg-white font-sans">
            {/* Sidebar */}
            <Sidebar
                user={adminUser}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isAdmin={true}
                permissions={adminUser.permissions}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                hasPendingTourRequests={hasPendingTourRequests}
                hasPendingVendorTours={hasPendingVendorTours}
                hasPendingVendorRequests={hasPendingVendorRequests}
                hasPendingBackpackers={hasPendingBackpackers}
            />

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 pt-4 md:p-8 lg:p-12 overflow-y-auto w-full transition-all duration-300">
                <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
                    <TopBar
                        onNavigate={setActiveTab}
                        isAdmin={true}
                        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    />

                    {/* Dynamic Content Area */}
                    <div className="fade-in-up">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AdminDashboardClient
