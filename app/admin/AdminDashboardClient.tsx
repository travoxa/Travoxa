'use client'

import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import { useRouter } from 'next/navigation'

// Admin-specific components
// import AddLocationClient from '@/app/admin/add-locations/AddLocationClient'

interface AdminDashboardClientProps {
    adminUser: {
        name: string
        email: string
    }
}

const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({ adminUser }) => {
    const [activeTab, setActiveTab] = useState('Overview')
    const router = useRouter()

    const renderContent = () => {
        switch (activeTab) {
            case 'Landing':
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <h1 className="text-4xl font-bold text-gray-800">Landing</h1>
                        </div>
                    </div>
                )

            case 'Overview':
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <h1 className="text-4xl font-bold text-gray-800">ADMIN</h1>
                        </div>
                    </div>
                )

            default:
                return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Coming Soon</h2>
                        <p className="text-gray-600">This section is under development.</p>
                    </div>
                )
        }
    }

    return (
        <div className="flex min-h-screen bg-[#F2F5F8] font-sans">
            {/* Sidebar */}
            <Sidebar user={adminUser} activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={true} />

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto">
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
