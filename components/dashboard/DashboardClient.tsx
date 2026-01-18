'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';

// Import actual content components
import UserProfileCard from '@/components/dashboard/UserProfileCard';
import TripsCard from '@/components/dashboard/TripsCard';
import PreferencesCard from '@/components/dashboard/PreferencesCard';
import SafetyCard from '@/components/dashboard/SafetyCard';
import ActivityFeedCard from '@/components/dashboard/ActivityFeedCard';
import InsightsCard from '@/components/dashboard/InsightsCard';
import Notification from '@/components/dashboard/Notification';

interface DashboardClientProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        id?: string;
    };
}

const DashboardClient: React.FC<DashboardClientProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState('UserProfileCard');

    const renderContent = () => {
        switch (activeTab) {
            case 'UserProfileCard':
                return <UserProfileCard />;
            case 'Trips':
                return <TripsCard />;
            case 'PreferencesCard':
                return <PreferencesCard />;
            case 'SafetyCard':
                return <SafetyCard />;
            case 'ActivityFeedCard':
                return <ActivityFeedCard />;
            case 'InsightsCard':
                return <InsightsCard />;
            case 'Notification':
                return <Notification />;
            default:
                return <UserProfileCard />;
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F2F5F8] font-sans">
            {/* Sidebar with state control */}
            <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-8">
                    <TopBar onNavigate={setActiveTab} />

                    {/* Dynamic Content Area */}
                    <div className="fade-in-up">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardClient;
