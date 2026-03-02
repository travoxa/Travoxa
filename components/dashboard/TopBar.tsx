import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RiSearchLine, RiArrowLeftLine, RiMapPinLine, RiUserLine, RiSettings4Line, RiShieldCheckLine, RiFileListLine, RiBarChartLine, RiNotification3Line, RiCompass3Line, RiHomeLine, RiRobotLine, RiLogoutBoxLine, RiMenuLine } from 'react-icons/ri';
import Notification from '@/components/dashboard/Notification';

interface SearchItem {
    id: string;
    label: string;
    type: 'tab' | 'route';
    icon: any;
    path?: string; // For routes
    tabId?: string; // For tabs
}

interface TopBarProps {
    onNavigate?: (tab: string) => void;
    isAdmin?: boolean;
    notifications?: any[];
    onMarkAllSeen?: () => Promise<void>;
    onToggleSidebar?: () => void;
}

const TopBar = ({ onNavigate, isAdmin = false, notifications = [], onMarkAllSeen, onToggleSidebar }: TopBarProps) => {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    const searchItems: SearchItem[] = [
        // Dashboard Tabs
        { id: 'profile', label: 'User Profile', type: 'tab', icon: <RiUserLine />, tabId: 'UserProfileCard' },
        { id: 'trips', label: 'My Trips', type: 'tab', icon: <RiMapPinLine />, tabId: 'Trips' },
        { id: 'preferences', label: 'Preferences', type: 'tab', icon: <RiSettings4Line />, tabId: 'PreferencesCard' },
        { id: 'safety', label: 'Safety Settings', type: 'tab', icon: <RiShieldCheckLine />, tabId: 'SafetyCard' },
        { id: 'activity', label: 'Activity Feed', type: 'tab', icon: <RiFileListLine />, tabId: 'ActivityFeedCard' },
        { id: 'insights', label: 'Travel Insights', type: 'tab', icon: <RiBarChartLine />, tabId: 'InsightsCard' },
        // { id: 'notifications', label: 'Notifications', type: 'tab', icon: <RiNotification3Line />, tabId: 'Notification' },

        // Detailed Profile Items
        { id: 'profile-name', label: 'Name (Profile)', type: 'tab', icon: <RiUserLine />, tabId: 'UserProfileCard' },
        { id: 'profile-email', label: 'Email (Profile)', type: 'tab', icon: <RiUserLine />, tabId: 'UserProfileCard' },
        { id: 'profile-phone', label: 'Phone Number (Profile)', type: 'tab', icon: <RiUserLine />, tabId: 'UserProfileCard' },
        { id: 'profile-gender', label: 'Gender (Profile)', type: 'tab', icon: <RiUserLine />, tabId: 'UserProfileCard' },
        { id: 'profile-dob', label: 'Date of Birth (Profile)', type: 'tab', icon: <RiUserLine />, tabId: 'UserProfileCard' },
        { id: 'profile-city', label: 'City / Location (Profile)', type: 'tab', icon: <RiUserLine />, tabId: 'UserProfileCard' },
        { id: 'profile-languages', label: 'Languages Spoken (Profile)', type: 'tab', icon: <RiUserLine />, tabId: 'UserProfileCard' },
        { id: 'profile-bio', label: 'Bio / About (Profile)', type: 'tab', icon: <RiUserLine />, tabId: 'UserProfileCard' },
        { id: 'profile-exp', label: 'Travel Experience (Profile)', type: 'tab', icon: <RiCompass3Line />, tabId: 'UserProfileCard' },
        { id: 'profile-comfort', label: 'Comfort Level (Profile)', type: 'tab', icon: <RiCompass3Line />, tabId: 'UserProfileCard' },
        { id: 'profile-mode', label: 'Preferred Travel Mode (Profile)', type: 'tab', icon: <RiCompass3Line />, tabId: 'UserProfileCard' },
        { id: 'profile-interests', label: 'Interests & Hobbies (Profile)', type: 'tab', icon: <RiCompass3Line />, tabId: 'UserProfileCard' },
        { id: 'profile-activity', label: 'Activity Interests (Profile)', type: 'tab', icon: <RiCompass3Line />, tabId: 'UserProfileCard' },

        // Profile Preferences
        { id: 'profile-smoking', label: 'Smoking Preference (Profile)', type: 'tab', icon: <RiSettings4Line />, tabId: 'UserProfileCard' },
        { id: 'profile-drinking', label: 'Drinking Preference (Profile)', type: 'tab', icon: <RiSettings4Line />, tabId: 'UserProfileCard' },
        { id: 'profile-food', label: 'Food Preference (Profile)', type: 'tab', icon: <RiSettings4Line />, tabId: 'UserProfileCard' },
        { id: 'profile-accom', label: 'Share Accommodation (Profile)', type: 'tab', icon: <RiSettings4Line />, tabId: 'UserProfileCard' },

        // Profile Availability & Logistics
        { id: 'profile-weekday', label: 'Weekday Availability (Profile)', type: 'tab', icon: <RiFileListLine />, tabId: 'UserProfileCard' },
        { id: 'profile-weekend', label: 'Weekend Availability (Profile)', type: 'tab', icon: <RiFileListLine />, tabId: 'UserProfileCard' },
        { id: 'profile-shortnotice', label: 'Short Notice Travel (Profile)', type: 'tab', icon: <RiFileListLine />, tabId: 'UserProfileCard' },
        { id: 'profile-bike', label: 'Bike / Transport (Profile)', type: 'tab', icon: <RiMapPinLine />, tabId: 'UserProfileCard' },
        { id: 'profile-license', label: 'Driving License (Profile)', type: 'tab', icon: <RiMapPinLine />, tabId: 'UserProfileCard' },
        { id: 'profile-helmet', label: 'Helmet Possession (Profile)', type: 'tab', icon: <RiMapPinLine />, tabId: 'UserProfileCard' },

        // Profile Safety & Emergency
        { id: 'profile-emergency-name', label: 'Emergency Contact Name (Profile)', type: 'tab', icon: <RiShieldCheckLine />, tabId: 'UserProfileCard' },
        { id: 'profile-emergency-phone', label: 'Emergency Contact Phone (Profile)', type: 'tab', icon: <RiShieldCheckLine />, tabId: 'UserProfileCard' },
        { id: 'profile-medical', label: 'Medical Conditions (Profile)', type: 'tab', icon: <RiShieldCheckLine />, tabId: 'UserProfileCard' },
        { id: 'profile-allergies', label: 'Allergies (Profile)', type: 'tab', icon: <RiShieldCheckLine />, tabId: 'UserProfileCard' },
        { id: 'profile-social', label: 'Social Profile Link (Profile)', type: 'tab', icon: <RiUserLine />, tabId: 'UserProfileCard' },

        // App Routes
        { id: 'home', label: 'Home Page', type: 'route', icon: <RiHomeLine />, path: '/' },
        { id: 'discovery', label: 'Discovery', type: 'route', icon: <RiCompass3Line />, path: '/travoxa-discovery' },
        { id: 'ai-planner', label: 'AI Trip Planner', type: 'route', icon: <RiRobotLine />, path: '/ai-trip-planner' },
        { id: 'sightseeing', label: 'Sightseeing', type: 'route', icon: <RiCompass3Line />, path: '/travoxa-discovery/sightseeing' },
    ];

    useEffect(() => {
        if (query.trim() === '') {
            setSuggestions([]);
        } else {
            const lowerQuery = query.toLowerCase();
            const filtered = searchItems.filter(item =>
                item.label.toLowerCase().includes(lowerQuery)
            );
            setSuggestions(filtered);
        }
    }, [query]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                // Don't close immediately if clicking the bell itself, but bell click toggles so this is fine if we check target
                // Actually easier to just not have a click outside for now or handle it carefully. 
                // Standard logic:
            }
        };

        const handleNotificationClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('mousedown', handleNotificationClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('mousedown', handleNotificationClickOutside);
        };
    }, [wrapperRef, notificationRef]);

    const handleSelect = (item: SearchItem) => {
        if (item.type === 'tab' && item.tabId && onNavigate) {
            onNavigate(item.tabId);
        } else if (item.type === 'route' && item.path) {
            router.push(item.path);
        }
        setQuery('');
        setIsFocused(false);
    };

    const toggleNotifications = () => {
        if (!showNotifications && onMarkAllSeen) {
            onMarkAllSeen();
        }
        setShowNotifications(!showNotifications);
    };

    const hasUnread = notifications.some(n => !n.seen);

    return (
        <div className="flex items-center justify-between mb-8 md:mb-11 p-1 h-[50px]">
            {/* Mobile Menu Toggle */}
            <button
                onClick={onToggleSidebar}
                className="md:hidden p-2 -ml-2 text-gray-600 hover:text-black transition-colors"
                aria-label="Toggle menu"
            >
                <RiMenuLine size={24} />
            </button>

            {/* Search - Capsule border, aligned with content */}
            <div className="relative w-full md:w-96 mx-2 md:mx-0" ref={wrapperRef}>
                <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search dashboard or explore..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    className="w-full pl-12 pr-4 py-3 bg-white rounded-full text-sm text-gray-700 outline-none border border-gray-200 focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-all font-medium placeholder:font-medium placeholder:text-gray-400"
                />

                {/* Suggestions Dropdown */}
                {isFocused && query.trim() !== '' && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-100 overflow-hidden z-50 py-2 shadow-sm">
                        {suggestions.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 text-left transition-colors group"
                            >
                                <span className="text-gray-400 group-hover:text-black transition-colors">{item.icon}</span>
                                <div>
                                    <p className="text-sm font-medium text-gray-700 group-hover:text-black">{item.label}</p>
                                    <p className="text-xs text-gray-400">{item.type === 'tab' ? 'Dashboard' : 'Page'}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
                {isFocused && query.trim() !== '' && suggestions.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-100 overflow-hidden z-50 py-4 text-center">
                        <p className="text-sm text-gray-500">No results found.</p>
                    </div>
                )}
            </div>

            {/* Back Button or Logout Button - Capsule design */}
            <div className="flex items-center gap-3">

                {/* Notification Bell */}
                {!isAdmin && (
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={toggleNotifications}
                            className={`w-11 h-11 flex items-center justify-center rounded-full border transition-all ${showNotifications ? 'bg-gray-100 border-gray-300 text-black' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-black'}`}
                        >
                            <RiNotification3Line size={20} />
                            {hasUnread && (
                                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden z-50">
                                <Notification notifications={notifications} isInDropdown={true} />
                            </div>
                        )}
                    </div>
                )}

                {isAdmin ? (
                    <button
                        onClick={() => window.location.href = '/api/admin/logout'}
                        className="flex items-center gap-2 p-2 md:px-6 md:py-3 bg-transparent md:bg-white md:hover:bg-red-50 md:border md:border-red-200 text-red-500 rounded-full text-sm font-bold transition-all group"
                    >
                        <RiLogoutBoxLine size={24} className="md:size-[18px] group-hover:translate-x-1 transition-transform" />
                        <span className="hidden md:inline">Logout</span>
                    </button>
                ) : (
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-full text-sm font-bold transition-all group"
                    >
                        <RiArrowLeftLine className="group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>
                )}
            </div>
        </div>
    );
};

export default TopBar;
