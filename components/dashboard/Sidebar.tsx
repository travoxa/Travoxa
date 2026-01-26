'use client';

import Image from 'next/image';
import {
    RiUserLine,
    RiMapPinLine,
    RiSettings4Line,
    RiShieldCheckLine,
    RiFileListLine,
    RiBarChartLine,
    RiNotification3Line,
    RiLogoutBoxLine,
    RiCloseLine,
    RiHomeLine,
    RiCompass3Line,
    RiGroupLine
} from 'react-icons/ri';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { getFirebaseAuth } from '@/lib/firebaseAuth';
import { signOut as firebaseSignOut } from "firebase/auth";

interface SidebarProps {
    user?: { name?: string | null, email?: string | null, image?: string | null };
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isAdmin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeTab, setActiveTab, isAdmin = false }) => {
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    const handleSignOut = async () => {
        if (isAdmin) {
            // Admin logout - redirect to admin login
            window.location.href = '/api/admin/logout';
        } else {
            // User logout
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
        }
    };


    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[#F2F5F8] px-6 py-8 hidden md:flex flex-col justify-between font-sans">
            {/* Branding */}
            <div>
                <div className="flex items-center gap-3 mb-10 pl-2 h-[50px]">
                    <button onClick={() => window.location.href = '/'} className="cursor-pointer">
                        <Image
                            src="/logo.png"
                            alt="Travoxa"
                            width={130}
                            height={50}
                            style={{ width: "auto", height: "40px" }}
                            className="object-contain"
                        />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                    {isAdmin ? (
                        <>
                            <NavItem
                                icon={<RiBarChartLine size={20} />}
                                label="Overview"
                                id="Overview"
                                activeTab={activeTab}
                                onClick={setActiveTab}
                            />
                            <NavItem
                                icon={<RiHomeLine size={20} />}
                                label="Landing"
                                id="Landing"
                                activeTab={activeTab}
                                onClick={setActiveTab}
                            />
                            <NavItem
                                icon={<RiCompass3Line size={20} />}
                                label="Tour"
                                id="Tour"
                                activeTab={activeTab}
                                onClick={setActiveTab}
                            />
                            <NavItem
                                icon={<RiMapPinLine size={20} />}
                                label="Discovery"
                                id="Discovery"
                                activeTab={activeTab}
                                onClick={setActiveTab}
                            />
                            <NavItem
                                icon={<RiGroupLine size={20} />}
                                label="Team"
                                id="Team"
                                activeTab={activeTab}
                                onClick={setActiveTab}
                            />
                        </>
                    ) : (
                        <>
                            <NavItem
                                icon={<RiUserLine size={20} />}
                                label="Profile"
                                id="UserProfileCard"
                                activeTab={activeTab}
                                onClick={setActiveTab}
                            />
                            <NavItem
                                icon={<RiMapPinLine size={20} />}
                                label="Trips"
                                id="Trips"
                                activeTab={activeTab}
                                onClick={setActiveTab}
                            />
                            <NavItem
                                icon={<RiSettings4Line size={20} />}
                                label="Preferences"
                                id="PreferencesCard"
                                activeTab={activeTab}
                                onClick={setActiveTab}
                            />
                            <NavItem
                                icon={<RiShieldCheckLine size={20} />}
                                label="Safety"
                                id="SafetyCard"
                                activeTab={activeTab}
                                onClick={setActiveTab}
                            />
                            <NavItem
                                icon={<RiFileListLine size={20} />}
                                label="Activity"
                                id="ActivityFeedCard"
                                activeTab={activeTab}
                                onClick={setActiveTab}
                            />
                            <NavItem
                                icon={<RiBarChartLine size={20} />}
                                label="Insights"
                                id="InsightsCard"
                                activeTab={activeTab}
                                onClick={setActiveTab}
                            />
                            <NavItem
                                icon={<RiNotification3Line size={20} />}
                                label="Notifications"
                                id="Notification"
                                activeTab={activeTab}
                                onClick={setActiveTab}
                            />
                            <button
                                onClick={() => setShowLogoutPopup(true)}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-full transition-all duration-200 group text-red-500 hover:bg-red-50 hover:text-red-600"
                            >
                                <div className="flex items-center gap-3">
                                    <span><RiLogoutBoxLine size={20} /></span>
                                    <span className="text-sm font-medium">Logout</span>
                                </div>
                            </button>
                        </>
                    )}
                </nav>
            </div>

            {/* User Profile - Only show if NOT admin */}
            {!isAdmin && (
                <div className="flex flex-col items-center text-center mt-auto">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full overflow-hidden border-2 border-white bg-gray-200">
                        {user?.image ? (
                            <img src={user.image} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-bold text-lg">
                                {user?.name?.[0] || 'U'}
                            </div>
                        )}
                    </div>
                    <h4 className="text-sm font-bold text-gray-900">{user?.name || 'User'}</h4>
                    <p className="text-xs text-gray-500 truncate w-full">{user?.email || ''}</p>
                </div>
            )}

            {/* Logout Confirmation Popup */}
            {
                showLogoutPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                        <div className="bg-white p-8 rounded-xl w-full max-w-lg relative text-center">
                            <button
                                onClick={() => setShowLogoutPopup(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <RiCloseLine size={24} />
                            </button>

                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <RiLogoutBoxLine size={32} />
                            </div>

                            <h3 className="text-xl font-light text-gray-900 mb-2">Logout</h3>
                            <p className="text-sm text-gray-600 mb-8 px-4">
                                Are you sure you want to log out? You'll need to sign in again to access your account.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutPopup(false)}
                                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSignOut}
                                    className="flex-1 px-4 py-3 border border-red-500 text-red-500 bg-white text-sm font-medium rounded-lg hover:bg-red-50 transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </aside >
    );
};

const NavItem = ({
    icon,
    label,
    id,
    activeTab,
    onClick
}: {
    icon: any,
    label: string,
    id: string,
    activeTab: string,
    onClick: (id: string) => void
}) => {
    const active = activeTab === id;
    return (
        <button
            onClick={() => onClick(id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${active
                ? 'bg-white text-gray-900 font-semibold'
                : 'text-gray-500 hover:bg-white hover:text-gray-900'
                }`}
        >
            <div className="flex items-center gap-3">
                <span>{icon}</span>
                <span className="text-sm font-medium">{label}</span>
            </div>
        </button>
    );
};

export default Sidebar;
