'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import Image from 'next/image';
import { RiNotification3Line, RiLogoutBoxLine } from 'react-icons/ri';
import { signOut } from 'next-auth/react';
import { getFirebaseAuth } from '@/lib/firebaseAuth';
import { signOut as firebaseSignOut } from "firebase/auth";


// Import actual content components
import UserProfileCard from '@/components/dashboard/UserProfileCard';
import TripsCard from '@/components/dashboard/TripsCard';
import PreferencesCard from '@/components/dashboard/PreferencesCard';
import SafetyCard from '@/components/dashboard/SafetyCard';
import ActivityFeedCard from '@/components/dashboard/ActivityFeedCard';
import InsightsCard from '@/components/dashboard/InsightsCard';
import Notification from '@/components/dashboard/Notification';
import Footor from '@/components/ui/Footor';

interface DashboardClientProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        id?: string;
        notifications?: any[];
    };
    createdGroups?: any[];
    tourRequests?: any[];
}

const DashboardClient: React.FC<DashboardClientProps> = ({ user, createdGroups = [], tourRequests = [] }) => {
    const [activeTab, setActiveTab] = useState('UserProfileCard');
    const [showMobileNotifications, setShowMobileNotifications] = useState(false);
    // Local state for notifications to handle optimistic updates
    const [notifications, setNotifications] = useState(user.notifications || []);


    const handleSignOut = async () => {
        try {
            const firebaseAuth = getFirebaseAuth();
            if (firebaseAuth) {
                await firebaseSignOut(firebaseAuth);
            }
            await signOut({ callbackUrl: '/login' });
        } catch (error) {
            console.error("Error signing out:", error);
            await signOut({ callbackUrl: '/login' });
        }
    };

    const handleMarkAllSeen = async () => {
        // Optimistic update
        const updatedNotifications = notifications.map(n => ({ ...n, seen: true }));
        setNotifications(updatedNotifications);

        try {
            await fetch('/api/users/notifications/mark-seen', { method: 'POST' });
        } catch (error) {
            console.error("Failed to mark notifications as seen", error);
            // Revert if needed, but usually fine to leave as read in UI
        }
    };

    const tabTitles: { [key: string]: string } = {
        'UserProfileCard': 'Profile',
        'Trips': 'Trips',
        'PreferencesCard': 'Preferences',
        'SafetyCard': 'Safety',
        'ActivityFeedCard': 'Activity',
        'InsightsCard': 'Insights',
        // 'Notification': 'Notifications' // Removed
    };

    const renderContent = () => {

        switch (activeTab) {
            case 'UserProfileCard':
                return <UserProfileCard />;
            case 'Trips':
                return <TripsCard createdGroups={createdGroups} tourRequests={tourRequests} />;
            case 'PreferencesCard':
                return <PreferencesCard />;
            case 'SafetyCard':
                return <SafetyCard />;
            case 'ActivityFeedCard':
                return <ActivityFeedCard />;
            case 'InsightsCard':
                return <InsightsCard />;
            // case 'Notification':
            //     return <Notification />;
            default:
                return <UserProfileCard />;
        }
    };

    return (
        <div className="flex min-h-screen bg-white font-sans">
            {/* Sidebar with state control */}
            <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-50 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={() => window.location.href = '/'} className="cursor-pointer">
                        <Image
                            src="/logo.png"
                            alt="Travoxa"
                            width={50}
                            height={20}
                            style={{ width: "auto", height: "12px" }}
                            className="object-contain"
                        />
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            setShowMobileNotifications(!showMobileNotifications);
                            if (!showMobileNotifications) handleMarkAllSeen();
                        }}
                        className={`text-gray-600 hover:text-black transition-colors relative ${showMobileNotifications ? 'text-black' : ''}`}
                    >
                        <RiNotification3Line size={18} />
                        {notifications.some(n => !n.seen) && <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>}
                    </button>

                    <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-50 border border-gray-50/50 md:border-gray-50">
                        {user.image ? (
                            <img src={user.image} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 font-bold text-[10px]">
                                {user.name?.[0] || 'U'}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full md:ml-64 p-2.5 pt-16 md:p-6 lg:p-8 overflow-y-auto">
                <div className="max-w-7xl space-y-6 md:space-y-8">
                    <div className="hidden md:block">
                        <TopBar
                            onNavigate={setActiveTab}
                            notifications={notifications}
                            onMarkAllSeen={handleMarkAllSeen}
                        />
                    </div>

                    {/* Dynamic Content Area */}
                    <div className="fade-in-up">
                        {/* Desktop: Tabbed Content */}
                        <div className="hidden md:block">
                            <h1 className="text-3xl font-medium text-gray-800 mb-6 Inter">
                                {tabTitles[activeTab] || 'Dashboard'}
                            </h1>
                            {renderContent()}
                        </div>

                        {/* Mobile: Stacked Content */}
                        <div className="md:hidden space-y-2.5 pb-12">
                            {showMobileNotifications && <Notification notifications={notifications} />}

                            <h2 className="text-lg font-bold text-gray-800 px-1 mt-4">Profile</h2>
                            <UserProfileCard />

                            <h2 className="text-lg font-bold text-gray-800 px-1 mt-6">Insights</h2>
                            <InsightsCard />

                            <h2 className="text-lg font-bold text-gray-800 px-1 mt-6">Trips</h2>
                            <TripsCard createdGroups={createdGroups} />

                            <h2 className="text-lg font-bold text-gray-800 px-1 mt-6">Preferences</h2>
                            <PreferencesCard />

                            <h2 className="text-lg font-bold text-gray-800 px-1 mt-6">Safety</h2>
                            <SafetyCard />

                            <h2 className="text-lg font-bold text-gray-800 px-1 mt-6">Activity</h2>
                            <ActivityFeedCard />

                            {/* Mobile Logout Button */}
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-2 px-6 py-2.5 bg-white rounded-full text-[#FF4B4B] font-semibold shadow-sm active:scale-[0.98] transition-all border border-gray-50/50 md:border-gray-50"
                            >
                                <RiLogoutBoxLine size={18} />
                                <span className="text-sm">Logout</span>
                            </button>
                        </div>

                    </div>

                </div>
                <div className="mt-12 md:hidden">
                    <Footor />
                </div>
            </main>
        </div>
    );
};

export default DashboardClient;
