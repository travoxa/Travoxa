'use client'

import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import { useRouter } from 'next/navigation'

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
    }
}

const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({ adminUser }) => {
    const [activeTab, setActiveTab] = useState('Overview')
    const [activeDiscoveryForm, setActiveDiscoveryForm] = useState<'sightseeing' | 'rentals' | 'activities' | 'attractions' | 'food' | 'stay' | null>(null)
    const router = useRouter()

    const renderContent = () => {
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
                        {activeDiscoveryForm === 'sightseeing' && (
                            <AddSightseeingClient
                                showManagementBox={false}
                                showListings={false}
                                showFormDirectly={true}
                                onFormClose={() => setActiveDiscoveryForm(null)}
                            />
                        )}

                        {activeDiscoveryForm === 'rentals' && (
                            <AddRentalsClient
                                showManagementBox={false}
                                showListings={false}
                                showFormDirectly={true}
                                onFormClose={() => setActiveDiscoveryForm(null)}
                            />
                        )}

                        {activeDiscoveryForm === 'activities' && (
                            <AddActivitiesClient
                                showManagementBox={false}
                                showListings={false}
                                showFormDirectly={true}
                                onFormClose={() => setActiveDiscoveryForm(null)}
                            />
                        )}

                        {activeDiscoveryForm === 'attractions' && (
                            <AddAttractionsClient
                                showManagementBox={false}
                                showListings={false}
                                showFormDirectly={true}
                                onFormClose={() => setActiveDiscoveryForm(null)}
                            />
                        )}

                        {activeDiscoveryForm === 'food' && (
                            <AddFoodClient
                                showManagementBox={false}
                                showListings={false}
                                showFormDirectly={true}
                                onFormClose={() => setActiveDiscoveryForm(null)}
                            />
                        )}

                        {activeDiscoveryForm === 'stay' && (
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
                                <AddSightseeingClient
                                    showManagementBox={true}
                                    showListings={false}
                                    onFormOpen={() => setActiveDiscoveryForm('sightseeing')}
                                />
                                <AddRentalsClient
                                    showManagementBox={true}
                                    showListings={false}
                                    onFormOpen={() => setActiveDiscoveryForm('rentals')}
                                />
                                <AddActivitiesClient
                                    showManagementBox={true}
                                    showListings={false}
                                    onFormOpen={() => setActiveDiscoveryForm('activities')}
                                />
                                <AddAttractionsClient
                                    showManagementBox={true}
                                    showListings={false}
                                    onFormOpen={() => setActiveDiscoveryForm('attractions')}
                                />
                                <AddFoodClient
                                    showManagementBox={true}
                                    showListings={false}
                                    onFormOpen={() => setActiveDiscoveryForm('food')}
                                />
                                <AddStayClient
                                    showManagementBox={true}
                                    showListings={false}
                                    onFormOpen={() => setActiveDiscoveryForm('stay')}
                                />
                            </div>
                        )}

                        {/* Row 2: Listings */}
                        <AddSightseeingClient showManagementBox={false} showListings={true} />
                        <AddRentalsClient showManagementBox={false} showListings={true} />
                        <AddActivitiesClient showManagementBox={false} showListings={true} />
                        <AddAttractionsClient showManagementBox={false} showListings={true} />
                        <AddFoodClient showManagementBox={false} showListings={true} />
                        <AddStayClient showManagementBox={false} showListings={true} />
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
            <Sidebar user={adminUser} activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={true} />

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
