'use client'

import { useState } from 'react'
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
    const [activeDiscoveryForm, setActiveDiscoveryForm] = useState<'sightseeing' | 'rentals' | 'activities' | 'attractions' | 'food' | 'stay' | null>(null)
    const router = useRouter()

    const renderContent = () => {
        const permissions = adminUser.permissions || [];

        const hasDiscoveryPermission = (subSection?: string) => {
            if (permissions.includes('Discovery')) return true;
            if (!subSection) {
                return permissions.some(p => p.startsWith('Discovery:'));
            }
            return permissions.includes(`Discovery:${subSection}`);
        };

        // Check if current tab is allowed
        const isAllowed = permissions.includes(activeTab) || (activeTab === 'Discovery' && hasDiscoveryPermission());

        if (!isAllowed) {
            return (
                <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
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
                        <h1 className="text-3xl font-medium text-gray-800 mb-6 Inter">Landing</h1>
                    </div>
                )

            case 'Tour':
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-medium text-gray-800 mb-6 Inter">Tour</h1>
                        <AddTourClient />
                    </div>
                )

            case 'Discovery':
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-medium text-gray-800 mb-6 Inter">Discovery</h1>

                        {/* Full-width form when active - appears at top */}
                        {activeDiscoveryForm === 'sightseeing' && hasDiscoveryPermission('Sightseeing') && (
                            <AddSightseeingClient
                                showManagementBox={false}
                                showListings={false}
                                showFormDirectly={true}
                                onFormClose={() => setActiveDiscoveryForm(null)}
                            />
                        )}

                        {activeDiscoveryForm === 'rentals' && hasDiscoveryPermission('Rentals') && (
                            <AddRentalsClient
                                showManagementBox={false}
                                showListings={false}
                                showFormDirectly={true}
                                onFormClose={() => setActiveDiscoveryForm(null)}
                            />
                        )}

                        {activeDiscoveryForm === 'activities' && hasDiscoveryPermission('Activities') && (
                            <AddActivitiesClient
                                showManagementBox={false}
                                showListings={false}
                                showFormDirectly={true}
                                onFormClose={() => setActiveDiscoveryForm(null)}
                            />
                        )}

                        {activeDiscoveryForm === 'attractions' && hasDiscoveryPermission('Attractions') && (
                            <AddAttractionsClient
                                showManagementBox={false}
                                showListings={false}
                                showFormDirectly={true}
                                onFormClose={() => setActiveDiscoveryForm(null)}
                            />
                        )}

                        {activeDiscoveryForm === 'food' && hasDiscoveryPermission('Food') && (
                            <AddFoodClient
                                showManagementBox={false}
                                showListings={false}
                                showFormDirectly={true}
                                onFormClose={() => setActiveDiscoveryForm(null)}
                            />
                        )}

                        {activeDiscoveryForm === 'stay' && hasDiscoveryPermission('Stay') && (
                            <AddStayClient
                                showManagementBox={false}
                                showListings={false}
                                showFormDirectly={true}
                                onFormClose={() => setActiveDiscoveryForm(null)}
                            />
                        )}

                        {/* Row 1: Management Boxes - Side by Side (hidden when form is open) */}
                        {!activeDiscoveryForm && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {hasDiscoveryPermission('Sightseeing') && (
                                    <AddSightseeingClient
                                        showManagementBox={true}
                                        showListings={false}
                                        onFormOpen={() => setActiveDiscoveryForm('sightseeing')}
                                    />
                                )}
                                {hasDiscoveryPermission('Rentals') && (
                                    <AddRentalsClient
                                        showManagementBox={true}
                                        showListings={false}
                                        onFormOpen={() => setActiveDiscoveryForm('rentals')}
                                    />
                                )}
                                {hasDiscoveryPermission('Activities') && (
                                    <AddActivitiesClient
                                        showManagementBox={true}
                                        showListings={false}
                                        onFormOpen={() => setActiveDiscoveryForm('activities')}
                                    />
                                )}
                                {hasDiscoveryPermission('Attractions') && (
                                    <AddAttractionsClient
                                        showManagementBox={true}
                                        showListings={false}
                                        onFormOpen={() => setActiveDiscoveryForm('attractions')}
                                    />
                                )}
                                {hasDiscoveryPermission('Food') && (
                                    <AddFoodClient
                                        showManagementBox={true}
                                        showListings={false}
                                        onFormOpen={() => setActiveDiscoveryForm('food')}
                                    />
                                )}
                                {hasDiscoveryPermission('Stay') && (
                                    <AddStayClient
                                        showManagementBox={true}
                                        showListings={false}
                                        onFormOpen={() => setActiveDiscoveryForm('stay')}
                                    />
                                )}
                            </div>
                        )}

                        {/* Row 2: Listings */}
                        {hasDiscoveryPermission('Sightseeing') && <AddSightseeingClient showManagementBox={false} showListings={true} />}
                        {hasDiscoveryPermission('Rentals') && <AddRentalsClient showManagementBox={false} showListings={true} />}
                        {hasDiscoveryPermission('Activities') && <AddActivitiesClient showManagementBox={false} showListings={true} />}
                        {hasDiscoveryPermission('Attractions') && <AddAttractionsClient showManagementBox={false} showListings={true} />}
                        {hasDiscoveryPermission('Food') && <AddFoodClient showManagementBox={false} showListings={true} />}
                        {hasDiscoveryPermission('Stay') && <AddStayClient showManagementBox={false} showListings={true} />}
                    </div>
                )

            case 'Backpackers':
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-medium text-gray-800 mb-6 Inter">Backpackers</h1>
                        <AddHostedBackpackerClient />
                    </div>
                )

            case 'Team':
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-medium text-gray-800 mb-6 Inter">Team</h1>
                        <TeamManagementClient />
                    </div>
                )

            case 'Overview':
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-medium text-gray-800 mb-6 Inter">Overview</h1>
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

    return (
        <div className="flex min-h-screen bg-white font-sans">
            {/* Sidebar */}
            <Sidebar
                user={adminUser}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isAdmin={true}
                permissions={adminUser.permissions}
            />

            {/* Main Content */}
            <main className="flex-1 ml-52 p-8 lg:p-12 overflow-y-auto">
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

export default AdminDashboardClient
